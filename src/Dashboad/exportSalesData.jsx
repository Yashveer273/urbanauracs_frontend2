import React, { useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '../firebaseCon'; 
import * as XLSX from 'xlsx';
import { Search, FileSpreadsheet, Loader2, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { normalizeDate } from "./utility";
import { CalculateConvenienceFee } from "../components/TexFee"; 

const ExportSalesData = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [previewData, setPreviewData] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  // Pagination State - Main Table
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State for expanded details table below
  const [selectedSale, setSelectedSale] = useState(null);
  const [detailsPage, setDetailsPage] = useState(1);
  const detailsItemsPerPage = 10;

  const fetchData = async () => {
    if (!startDate || !endDate) return alert("Please select both dates");
    setLoading(true);
    setPreviewData([]);
    setSelectedSale(null);
    setCurrentPage(1);

    let finalStart = startDate;
    let finalEnd = endDate;
    if (startDate > endDate) {
      finalStart = endDate;
      finalEnd = startDate;
    }

    try {
      const salesRef = collection(firestore, "sales");
      const q = query(
        salesRef,
        where("date_time", ">=", finalStart),
        where("date_time", "<=", finalEnd + "\uf8ff"),
        orderBy("date_time", "desc")
      );

      const querySnapshot = await getDocs(q);
      const rows = [];
      querySnapshot.forEach((doc) => {
        rows.push({ id: doc.id, ...doc.data() });
      });
      setPreviewData(rows);
    } catch (error) {
      console.error("Export Error:", error);
    }
    setLoading(false);
  };

  // Excel Logic (14 fields sequence)
  const exportToExcel = () => {
    const flattenedForExcel = [];
    previewData.forEach((sale) => {
      const cart = sale.product_info?.cart || [];
      cart.forEach((item) => {
        const qty = Number(item.quantity || 0);
        const itemPrice = Number(item.item_price || 0);
        const orderAmount = itemPrice * qty;
        const singleFee = CalculateConvenienceFee(itemPrice).convenienceFee || 0;
        const totalConvenienceFee = singleFee * qty;

        flattenedForExcel.push({
          "ORDER ID": sale.orderId || sale.S_orderId || "N/A",
          "SERVICE ID": item.product_purchase_id || "N/A",
          "USERNAME": sale.name || "N/A",
          "PHONE NUMBER": sale.phone_number || "N/A",
          "SERVICE DETAILS": `${item.product_name || ''} || ${item.description || ''}`,
          "BOOKING DATE/TIME": `${normalizeDate(sale.date_time)} || ${new Date(sale.date_time).toLocaleTimeString()}`,
          "SERVICE DATA/TIME": `${item.location_booking_time || ''} || ${item.SelectedServiceTime || ''}`,
          "BOOKING ADDRESS": item.bookingAddress || "N/A",
          "QUANTITY": qty,
          "ORDER AMOUNT": orderAmount,
          "CONVENICE FEE": totalConvenienceFee,
          "TOTAL AMOUNT": orderAmount + totalConvenienceFee,
          "STATUS": item.status || sale.status || "Pending",
          "RESPONSIBLE": sale.responsible || "Not Assigned"
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(flattenedForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Detailed_Report");
    XLSX.writeFile(workbook, `Detailed_Sales_Export_${startDate}_to_${endDate}.xlsx`);
  };

  // Table Handlers
  const currentData = previewData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(previewData.length / itemsPerPage);

  const detailItems = selectedSale?.product_info?.cart || [];
  const totalDetailPages = Math.ceil(detailItems.length / detailsItemsPerPage);
  const currentDetailData = detailItems.slice((detailsPage - 1) * detailsItemsPerPage, detailsPage * detailsItemsPerPage);

  const mainTableHeaders = [
    "S OrderId", "Order Id", "User Name", "Phone", "Details", 
    "Total Amount", "Discount", "Balance Amount", "Paid Amount", 
    "Booking Date/Time", "Status", "Responsible"
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-100 w-full p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Export Panel</h2>
        {previewData.length > 0 && (
          <button onClick={exportToExcel} className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-xl shadow-md font-bold">
            <FileSpreadsheet size={20} /> Download Excel
          </button>
        )}
      </div>

      {/* Date Filter Box */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="date" className="p-2 border rounded-md text-sm" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <input type="date" className="p-2 border rounded-md text-sm" value={endDate} onChange={e => setEndDate(e.target.value)} />
          <button onClick={fetchData} className="p-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 font-bold transition-all">
            {loading ? <Loader2 className="animate-spin inline mr-2" size={18} /> : null}
            {loading ? "Fetching..." : "Preview Data"}
          </button>
      </div>

      {/* MAIN TABLE (Summary) */}
      <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto mb-10 border border-gray-100">
        <h3 className="text-lg font-bold mb-4 text-gray-700 border-l-4 border-blue-600 pl-3">Order Summaries</h3>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-[11px] font-black tracking-wider">
              {mainTableHeaders.map((h) => <th key={h} className="py-4 px-6 text-left border-b">{h}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentData.length ? currentData.map((sale, i) => (
              <tr key={i} className={`hover:bg-indigo-50/30 transition-colors text-sm ${selectedSale?.id === sale.id ? 'bg-indigo-50' : ''}`}>
                <td className="py-4 px-6">{sale.S_orderId}</td>
                <td className="py-4 px-6">{sale.orderId}</td>
                <td className="py-4 px-6 font-semibold">{sale.name}</td>
                <td className="py-4 px-6 text-gray-500">{sale.phone_number}</td>
                <td className="py-4 px-6">
                  <button 
                    onClick={() => { setSelectedSale(sale); setDetailsPage(1); }} 
                    className={`px-3 py-1 rounded-md font-bold text-xs ${selectedSale?.id === sale.id ? 'bg-blue-600 text-white' : 'text-blue-600 border border-blue-600 hover:bg-blue-50'}`}
                  >
                    {selectedSale?.id === sale.id ? "Showing Below" : "View Details"}
                  </button>
                </td>
                <td className="py-4 px-6 font-bold">₹{sale.total_price}</td>
                <td className="py-4 px-6 text-black">₹{sale.discount || 0}</td>
                <td className="py-4 px-6 text-black">₹{Number(sale.total_price || 0) - Number(sale.payedAmount || 0)}</td>
                <td className="py-4 px-6 text-green-600 font-bold">₹{sale.payedAmount}</td>
                <td className="py-4 px-6 text-xs text-gray-400">{normalizeDate(sale.date_time)}</td>
                <td className="py-4 px-6 font-bold text-indigo-600">{sale.status || "Pending"}</td>
                <td className="py-4 px-6 text-gray-400">{sale.responsible || "—"}</td>
              </tr>
            )) : <tr><td colSpan={12} className="py-10 text-center text-gray-300 font-bold">NO SALES DATA</td></tr>}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <span className="text-xs font-bold text-gray-400">PAGE {currentPage} OF {totalPages}</span>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-lg border bg-white disabled:opacity-30"><ChevronLeft size={16}/></button>
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-lg border bg-white disabled:opacity-30"><ChevronRight size={16}/></button>
            </div>
          </div>
        )}
      </div>

      {/* DETAILS TABLE (Expands below when row is clicked) */}
      
      {selectedSale && (
        <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-indigo-600 animate-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-black text-gray-800">
                Service Breakdown: {selectedSale.name} ({selectedSale.phone_number})
            </h3>
            <button onClick={() => setSelectedSale(null)} className="text-gray-400 hover:text-red-500 font-bold text-xl">&times; Close Breakdown</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black">
                  {["Service ID", "Service Details", "Service Date/ Time", "Booking Address", "Order Amount", "Quantity", "Convenience Fee", "Total", "Status"].map((h) => <th key={h} className="py-3 px-6 text-left border-b">{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {currentDetailData.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 border-b text-sm">
                    <td className="py-4 px-6">{item.product_purchase_id}</td>
                    <td className="py-4 px-6 max-w-[300px]">
                      <div className="font-bold text-gray-700">{item.product_name}</div>
                      <div className="text-xs text-gray-400 italic">{item.description}</div>
                    </td>
                    <td className="py-4 px-6 text-xs">{item.location_booking_time}<br/>{item.SelectedServiceTime}</td>
                    <td className="py-4 px-6">{item.bookingAddress}</td>
                    <td className="py-4 px-6">₹{item.item_price}</td>
                    <td className="py-4 px-6 font-bold">{item.quantity}</td>
                    <td className="py-4 px-6 text-gray-400">₹{CalculateConvenienceFee(item.item_price * item.quantity).convenienceFee}</td>
                    <td className="py-4 px-6 font-black text-blue-600">₹{item.item_price * item.quantity + CalculateConvenienceFee(item.item_price * item.quantity).convenienceFee}</td>
                    <td className="py-4 px-6">
                        <span className="px-2 py-1 rounded bg-green-50 text-green-700 text-[10px] font-bold uppercase">{item.status || "Started"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalDetailPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <span className="text-[10px] font-bold text-gray-400">DETAIL PAGE {detailsPage} OF {totalDetailPages}</span>
              <div className="flex gap-2">
                <button onClick={() => setDetailsPage(p => Math.max(p - 1, 1))} disabled={detailsPage === 1} className="p-2 rounded-lg border bg-white disabled:opacity-30"><ChevronLeft size={14}/></button>
                <button onClick={() => setDetailsPage(p => Math.min(p + 1, totalDetailPages))} disabled={detailsPage === totalDetailPages} className="p-2 rounded-lg border bg-white disabled:opacity-30"><ChevronRight size={14}/></button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExportSalesData;