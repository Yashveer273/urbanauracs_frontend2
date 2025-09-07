import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { firestore } from "../firebaseCon";

export default function SalesSection() {
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductInfo, setSelectedProductInfo] = useState(null);
  const [showModalContent, setShowModalContent] = useState(false);

  const [last7DaysData, setLast7DaysData] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);

  // Filter function
  const filterTable = () => {
    const filtered = salesData.filter(sale => {
      const nameMatch = sale.name?.toLowerCase().includes(searchName.toLowerCase());
      const emailMatch = sale.email?.toLowerCase().includes(searchEmail.toLowerCase());
      const phoneMatch = sale.phone_number?.includes(searchPhone);
      const productMatch = sale.product_info?.cart?.some(item =>
        item.product_name?.toLowerCase().includes(searchProduct.toLowerCase())
      );
      return nameMatch && emailMatch && productMatch && phoneMatch;
    });
    setFilteredData(filtered);
  };

  // Graph data processing
  // Graph data processing
const processGraphData = () => {
  const dailySales = {};
  salesData.forEach(sale => {
    const price = Number(sale.total_price) || 0;
    const date = new Date(sale.date_time);
    const localDate = date.toLocaleDateString('en-CA'); // YYYY-MM-DD in local timezone
    dailySales[localDate] = (dailySales[localDate] || 0) + price;
  });

  // 🔥 Build last 7 days explicitly
  const today = new Date();
  const last7DaysGraphData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toLocaleDateString('en-CA');
    last7DaysGraphData.push({
      formattedDate: `D${d.getDate()}-M${d.getMonth() + 1}`,
      sales: dailySales[key] || 0,  // fallback to 0
    });
  }
  setLast7DaysData(last7DaysGraphData);

  // Monthly graph stays as-is
  const monthlySales = {};
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  salesData.forEach(sale => {
    const saleDate = new Date(sale.date_time);
    const price = Number(sale.total_price) || 0;
    if (saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear) {
      const day = saleDate.getDate();
      monthlySales[day] = (monthlySales[day] || 0) + price;
    }
  });

  const monthlyGraphData = Object.keys(monthlySales)
    .sort((a, b) => a - b)
    .map(day => ({
      formattedDate: `D${day}-M${currentMonth + 1}`,
      sales: monthlySales[day],
    }));
  setMonthlySalesData(monthlyGraphData);
};


  // Load Firestore data
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, "sales"), (snapshot) => {
      const newSales = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("🔥 Sales fetched:", newSales);
      setSalesData(newSales);
      setCurrentPage(1);
    });
    return () => unsubscribe();
  }, []);

  // Re-run filters & graphs when salesData or search changes
  useEffect(() => {
    filterTable();
    processGraphData();
  }, [salesData, searchName, searchEmail, searchPhone, searchProduct]);

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const showProductInfo = (productInfo) => {
    setSelectedProductInfo(productInfo);
    setModalOpen(true);
    setTimeout(() => setShowModalContent(true), 50);
  };

  const closeModal = () => {
    setShowModalContent(false);
    setTimeout(() => {
      setModalOpen(false);
      setSelectedProductInfo(null);
    }, 300);
  };

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-100">
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Sales Dashboard</h2>

        {/* Graphs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Last 7 Days Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last7DaysData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Sales Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <hr className="my-6 border-gray-300"/>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales Records</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-white rounded-xl shadow-md">
          <input type="text" placeholder="Search by Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="p-3 border rounded-xl" />
          <input type="number" placeholder="Search by Phone" value={searchPhone} onChange={(e) => setSearchPhone(e.target.value)} className="p-3 border rounded-xl" />
          <input type="text" placeholder="Search by Email" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} className="p-3 border rounded-xl" />
          <input type="text" placeholder="Search by Product" value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} className="p-3 border rounded-xl" />
          <button onClick={filterTable} className="bg-blue-600 text-white p-3 rounded-xl">Search</button>
        </div>

        {/* Table */}
        <div className="table-container bg-white p-6 rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6">User Name</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Phone</th>
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">Details</th>
                <th className="py-3 px-6">pincode</th>

                <th className="py-3 px-6">Location</th>
              
                <th className="py-3 px-6">Total Price</th>
                <th className="py-3 px-6">Date/Time</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((sale, i) => (
                <tr key={i} className="hover:bg-gray-50 border-b">
                  <td className="py-4 px-6">{sale.name}</td>
                  <td className="py-4 px-6">{sale.email}</td>
                  <td className="py-4 px-6">{sale.phone_number}</td>
                  <td className="py-4 px-6">{sale.product_info?.cart?.map(item => item.product_name).join(', ')}</td>
                  <td className="py-4 px-6">
                    <button onClick={() => showProductInfo(sale.product_info)} className="text-blue-600">View Details</button>
                  </td>
                  <td className="py-4 px-6">{sale.pincode}</td>

                  <td className="py-4 px-6">{sale.user_location}</td>
                  
                  <td className="py-4 px-6">₹{sale.total_price}</td>
                  <td className="py-4 px-6">{new Date(sale.date_time).toLocaleString()}</td>
                </tr>
              ))}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan="9" className="py-4 px-6 text-center text-gray-500">No matching records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 rounded-xl bg-white">Previous</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button key={page} onClick={() => setCurrentPage(page)} className={`px-4 py-2 rounded-xl ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white'}`}>
                {page}
              </button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 rounded-xl bg-white">Next</button>
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && selectedProductInfo && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black bg-opacity-50" onClick={closeModal}>
          <div className={`bg-white rounded-xl p-8 shadow-2xl relative w-full md:w-3/4 lg:w-1/2 ${showModalContent ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} onClick={(e) => e.stopPropagation()}>
            <span onClick={closeModal} className="absolute top-4 right-4 text-3xl font-bold text-gray-400 cursor-pointer">&times;</span>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Product Details</h3>
            <div className="overflow-y-auto max-h-[70vh]">
              <table className="w-full text-left table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                    <th className="py-3 px-6">Purchase ID</th>
                    <th className="py-3 px-6">Product ID</th>
                    <th className="py-3 px-6">Product Name</th>
                    <th className="py-3 px-6">Vendor Name</th>
                    <th className="py-3 px-6">Booking Time</th>
                    <th className="py-3 px-6">Item Price</th>
                    <th className="py-3 px-6">Tag</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProductInfo.cart.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50 border-b">
                      <td className="py-4 px-6">{item.product_purchase_id}</td>
                      <td className="py-4 px-6">{item.og_product_id}</td>
                      <td className="py-4 px-6">{item.product_name}</td>
                      <td className="py-4 px-6">{item.vendor_details.vendor_name}</td>
                      <td className="py-4 px-6">{new Date(item.location_booking_time).toLocaleString()}</td>
                      <td className="py-4 px-6">₹{item.item_price}</td>
                      <td className="py-4 px-6">{item.tag}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
