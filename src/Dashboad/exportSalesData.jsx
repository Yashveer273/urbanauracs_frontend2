import React, { useMemo, useState } from 'react';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '../firebaseCon';
import * as XLSX from 'xlsx';
import {
  FileSpreadsheet,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CalculateConvenienceFee } from '../components/TexFee';

const ExportSalesData = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Main table pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Details table pagination
  const [selectedSale, setSelectedSale] = useState(null);
  const [detailsPage, setDetailsPage] = useState(1);
  const detailsItemsPerPage = 10;

  const getServiceDateKey = (value) => {
    if (!value) return null;

    /* Firestore Timestamp */
    if (typeof value === 'object' && typeof value.toDate === 'function') {
      const date = value.toDate();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    /* JavaScript Date */
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      const year = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, '0');
      const day = String(value.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    if (typeof value !== 'string') return null;

    const raw = value.trim();
    if (!raw) return null;

    /* 1) 4-digit Year First: YYYY-MM-DD or YYYY/MM/DD */
    const ymdMatch = raw.match(/^(\d{4})[-/.](\d{2})[-/.](\d{2})(?:[T\s].*)?$/);
    if (ymdMatch) {
      return `${ymdMatch[1]}-${ymdMatch[2]}-${ymdMatch[3]}`;
    }

    /* 2) 2-digit Year Match: YY-MM-DD or DD-MM-YY (e.g., "26-07-28" -> "2026-07-28") */
    const shortMatch = raw.match(/^(\d{2})[-/.](\d{2})[-/.](\d{2})(?:[T\s].*)?$/);
    if (shortMatch) {
      const p1 = parseInt(shortMatch[1], 10);
      const p2 = parseInt(shortMatch[2], 10);
      const p3 = parseInt(shortMatch[3], 10);

      // YY-MM-DD format (e.g. 26-07-28 where 26 is 2026, 07 is month)
      if (p1 >= 20 && p1 <= 99 && p2 >= 1 && p2 <= 12 && p3 >= 1 && p3 <= 31) {
        return `20${shortMatch[1]}-${shortMatch[2]}-${shortMatch[3]}`;
      }

      // DD-MM-YY format (e.g. 28-07-26 where 26 is 2026, 07 is month)
      if (p3 >= 20 && p3 <= 99 && p2 >= 1 && p2 <= 12 && p1 >= 1 && p1 <= 31) {
        return `20${shortMatch[3]}-${shortMatch[2]}-${shortMatch[1]}`;
      }
    }

    /* 3) 4-digit Year Last: DD-MM-YYYY or DD/MM/YYYY */
    const dmyMatch = raw.match(/^(\d{2})[-/.](\d{2})[-/.](\d{4})(?:[\sT].*)?$/);
    if (dmyMatch) {
      return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
    }

    /* Fallback for parseable date strings */
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) {
      let year = parsed.getFullYear();
      if (year < 100) year += 2000;
      const month = String(parsed.getMonth() + 1).padStart(2, '0');
      const day = String(parsed.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    return null;
  };

  const formatDateDDMMYY = (value) => {
    const dateKey = getServiceDateKey(value);
    if (!dateKey) return 'N/A';

    const [year, month, day] = dateKey.split('-');
    return `${day}-${month}-${year.slice(-2)}`;
  };

  const formatServiceDateTime = (dateValue, serviceTime) => {
    const formattedDate = formatDateDDMMYY(dateValue);
    if (
      serviceTime !== undefined &&
      serviceTime !== null &&
      String(serviceTime).trim() !== ''
    ) {
      return `${formattedDate} || ${serviceTime}`;
    }
    return formattedDate;
  };

  const getSelectedDateRange = () => {
    if (!startDate || !endDate) {
      return { finalStart: startDate, finalEnd: endDate };
    }
    if (startDate <= endDate) {
      return { finalStart: startDate, finalEnd: endDate };
    }
    return { finalStart: endDate, finalEnd: startDate };
  };

  const isServiceInRange = (serviceDate, rangeStart, rangeEnd) => {
    const serviceDateKey = getServiceDateKey(serviceDate);
    if (!serviceDateKey || !rangeStart || !rangeEnd) return false;
    return serviceDateKey >= rangeStart && serviceDateKey <= rangeEnd;
  };

  const getFilteredServices = (sale, rangeStart, rangeEnd) => {
    const cart = sale?.product_info?.cart || [];
    return cart.filter((item) =>
      isServiceInRange(
        item?.location_booking_time || sale?.date_time,
        rangeStart,
        rangeEnd
      )
    );
  };

  const calculateFilteredAmounts = (services) => {
    let orderAmount = 0;
    let convenienceFee = 0;

    services.forEach((item) => {
      const qty = Number(item?.quantity || 0);
      const itemPrice = Number(item?.item_price || 0);

      const itemOrderAmount = itemPrice * qty;
      const singleFee = CalculateConvenienceFee(itemPrice)?.convenienceFee || 0;
      const itemConvenienceFee = Number(singleFee) * qty;

      orderAmount += itemOrderAmount;
      convenienceFee += itemConvenienceFee;
    });

    const totalAmount = orderAmount + convenienceFee;

    return { orderAmount, convenienceFee, totalAmount };
  };

  const fetchData = async () => {
    if (!startDate || !endDate) {
      alert('Please select both dates');
      return;
    }

    setLoading(true);
    setPreviewData([]);
    setSelectedSale(null);
    setCurrentPage(1);
    setDetailsPage(1);

    const { finalStart, finalEnd } = getSelectedDateRange();

    try {
      const salesRef = collection(firestore, 'sales');
      const q = query(salesRef, orderBy('date_time', 'desc'));
      const querySnapshot = await getDocs(q);

      const rows = [];

      querySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        const filteredServices = getFilteredServices(data, finalStart, finalEnd);

        if (filteredServices.length === 0) return;

        rows.push({
          ...data,
          filteredServices,
          filteredAmounts: calculateFilteredAmounts(filteredServices),
        });
      });

      setPreviewData(rows);
    } catch (error) {
      console.error('Export Error:', error);
      alert('Failed to fetch sales data. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const flattenedForExcel = [];
    const { finalStart, finalEnd } = getSelectedDateRange();

    previewData.forEach((sale) => {
      const services = getFilteredServices(sale, finalStart, finalEnd);

      services.forEach((item) => {
        const dateVal = item?.location_booking_time || sale?.date_time;
        const serviceDateKey = getServiceDateKey(dateVal);
        if (!serviceDateKey) return;

        const displayServiceDate = formatDateDDMMYY(dateVal);
        const displayServiceDateTime = formatServiceDateTime(
          dateVal,
          item?.SelectedServiceTime
        );

        const qty = Number(item?.quantity || 0);
        const itemPrice = Number(item?.item_price || 0);
        const orderAmount = itemPrice * qty;
        const singleFee = CalculateConvenienceFee(itemPrice)?.convenienceFee || 0;
        const totalConvenienceFee = Number(singleFee) * qty;
        const totalAmount = orderAmount + totalConvenienceFee;

        flattenedForExcel.push({
          'ORDER ID': sale.orderId || sale.S_orderId || 'N/A',
          'S ORDER ID': sale.S_orderId || 'N/A',
          'SERVICE ID': item?.product_purchase_id || 'N/A',
          USERNAME: sale.name || 'N/A',
          'PHONE NUMBER': sale.phone_number || 'N/A',
          'SERVICE DETAILS': `${item?.product_name || ''} || ${item?.description || ''}`,
          'BOOKING DATE': displayServiceDate,
          'BOOKING DATE/TIME': displayServiceDateTime,
          'SERVICE DATE': displayServiceDate,
          'SERVICE DATE/TIME': displayServiceDateTime,
          'BOOKING ADDRESS': item?.bookingAddress || 'N/A',
          QUANTITY: qty,
          'ORDER AMOUNT': orderAmount,
          'CONVENIENCE FEE': totalConvenienceFee,
          'TOTAL AMOUNT': totalAmount,
          STATUS: item?.status || sale?.status || 'Pending',
          RESPONSIBLE: sale?.responsible || 'Not Assigned',
          RESPONSIBLE_VENDOR: sale?.responsibleVendor?.vendorName || 'Not Assigned',
          RESPONSIBLE_VENDOR_PHONE: sale?.responsibleVendor?.vendorPhoneNo || 'Not Assigned',
          RESPONSIBLE_LOCATION: sale?.responsibleVendor?.vendorLocation || 'Not Assigned',
        });
      });
    });

    if (!flattenedForExcel.length) {
      alert('No filtered service records are available for Excel export.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(flattenedForExcel);
    worksheet['!cols'] = [
      { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 22 }, { wch: 16 },
      { wch: 45 }, { wch: 16 }, { wch: 28 }, { wch: 16 }, { wch: 28 },
      { wch: 40 }, { wch: 10 }, { wch: 15 }, { wch: 18 }, { wch: 15 },
      { wch: 20 }, { wch: 25 }, { wch: 25 }, { wch: 35 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Detailed_Report');
    XLSX.writeFile(workbook, `Detailed_Sales_Export_${finalStart}_to_${finalEnd}.xlsx`);
  };

  const totalPages = Math.ceil(previewData.length / itemsPerPage);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return previewData.slice(startIndex, startIndex + itemsPerPage);
  }, [previewData, currentPage]);

  const detailItems = selectedSale?.filteredServices || [];
  const totalDetailPages = Math.ceil(detailItems.length / detailsItemsPerPage);

  const currentDetailData = useMemo(() => {
    const startIndex = (detailsPage - 1) * detailsItemsPerPage;
    return detailItems.slice(startIndex, startIndex + detailsItemsPerPage);
  }, [detailItems, detailsPage]);

  const mainTableHeaders = [
    'S OrderId',
    'Order Id',
    'User Name',
    'Phone',
    'Details',
    'Total Amount',
    'Discount',
    'Balance Amount',
    'Paid Amount',
    'Booking Date/Time',
    'Status',
    'Responsible',
  ];

  const getPaginationItems = (page, pages) => {
    if (pages <= 1) return [1];
    if (pages <= 5) return Array.from({ length: pages }, (_, index) => index + 1);

    const items = [1];
    if (page > 3) items.push('left-ellipsis');

    const start = Math.max(2, page - 1);
    const end = Math.min(pages - 1, page + 1);

    for (let i = start; i <= end; i += 1) items.push(i);
    if (page < pages - 2) items.push('right-ellipsis');

    items.push(pages);
    return [...new Set(items)];
  };

  const renderPagination = (page, pages, onPageChange, label = 'PAGE') => {
    if (pages <= 1) return null;
    const paginationItems = getPaginationItems(page, pages);

    return (
      <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
          aria-label={`Previous ${label.toLowerCase()}`}
          className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={17} />
        </button>

        <div className="flex items-center justify-center gap-1.5">
          {paginationItems.map((item, index) => {
            if (typeof item === 'string') {
              return (
                <span
                  key={`${item}-${index}`}
                  className="inline-flex items-center justify-center h-9 min-w-7 px-1 text-gray-400 font-bold text-sm select-none"
                  aria-hidden="true"
                >
                  ...
                </span>
              );
            }

            const isActive = item === page;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center justify-center h-9 min-w-9 px-2 rounded-lg border text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-200'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(page + 1, pages))}
          disabled={page === pages}
          aria-label={`Next ${label.toLowerCase()}`}
          className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={17} />
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-100 w-full p-4 md:p-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">
          Export Panel (By Service Date)
        </h2>

        {previewData.length > 0 && (
          <button
            type="button"
            onClick={exportToExcel}
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-xl shadow-md font-bold hover:bg-emerald-700 transition-colors"
          >
            <FileSpreadsheet size={20} />
            Download Excel
          </button>
        )}
      </div>

      {/* DATE FILTER */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 mb-1">
            Service Start Date
          </label>
          <input
            type="date"
            className="p-2 border rounded-md text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-500 mb-1">
            Service End Date
          </label>
          <input
            type="date"
            className="p-2 border rounded-md text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={fetchData}
            className="w-full p-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 font-bold transition-all h-[38px]"
          >
            {loading ? (
              <Loader2 className="animate-spin inline mr-2" size={18} />
            ) : null}
            {loading ? 'Fetching...' : 'Preview Data'}
          </button>
        </div>
      </div>

      {/* SELECTED DATE RANGE */}
      {startDate && endDate && (
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm">
          <span className="font-bold text-blue-800">Service Date Range:</span>{' '}
          <span className="font-semibold text-blue-700">
            {formatDateDDMMYY(getSelectedDateRange().finalStart)}
          </span>{' '}
          <span className="text-blue-600">→</span>{' '}
          <span className="font-semibold text-blue-700">
            {formatDateDDMMYY(getSelectedDateRange().finalEnd)}
          </span>
          <div className="text-xs text-blue-600 mt-1">
            Only services whose booking/service date falls inside this range are included.
          </div>
        </div>
      )}

      {/* MAIN TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto mb-10 border border-gray-100">
        <h3 className="text-lg font-bold mb-4 text-gray-700 border-l-4 border-blue-600 pl-3">
          Order Summaries
        </h3>

        <table className="min-w-[1200px] w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-[11px] font-black tracking-wider">
              {mainTableHeaders.map((header) => (
                <th key={header} className="py-3 px-3 md:px-6 text-left border-b">
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {currentData.length ? (
              currentData.map((sale) => {
                const filteredAmounts =
                  sale.filteredAmounts ||
                  calculateFilteredAmounts(sale.filteredServices || []);

                const firstService = sale.filteredServices?.[0];
                const firstServiceDate =
                  firstService?.location_booking_time || sale.date_time;
                const paidAmount = Number(sale.payedAmount || 0);

                const balanceAmount = Math.max(
                  Number(filteredAmounts.totalAmount || 0) - paidAmount,
                  0
                );

                return (
                  <tr
                    key={sale.id}
                    className={`hover:bg-indigo-50/30 transition-colors text-sm ${
                      selectedSale?.id === sale.id ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <td className="py-3 px-3 md:px-6">{sale.S_orderId || 'N/A'}</td>
                    <td className="py-3 px-3 md:px-6">{sale.orderId || 'N/A'}</td>
                    <td className="py-3 px-3 md:px-6 font-semibold">{sale.name || 'N/A'}</td>
                    <td className="py-3 px-3 md:px-6 text-gray-500">{sale.phone_number || 'N/A'}</td>
                    <td className="py-3 px-3 md:px-6">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSale(sale);
                          setDetailsPage(1);
                        }}
                        className={`px-3 py-1 rounded-md font-bold text-xs ${
                          selectedSale?.id === sale.id
                            ? 'bg-blue-600 text-white'
                            : 'text-blue-600 border border-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {selectedSale?.id === sale.id ? 'Showing Below' : 'View Details'}
                      </button>
                    </td>
                    <td className="py-3 px-3 md:px-6 font-bold">
                      ₹{Number(filteredAmounts.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 md:px-6 text-black">
                      ₹{Number(sale.discount || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 md:px-6 text-black">
                      ₹{Number(balanceAmount).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 md:px-6 text-green-600 font-bold">
                      ₹{Number(paidAmount).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 md:px-6 text-xs text-gray-500 font-medium">
                      {formatServiceDateTime(
                        firstServiceDate,
                        firstService?.SelectedServiceTime
                      )}
                    </td>
                    <td className="py-3 px-3 md:px-6 font-bold text-indigo-600">
                      {sale.status || 'Pending'}
                    </td>
                    <td className="py-3 px-3 md:px-6 text-gray-400">
                      {sale.responsible || '—'}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={12} className="py-10 text-center text-gray-300 font-bold">
                  NO SALES FOUND FOR THIS SERVICE DATE RANGE
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {renderPagination(currentPage, totalPages, setCurrentPage, 'page')}

        {totalPages > 1 && (
          <div className="text-center mt-2 text-xs font-bold text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      {/* DETAILS TABLE */}
      {selectedSale && (
        <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-indigo-600 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
            <h3 className="text-lg md:text-xl font-black text-gray-800">
              Service Breakdown: {selectedSale.name || 'N/A'} ({selectedSale.phone_number || 'N/A'})
            </h3>

            <button
              type="button"
              onClick={() => setSelectedSale(null)}
              className="text-gray-400 hover:text-red-500 font-bold text-xl"
            >
              &times; Close Breakdown
            </button>
          </div>

          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700">
            Showing ONLY services from{' '}
            <strong>{formatDateDDMMYY(getSelectedDateRange().finalStart)}</strong> to{' '}
            <strong>{formatDateDDMMYY(getSelectedDateRange().finalEnd)}</strong>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black">
                  {[
                    'Service ID',
                    'Service Details',
                    'Booking Date/Time',
                    'Booking Address',
                    'Order Amount',
                    'Quantity',
                    'Convenience Fee',
                    'Total',
                    'Status',
                  ].map((header) => (
                    <th key={header} className="py-3 px-6 text-left border-b">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {currentDetailData.length ? (
                  currentDetailData.map((item, index) => {
                    const dateVal = item?.location_booking_time || selectedSale?.date_time;
                    const serviceDateKey = getServiceDateKey(dateVal);
                    const quantity = Number(item?.quantity || 0);
                    const itemPrice = Number(item?.item_price || 0);
                    const orderAmount = itemPrice * quantity;
                    const singleFee = CalculateConvenienceFee(itemPrice)?.convenienceFee || 0;
                    const convenienceFee = Number(singleFee) * quantity;
                    const total = orderAmount + convenienceFee;

                    const isInSelectedRange = isServiceInRange(
                      dateVal,
                      getSelectedDateRange().finalStart,
                      getSelectedDateRange().finalEnd
                    );

                    return (
                      <tr
                        key={`${item?.product_purchase_id || 'service'}-${index}`}
                        className={`hover:bg-gray-50 border-b text-sm ${
                          isInSelectedRange ? 'bg-green-50/50' : ''
                        }`}
                      >
                        <td className="py-3 px-3 md:px-6">{item?.product_purchase_id || 'N/A'}</td>
                        <td className="py-3 px-3 md:px-6 max-w-[300px]">
                          <div className="font-bold text-gray-700">{item?.product_name || 'N/A'}</div>
                          <div className="text-xs text-gray-400 italic">{item?.description || ''}</div>
                        </td>
                        <td className="py-3 px-3 md:px-6 text-xs">
                          <span className={isInSelectedRange ? 'font-bold text-green-700' : 'font-medium'}>
                            {serviceDateKey ? formatDateDDMMYY(serviceDateKey) : 'N/A'}
                          </span>
                          {item?.SelectedServiceTime && (
                            <>
                              <br />
                              <span className="text-gray-600">{item.SelectedServiceTime}</span>
                            </>
                          )}
                        </td>
                        <td className="py-3 px-3 md:px-6">{item?.bookingAddress || 'N/A'}</td>
                        <td className="py-3 px-3 md:px-6">₹{Number(orderAmount).toFixed(2)}</td>
                        <td className="py-3 px-3 md:px-6 font-bold">{quantity}</td>
                        <td className="py-3 px-3 md:px-6 text-gray-400">₹{Number(convenienceFee).toFixed(2)}</td>
                        <td className="py-3 px-3 md:px-6 font-black text-blue-600">₹{Number(total).toFixed(2)}</td>
                        <td className="py-3 px-3 md:px-6">
                          <span className="px-2 py-1 rounded bg-green-50 text-green-700 text-[10px] font-bold uppercase">
                            {item?.status || selectedSale?.status || 'Started'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-gray-400 font-bold">
                      NO SERVICES FOUND FOR THIS DATE RANGE
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {renderPagination(detailsPage, totalDetailPages, setDetailsPage, 'detail page')}

          {totalDetailPages > 1 && (
            <div className="text-center mt-2 text-[10px] font-bold text-gray-400">
              Detail Page {detailsPage} of {totalDetailPages}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExportSalesData;