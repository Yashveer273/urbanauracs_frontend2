import {
  collection,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { firestore } from "../firebaseCon";
import { updateUser } from "../API";

export default function AuthDashboard() {
  // State for search inputs
  const [searchName, setSearchName] = useState("");
  const [searchPincode, setSearchPincode] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Master Data State (Loads once from Firebase)
  const [allUsers, setAllUsers] = useState([]);
  
  // Table & Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const itemsPerPage = 10;

  // Graph States
  const [last7DaysData, setLast7DaysData] = useState([]);
  const [monthlyRegistrationsData, setMonthlyRegistrationsData] = useState([]);
  const [monthlyGraphTitle, setMonthlyGraphTitle] = useState("");

  // Edit Form States
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    mobileNumber: "",
    normalMobileNumber: "",
    phoneType: "",
    _id: "",
  });
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const userRef = collection(firestore, "User");

  // Fetch ALL data from Firestore
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const q = query(userRef, orderBy("created", "desc"));
        const snapshot = await getDocs(q);
        
        const masterList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setAllUsers(masterList);
      } catch (error) {
        console.error("❌ Error fetching full dataset from Firestore:", error);
      }
    };

    fetchAllData();
  }, [updateTrigger]);

  // Calculate analytics graphs whenever master data refreshes
  useEffect(() => {
    if (allUsers.length === 0) return;

    /* =======================
        LAST 7 DAYS GRAPH
    ======================== */
    const dailyRegistrations = {};
    allUsers.forEach((user) => {
      if (!user.created) return;
      const createdAt = user.created.seconds ? new Date(user.created.seconds * 1000) : new Date(user.created);
      const dateKey = createdAt.toISOString().slice(0, 10);
      dailyRegistrations[dateKey] = (dailyRegistrations[dateKey] || 0) + 1;
    });

    const processed7Days = Object.keys(dailyRegistrations)
      .sort()
      .slice(-7)
      .map((date) => {
        const d = new Date(date);
        return {
          formattedDate: `${d.getDate()}/${d.getMonth() + 1}`,
          registrations: dailyRegistrations[date],
        };
      });
    setLast7DaysData(processed7Days);

    /* =======================
        MONTHLY GRAPH
    ======================== */
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    setMonthlyGraphTitle(`Registration Progress for ${today.toLocaleString("default", { month: "long" })} ${currentYear}`);

    const monthlyGraphData = Array.from({ length: daysInMonth }, (_, i) => ({
      formattedDate: `${i + 1}`,
      registrations: 0,
    }));

    allUsers.forEach((user) => {
      if (!user.created) return;
      const date = user.created.seconds ? new Date(user.created.seconds * 1000) : new Date(user.created);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        monthlyGraphData[date.getDate() - 1].registrations += 1;
      }
    });
    setMonthlyRegistrationsData(monthlyGraphData);
  }, [allUsers]);

  // Run filtering logic across your entire dataset local cache
  const filteredData = allUsers.filter((user) => {
    const nameMatch = user.username?.toLowerCase().includes(searchName.toLowerCase());
    const pincodeMatch = user.pincode?.includes(searchPincode || "");
    const mobileMatch = user.mobileNumber ? user.mobileNumber.toString().includes(searchMobile || "") : false;

    let userDate = null;
    if (user.created) {
      userDate = user.created.seconds ? new Date(user.created.seconds * 1000) : new Date(user.created);
    }

    let dateMatch = true;
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      dateMatch = dateMatch && userDate && userDate >= start;
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      dateMatch = dateMatch && userDate && userDate <= end;
    }

    return nameMatch && pincodeMatch && mobileMatch && dateMatch;
  });

  // Reset active page back to 1 if filter fields change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, searchPincode, searchMobile, startDate, endDate]);

  // Slice data to isolate exactly 10 slots per visible matrix page
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleTableData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Directional Navigation Page Handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // User Action Form Event Managers
  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      mobileNumber: user.ConfurmWhatsAppMobileNumber || "",
      normalMobileNumber: user.normalMobileNumber || "",
      phoneType: user.phoneType || "",
      _id: user._id || user.id,
    });
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    setLoading(true);
    try {
      const res = await updateUser(formData._id, formData);
      alert(res.message || "User updated successfully!");
      setEditingUser(null);
      setUpdateTrigger((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      alert("Failed to update user.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Helper helper to clean display format string outputs
  const formatTableDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const dateObj = timestamp.toDate 
      ? timestamp.toDate() 
      : new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp);

    if (isNaN(dateObj.getTime())) return "N/A";

    // Returns custom clean formatting: DD/MM/YYYY, HH:MM AM/PM
    return dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }) + ", " + dateObj.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const overlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 };
  const modalStyle = { background: "#fff", padding: "20px", borderRadius: "8px", maxWidth: "400px", width: "90%" };

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 transition-opacity duration-500">
      <main className="flex-1 p-2 sm:p-4 md:p-6 overflow-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">User Authentication Dashboard</h2>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm text-center sm:text-right min-w-[200px]">
            <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider">Total Users in DB</p>
            <p className="text-2xl font-black text-blue-900">{allUsers.length}</p>
          </div>
        </div>

        {/* Charts Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Last 7 Days Registration Trend</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={last7DaysData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" tick={{ fontSize: 12 }} />
                <YAxis width={20} />
                <Tooltip />
                {window.innerWidth > 640 && <Legend />}
                <Line type="monotone" dataKey="registrations" stroke="#8884d8" activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{monthlyGraphTitle}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRegistrationsData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" tick={{ fontSize: 12 }} />
                <YAxis width={20} />
                <Tooltip />
                {window.innerWidth > 640 && <Legend />}
                <Bar dataKey="registrations" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <hr className="my-6 border-gray-300" />
        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Records</h2>

        {/* Dynamic Filters Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 p-4 bg-white rounded-xl shadow-md">
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 font-bold mb-1 pl-1">Username</label>
            <input type="text" placeholder="Search by Username" className="p-3 border border-gray-300 rounded-xl focus:outline-none" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 font-bold mb-1 pl-1">Pincode</label>
            <input type="text" placeholder="Search by Pincode" className="p-3 border border-gray-300 rounded-xl focus:outline-none" value={searchPincode} onChange={(e) => setSearchPincode(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 font-bold mb-1 pl-1">Mobile</label>
            <input type="text" placeholder="Search by Mobile" className="p-3 border border-gray-300 rounded-xl focus:outline-none" value={searchMobile} onChange={(e) => setSearchMobile(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 font-bold mb-1 pl-1">From Date</label>
            <input type="date" className="p-3 border border-gray-300 rounded-xl focus:outline-none" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 font-bold mb-1 pl-1">To Date</label>
            <input type="date" className="p-3 border border-gray-300 rounded-xl focus:outline-none" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-md overflow-x-auto w-full">
          <table className="min-w-[700px] md:min-w-[900px] w-full text-left table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-black uppercase text-sm leading-normal">
                <th className="py-3 px-6 border-b border-gray-200 rounded-tl-xl">Username</th>
                <th className="py-3 px-6 border-b border-gray-200">Mobile Number</th>
                <th className="py-3 px-6 border-b border-gray-200">WhatsApp Mobile Number</th>
                <th className="py-3 px-6 border-b border-gray-200">Is WhatsApp</th>
                <th className="py-3 px-6 border-b border-gray-200">Action</th>
                <th className="py-3 px-6 border-b border-gray-200">Location</th>
                <th className="py-3 px-6 border-b border-gray-200">Pincode</th>
                <th className="py-3 px-6 border-b border-gray-200 rounded-tr-xl">Registered On</th>
              </tr>
            </thead>
            <tbody className="text-gray text-sm font-bold">
              {visibleTableData.map((user, index) => (
                <tr key={user.id || index} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="py-3 px-6">{user.username}</td>
                  <td className="py-3 px-6">{user.mobileNumber}</td>
                  <td className="py-3 px-6">{user.ConfurmWhatsAppMobileNumber}</td>
                  <td className="py-3 px-6">{user.phoneType}</td>
                  <td className="py-3 px-6">
                    <button onClick={() => handleEditClick(user)} className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600">
                      Edit
                    </button>
                  </td>
                  <td className="py-3 px-6">
                    <span onClick={() => setSelectedLocation(user.location || "N/A")} style={{ cursor: "pointer", color: "#2563eb" }}>
                      {user.location && user.location.length > 10 ? user.location.slice(0, 10) + "..." : user.location || "N/A"}
                    </span>
                  </td>
                  <td className="py-3 px-6">{user.pincode}</td>
                  <td className="py-3 px-6 text-gray-700">
                    {formatTableDate(user.created)}
                  </td>
                </tr>
              ))}
              {visibleTableData.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-4 px-6 text-center text-gray-500">No matching records found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Edit Modal Component */}
          {editingUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{ zIndex: 1100 }}>
              <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Edit User: {editingUser.username}</h3>
                
                <label className="block text-gray-600 text-sm mb-2">WhatsApp Mobile Number</label>
                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="w-full border p-2 rounded mb-3" />
                
                <label className="block text-gray-600 text-sm mb-2">Normal Mobile Number</label>
                <input type="tel" name="normalMobileNumber" value={formData.normalMobileNumber} onChange={handleChange} className="w-full border p-2 rounded mb-3" />
                
                <label className="block text-gray-600 text-sm mb-2">Phone Type</label>
                <select name="phoneType" value={formData.phoneType} onChange={handleChange} className="w-full border p-2 rounded mb-4">
                  <option value="">Select Type</option>
                  <option value="whatsapp">WhatsApp Number</option>
                  <option value="non-whatsapp">Not WhatsApp Number</option>
                </select>

                <div className="flex justify-between">
                  <button onClick={() => setEditingUser(null)} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">Cancel</button>
                  <button onClick={handleUpdate} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                    {loading ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Location Modal */}
          {selectedLocation && (
            <div style={overlayStyle}>
              <div style={modalStyle}>
                <h3 className="text-lg font-bold mb-2 text-gray-800">Full Location</h3>
                <p className="text-gray-600 mb-4">{selectedLocation}</p>
                <button className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500" onClick={() => setSelectedLocation(null)}>Close</button>
              </div>
            </div>
          )}
        </div>

        {/* Client-Driven Pagination Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 gap-3">
          <p className="text-gray-600 font-medium">
            Page {currentPage} of {totalPages} (Showing {visibleTableData.length} of {filteredData.length} filtered items)
          </p>

          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl border transition-colors ${
                currentPage === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white text-gray-800 hover:bg-gray-200"
              }`}
            >
              Previous
            </button>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className={`px-4 py-2 rounded-xl border transition-colors ${
                currentPage >= totalPages ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white text-gray-800 hover:bg-gray-200"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
