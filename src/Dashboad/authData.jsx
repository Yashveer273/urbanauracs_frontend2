import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getCountFromServer,
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
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPincode, setSearchPincode] = useState("");
  const [searchMobile, setSearchMobile] = useState("");
  const [authData, setAuthData] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  
  const [currentData, setCurrentData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [update, setupdate] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;

  const [pageSnapshots, setPageSnapshots] = useState([]);

  // States for the two new graphs
  const [last7DaysData, setLast7DaysData] = useState([]);
  const [monthlyRegistrationsData, setMonthlyRegistrationsData] = useState([]);
  const [monthlyGraphTitle, setMonthlyGraphTitle] = useState("");
 const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    mobileNumber: "",
    phoneType: "",
    _id:""
  });
  const [loading, setLoading] = useState(false);
  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      mobileNumber: user.ConfurmWhatsAppMobileNumber,
      phoneType: user.phoneType,
      _id:user._id,
    });
  };
  
  const handleUpdate = async () => {
    if (!editingUser) return;
   
    setLoading(true);

    try {
      const res = await     updateUser(editingUser._id,formData);
    
      alert(res.message || "User updated successfully!");
      setEditingUser(null);
      setupdate(update+1);
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

const filterTable = () => {
  const filtered = authData.filter((user) => {
    const nameMatch = user.username
      ?.toLowerCase()
      .includes(searchName.toLowerCase());

    const emailMatch = user.email
      ?.toLowerCase()
      .includes(searchEmail.toLowerCase());

    const pincodeMatch = user.pincode?.includes(searchPincode || "");
    const mobileMatch = user.mobileNumber?.includes(searchMobile || "");

    const userDate = user.createdAt
      ? new Date(user.createdAt)
      : null;

    const dateMatch =
      (!startDate || (userDate && userDate >= new Date(startDate))) &&
      (!endDate || (userDate && userDate <= new Date(endDate)));

    return nameMatch && emailMatch && pincodeMatch && mobileMatch && dateMatch;
  });

  // ✅ NO slice here
  setCurrentData(filtered);
};

  // Function to process user data for the graphs
 const processGraphData = async () => {
  try {
    const q = query(userRef, orderBy("created", "desc"));
    const snapshot = await getDocs(q);

    const allUsers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    /* =======================
       LAST 7 DAYS GRAPH
    ======================== */
    const dailyRegistrations = {};

    allUsers.forEach((user) => {
      if (!user.created?.seconds) return;

      const createdAt = new Date(user.created.seconds * 1000);
      const dateKey = createdAt.toISOString().slice(0, 10); // YYYY-MM-DD

      dailyRegistrations[dateKey] =
        (dailyRegistrations[dateKey] || 0) + 1;
    });

    const last7DaysData = Object.keys(dailyRegistrations)
      .sort()
      .slice(-7)
      .map((date) => {
        const d = new Date(date);
        return {
          formattedDate: `${d.getDate()}/${d.getMonth() + 1}`,
          registrations: dailyRegistrations[date],
        };
      });

    setLast7DaysData(last7DaysData);

    /* =======================
       MONTHLY GRAPH
    ======================== */
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();

    setMonthlyGraphTitle(
      `Registration Progress for ${today.toLocaleString("default", {
        month: "long",
      })} ${currentYear}`
    );

    const monthlyGraphData = Array.from(
      { length: daysInMonth },
      (_, i) => ({
        formattedDate: `${i + 1}`,
        registrations: 0,
      })
    );

    allUsers.forEach((user) => {
      if (!user.created?.seconds) return;

      const date = new Date(user.created.seconds * 1000);

      if (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      ) {
        monthlyGraphData[date.getDate() - 1].registrations += 1;
      }
    });

    setMonthlyRegistrationsData(monthlyGraphData);
  } catch (error) {
    console.error("Graph processing error:", error);
  }
};

 const userRef = collection(firestore, "User");
const fetchUsers = async (page) => {
  try {
   
    let q;

    if (page == 1) {
      q = query(userRef, orderBy("created", "desc"), limit(itemsPerPage));
    } else {
    
      const prevCursor = pageSnapshots[page - 2];
      if (!prevCursor) {
        
        setCurrentPage(1);
        return;
      }

      q = query(
        userRef,
        orderBy("created", "desc"),
        startAfter(prevCursor),
        limit(itemsPerPage)
      );
    }

    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {

      setAuthData([]);
      return;
    }

    const newUsers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setAuthData(newUsers);

    // Store the last document of THIS page to use for the NEXT page
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    if (lastDoc) {
      setPageSnapshots((prev) => {
        const updated = [...prev];
        updated[page - 1] = lastDoc; // Stores cursor for the page after this one
        return updated;
      });
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

useEffect(() => {
  fetchUsers(currentPage);
}, [currentPage]); // Added currentPage here

  // 🔹 Pagination Controls
  const handleNext = () => setCurrentPage((prev) => prev + 1);
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
 
useEffect(() => {
  filterTable();
  processGraphData();
}, [
  authData,
  searchName,
  searchEmail,
  searchPincode,
  searchMobile,
  startDate,
  endDate,
]);


 



  useEffect(() => {
    const getTotalPages = async () => {
      const snapshot = await getCountFromServer(collection(firestore, "User"));
      const totalCount = snapshot.data().count;
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
    };
    getTotalPages();
  }, []);
 

  // Render the component
  return (
     <div className="max-w-12xl mx-auto transition-opacity duration-500">
      {/* Main Content */}
      <main className="flex-1  md:p-8 overflow-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          User Authentication Dashboard
        </h2>

        {/* Graphs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Last 7 Days Registrations Graph */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Last 7 Days Registration Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={last7DaysData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="registrations"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Registrations Progress Graph */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {monthlyGraphTitle}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={monthlyRegistrationsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="registrations" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Records</h2>

        {/* Search and filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-white rounded-xl shadow-md">
          <input
            type="text"
            placeholder="Search by Username"
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by Email"
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by Pincode"
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchPincode}
            onChange={(e) => setSearchPincode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Search by Mobile"
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchMobile}
            onChange={(e) => setSearchMobile(e.target.value)}
          />
          <input
            type="date"
            placeholder="Start Date"
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            placeholder="End Date"
            className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* User Records Table */}
        <div className="table-container bg-white p-6 rounded-xl shadow-md overflow-x-auto">
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal rounded-xl">
                <th className="py-3 px-6 border-b border-gray-200 rounded-tl-xl">
                  Username
                </th>
                <th className="py-3 px-6 border-b border-gray-200">Email</th>
                <th className="py-3 px-6 border-b border-gray-200">
                  Mobile Number
                </th>
                <th className="py-3 px-6 border-b border-gray-200">
                  WhatsApp Mobile Number
                </th>
                
                <th className="py-3 px-6 border-b border-gray-200">
                  Is WhatsApp
                </th>
                <th className="py-3 px-6 border-b border-gray-200">
              Action
                </th>
                <th className="py-3 px-6 border-b border-gray-200">Location</th>
                <th className="py-3 px-6 border-b border-gray-200">Pincode</th>
                <th className="py-3 px-6 border-b border-gray-200 rounded-tr-xl">
                  Registered On
                </th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {/* Map through the current data for the table rows */}
              {currentData.map((user, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 border-b border-gray-200"
                >
                  <td className="py-4 px-6">{user.username}</td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">{user.mobileNumber}</td>
                  <td className="py-4 px-6">{user.ConfurmWhatsAppMobileNumber}</td>
                  <td className="py-4 px-6">{user.phoneType}</td>
                  <td className="py-4 px-6">
                <button
                  onClick={() => handleEditClick(user)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>
              </td>
                  <td className="py-4 px-6">{user.location}</td>
                  <td className="py-4 px-6">{user.pincode}</td>
                  <td className="py-4 px-6">
                    {user.created?.toDate
                      ? new Date(user.created.toDate()).toLocaleString()
                      : new Date(user.created).toLocaleString()}
                  </td>
                </tr>
              ))}
              {/* Show a message if no data is found */}
              {currentData.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Edit User: {editingUser.username}
            </h3>

            <label className="block text-gray-600 text-sm mb-2">
            WhatsApp Mobile Number
            </label>
            <input
              type="number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-3"
            />

            <label className="block text-gray-600 text-sm mb-2">
              Phone Type
            </label>
            <select
              name="phoneType"
              value={formData.phoneType}
              onChange={handleChange}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="">Select Type</option>
           <option value="whatsapp">WhatsApp Number</option>
    <option value="non-whatsapp">Not WhatsApp Number</option>
            </select>

            <div className="flex justify-between">
              <button
                onClick={() => setEditingUser(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
        </div>

        {/* Pagination Buttons */}
        <div className="flex flex-col items-center mt-6 space-y-3">
          {/* Page Info */}
          <p className="text-gray-600 font-medium">
            Page {currentPage} of {totalPages}
          </p>

          {/* Pagination Buttons */}
          <div className="flex justify-center items-center space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl transition-colors duration-200 ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-800 hover:bg-gray-200"
              }`}
            >
              Previous
            </button>

       

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-xl transition-colors duration-200 ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-gray-800 hover:bg-gray-200"
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
