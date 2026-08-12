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
import { normalizeDate } from './utility';
import { CalculateConvenienceFee } from '../components/TexFee';

const ExportSalesData = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [previewData, setPreviewData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Main table pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Expanded service-details table pagination
  const [selectedSale, setSelectedSale] = useState(null);
  const [detailsPage, setDetailsPage] = useState(1);
  const detailsItemsPerPage = 10;

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

    let finalStart = startDate;
    let finalEnd = endDate;

    if (startDate > endDate) {
      finalStart = endDate;
      finalEnd = startDate;
    }

    try {
      const salesRef = collection(firestore, 'sales');

      const q = query(
        salesRef,
        orderBy('date_time', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const rows = [];

      querySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() };
        const cart = data.product_info?.cart || [];

        // A sale is included only when at least one service item
        // falls inside the selected service-date range.
        const hasServiceInTime = cart.some((item) => {
          const serviceTime = item.location_booking_time;
          return (
            serviceTime &&
            serviceTime >= finalStart &&
            serviceTime <= finalEnd
          );
        });

        if (hasServiceInTime) {
          rows.push(data);
        }
      });

      setPreviewData(rows);
    } catch (error) {
      console.error('Export Error:', error);
      alert('Failed to fetch sales data. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Only export cart items that actually match the currently applied
  // service-date filter. This prevents the Excel file from containing
  // unrelated services from an order that merely had one matching service.
  const exportToExcel = () => {
    const flattenedForExcel = [];

    let finalStart = startDate;
    let finalEnd = endDate;

    if (startDate > endDate) {
      finalStart = endDate;
      finalEnd = startDate;
    }

    previewData.forEach((sale) => {
      const cart = sale.product_info?.cart || [];

      cart.forEach((item) => {
        const serviceTime = item.location_booking_time;

        // IMPORTANT:
        // Export only the service rows that satisfy the same filter
        // used to populate the preview table.
        if (
          !serviceTime ||
          serviceTime < finalStart ||
          serviceTime > finalEnd
        ) {
          return;
        }

        const qty = Number(item.quantity || 0);
        const itemPrice = Number(item.item_price || 0);
        const orderAmount = itemPrice * qty;

        const singleFee =
          CalculateConvenienceFee(itemPrice).convenienceFee || 0;
        const totalConvenienceFee = singleFee * qty;

        flattenedForExcel.push({
          'ORDER ID': sale.orderId || sale.S_orderId || 'N/A',
          'SERVICE ID': item.product_purchase_id || 'N/A',
          USERNAME: sale.name || 'N/A',
          'PHONE NUMBER': sale.phone_number || 'N/A',
          'SERVICE DETAILS': `${item.product_name || ''} || ${
            item.description || ''
          }`,
          'BOOKING DATE/TIME': `${normalizeDate(
            sale.date_time
          )} || ${new Date(sale.date_time).toLocaleTimeString()}`,
          'SERVICE DATA/TIME': `${serviceTime} || ${
            item.SelectedServiceTime || ''
          }`,
          'BOOKING ADDRESS': item.bookingAddress || 'N/A',
          QUANTITY: qty,
          'ORDER AMOUNT': orderAmount,
          'CONVENICE FEE': totalConvenienceFee,
          'TOTAL AMOUNT': orderAmount + totalConvenienceFee,
          STATUS: item.status || sale.status || 'Pending',
          RESPONSIBLE: sale.responsible || 'Not Assigned',
          RESPONSIBLE_VENDOR:
            sale.responsibleVendor?.vendorName || 'Not Assigned',
          RESPONSIBLE_vendorPhoneNo:
            sale.responsibleVendor?.vendorPhoneNo || 'Not Assigned',
          RESPONSIBLE_Location:
            sale.responsibleVendor?.vendorLocation || 'Not Assigned',
        });
      });
    });

    if (!flattenedForExcel.length) {
      alert('No filtered service records are available for Excel export.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(flattenedForExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Detailed_Report'
    );

    XLSX.writeFile(
      workbook,
      `Detailed_Sales_Export_${finalStart}_to_${finalEnd}.xlsx`
    );
  };

  const totalPages = Math.ceil(previewData.length / itemsPerPage);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return previewData.slice(startIndex, startIndex + itemsPerPage);
  }, [previewData, currentPage]);

  const detailItems = selectedSale?.product_info?.cart || [];
  const totalDetailPages = Math.ceil(
    detailItems.length / detailsItemsPerPage
  );

  const currentDetailData = useMemo(() => {
    const startIndex = (detailsPage - 1) * detailsItemsPerPage;
    return detailItems.slice(
      startIndex,
      startIndex + detailsItemsPerPage
    );
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

  /*
   * Compact pagination:
   *
   * Examples:
   * 1 2 3 ... 10
   * 1 ... 4 5 6 ... 10
   * 1 ... 8 9 10
   *
   * This avoids rendering every page when there are many pages.
   */
  const getPaginationItems = (page, pages) => {
    if (pages <= 1) return [1];

    if (pages <= 5) {
      return Array.from({ length: pages }, (_, index) => index + 1);
    }

    const items = [1];

    if (page > 3) {
      items.push('left-ellipsis');
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(pages - 1, page + 1);

    for (let i = start; i <= end; i += 1) {
      items.push(i);
    }

    if (page < pages - 2) {
      items.push('right-ellipsis');
    }

    items.push(pages);

    return [...new Set(items)];
  };

  const renderPagination = (
    page,
    pages,
    onPageChange,
    label = 'PAGE'
  ) => {
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

      {/* Date Filter Box */}
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

      {/* MAIN TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto mb-10 border border-gray-100">
        <h3 className="text-lg font-bold mb-4 text-gray-700 border-l-4 border-blue-600 pl-3">
          Order Summaries
        </h3>

        <table className="min-w-[1100px] w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-[11px] font-black tracking-wider">
              {mainTableHeaders.map((h) => (
                <th
                  key={h}
                  className="py-3 px-3 md:px-6 text-left border-b"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {currentData.length ? (
              currentData.map((sale) => (
                <tr
                  key={sale.id}
                  className={`hover:bg-indigo-50/30 transition-colors text-sm ${
                    selectedSale?.id === sale.id
                      ? 'bg-indigo-50'
                      : ''
                  }`}
                >
                  <td className="py-3 px-3 md:px-6">
                    {sale.S_orderId}
                  </td>
                  <td className="py-3 px-3 md:px-6">
                    {sale.orderId}
                  </td>
                  <td className="py-3 px-3 md:px-6 font-semibold">
                    {sale.name}
                  </td>
                  <td className="py-3 px-3 md:px-6 text-gray-500">
                    {sale.phone_number}
                  </td>

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
                      {selectedSale?.id === sale.id
                        ? 'Showing Below'
                        : 'View Details'}
                    </button>
                  </td>

                  <td className="py-3 px-3 md:px-6 font-bold">
                    ₹{sale.total_price}
                  </td>

                  <td className="py-3 px-3 md:px-6 text-black">
                    ₹{sale.discount || 0}
                  </td>

                  <td className="py-3 px-3 md:px-6 text-black">
                    ₹
                    {Number(sale.total_price || 0) -
                      Number(sale.payedAmount || 0)}
                  </td>

                  <td className="py-3 px-3 md:px-6 text-green-600 font-bold">
                    ₹{sale.payedAmount}
                  </td>

                  <td className="py-3 px-3 md:px-6 text-xs text-gray-400">
                    {normalizeDate(sale.date_time)}
                  </td>

                  <td className="py-3 px-3 md:px-6 font-bold text-indigo-600">
                    {sale.status || 'Pending'}
                  </td>

                  <td className="py-3 px-3 md:px-6 text-gray-400">
                    {sale.responsible || '—'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={12}
                  className="py-10 text-center text-gray-300 font-bold"
                >
                  NO SALES FOUND FOR THIS SERVICE DATE RANGE
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {renderPagination(
          currentPage,
          totalPages,
          setCurrentPage,
          'page'
        )}

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
              Service Breakdown: {selectedSale.name} (
              {selectedSale.phone_number})
            </h3>

            <button
              type="button"
              onClick={() => setSelectedSale(null)}
              className="text-gray-400 hover:text-red-500 font-bold text-xl"
            >
              &times; Close Breakdown
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black">
                  {[
                    'Service ID',
                    'Service Details',
                    'Service Date/ Time',
                    'Booking Address',
                    'Order Amount',
                    'Quantity',
                    'Convenience Fee',
                    'Total',
                    'Status',
                  ].map((h) => (
                    <th
                      key={h}
                      className="py-3 px-6 text-left border-b"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {currentDetailData.map((item, i) => {
                  const isInSelectedRange =
                    item.location_booking_time >=
                      Math.min(startDate, endDate) &&
                    item.location_booking_time <=
                      Math.max(startDate, endDate);

                  return (
                    <tr
                      key={`${item.product_purchase_id || 'service'}-${i}`}
                      className={`hover:bg-gray-50 border-b text-sm ${
                        isInSelectedRange ? 'bg-green-50/50' : ''
                      }`}
                    >
                      <td className="py-3 px-3 md:px-6">
                        {item.product_purchase_id}
                      </td>

                      <td className="py-3 px-3 md:px-6 max-w-[300px]">
                        <div className="font-bold text-gray-700">
                          {item.product_name}
                        </div>
                        <div className="text-xs text-gray-400 italic">
                          {item.description}
                        </div>
                      </td>

                      <td className="py-3 px-3 md:px-6 text-xs">
                        <span
                          className={
                            isInSelectedRange
                              ? 'font-bold text-green-700'
                              : ''
                          }
                        >
                          {item.location_booking_time}
                        </span>
                        <br />
                        {item.SelectedServiceTime}
                      </td>

                      <td className="py-3 px-3 md:px-6">
                        {item.bookingAddress}
                      </td>

                      <td className="py-3 px-3 md:px-6">
                        ₹{item.item_price}
                      </td>

                      <td className="py-3 px-3 md:px-6 font-bold">
                        {item.quantity}
                      </td>

                      <td className="py-3 px-3 md:px-6 text-gray-400">
                        ₹
                        {
                          CalculateConvenienceFee(
                            item.item_price * item.quantity
                          ).convenienceFee
                        }
                      </td>

                      <td className="py-3 px-3 md:px-6 font-black text-blue-600">
                        ₹
                        {item.item_price * item.quantity +
                          CalculateConvenienceFee(
                            item.item_price * item.quantity
                          ).convenienceFee}
                      </td>

                      <td className="py-3 px-3 md:px-6">
                        <span className="px-2 py-1 rounded bg-green-50 text-green-700 text-[10px] font-bold uppercase">
                          {item.status || 'Started'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {renderPagination(
            detailsPage,
            totalDetailPages,
            setDetailsPage,
            'detail page'
          )}

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