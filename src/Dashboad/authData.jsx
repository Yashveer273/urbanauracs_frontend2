import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Sample JSON data for user registrations
const authData = [
  {
    "countryCode": "+91",
    "email": "soniyash921@gmail.com",
    "location": "khair",
    "mobileNumber": "09627068853",
    "pincode": "202138",
    "token": "mock_token_456",
    "username": "yash",
    "createdAt": "2025-08-29T10:00:00Z"
  },
  {
    "countryCode": "+91",
    "email": "jane.doe@example.com",
    "location": "Pune, India",
    "mobileNumber": "9816543210",
    "pincode": "411001",
    "token": "mock_token_123",
    "username": "Jane Doe",
    "createdAt": "2025-08-28T14:00:00Z"
  },
  {
    "countryCode": "+91",
    "email": "harsh.gupta@example.com",
    "location": "Mumbai, India",
    "mobileNumber": "9876509876",
    "pincode": "400001",
    "token": "mock_token_789",
    "username": "Harsh Gupta",
    "createdAt": "2025-08-28T15:45:00Z"
  },
  {
    "countryCode": "+91",
    "email": "customer1@example.com",
    "location": "New Delhi, India",
    "mobileNumber": "9876543210",
    "pincode": "110001",
    "token": "mock_token_987",
    "username": "Simran singh",
    "createdAt": "2025-08-27T10:30:00Z"
  },
  {
    "countryCode": "+91",
    "email": "sanjay.kumar@example.com",
    "location": "Bangalore, India",
    "mobileNumber": "9988776655",
    "pincode": "560001",
    "token": "mock_token_567",
    "username": "Sanjay Kumar",
    "createdAt": "2025-08-26T09:15:00Z"
  },
    {
    "countryCode": "+91",
    "email": "priya.sharma@example.com",
    "location": "Hyderabad, India",
    "mobileNumber": "9876543210",
    "pincode": "500001",
    "token": "mock_token_234",
    "username": "Priya Sharma",
    "createdAt": "2025-08-25T17:30:00Z"
  },
  {
    "countryCode": "+91",
    "email": "rajesh.patel@example.com",
    "location": "Ahmedabad, India",
    "mobileNumber": "9012345678",
    "pincode": "380001",
    "token": "mock_token_876",
    "username": "Rajesh Patel",
    "createdAt": "2025-08-24T10:00:00Z"
  },
  {
    "countryCode": "+91",
    "email": "anita.desai@example.com",
    "location": "Jaipur, India",
    "mobileNumber": "9123456789",
    "pincode": "302001",
    "token": "mock_token_345",
    "username": "Anita Desai",
    "createdAt": "2025-08-23T16:00:00Z"
  }
];

// Main App component
export default function AuthDashboard() {
  // State for search inputs
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchPincode, setSearchPincode] = useState('');
  const [searchMobile, setSearchMobile] = useState('');

  // States for the date filter
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // State for the filtered data displayed in the table
  const [filteredData, setFilteredData] = useState(authData);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // States for the two new graphs
  const [last7DaysData, setLast7DaysData] = useState([]);
  const [monthlyRegistrationsData, setMonthlyRegistrationsData] = useState([]);
  const [monthlyGraphTitle, setMonthlyGraphTitle] = useState('');

  // Function to filter the data based on search inputs
  const filterTable = () => {
    const filtered = authData.filter(user => {
      const nameMatch = user.username.toLowerCase().includes(searchName.toLowerCase());
      const emailMatch = user.email.toLowerCase().includes(searchEmail.toLowerCase());
      const pincodeMatch = user.pincode.includes(searchPincode);
      const mobileMatch = user.mobileNumber.includes(searchMobile);
      const userDate = new Date(user.createdAt);

      const dateMatch = (
        (!startDate || userDate >= new Date(startDate)) &&
        (!endDate || userDate <= new Date(endDate))
      );
      
      return nameMatch && emailMatch && pincodeMatch && mobileMatch && dateMatch;
    });
    setFilteredData(filtered);
  };

  // Function to process user data for the graphs
  const processGraphData = () => {
    // 1. Process data for the last 7 days graph
    const dailyRegistrations = {};
    authData.forEach(user => {
      const date = new Date(user.createdAt).toISOString().slice(0, 10);
      dailyRegistrations[date] = (dailyRegistrations[date] || 0) + 1;
    });

    const sortedDates = Object.keys(dailyRegistrations).sort();
    const last7Dates = sortedDates.slice(-7);
    const last7DaysGraphData = last7Dates.map(date => {
      const d = new Date(date);
      const day = d.getDate();
      const month = d.getMonth() + 1; // Month is 0-indexed
      return {
        formattedDate: `${day}/${month}`, // Format for day and month
        registrations: dailyRegistrations[date],
      };
    });
    setLast7DaysData(last7DaysGraphData);

    // 2. Process data for the monthly progress graph
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Set the title for the monthly graph
    const monthName = today.toLocaleString('default', { month: 'long' });
    setMonthlyGraphTitle(`Registration Progress for ${monthName} ${currentYear}`);
    
    // Create an array for all days of the current month, initialized to 0
    const monthlyGraphData = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return {
        formattedDate: `${day}`,
        registrations: 0,
      };
    });

    authData.forEach(user => {
      const userDate = new Date(user.createdAt);
      if (userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear) {
        const day = userDate.getDate();
        // Find the correct day in our initialized array and add the registration count
        const dayData = monthlyGraphData.find(d => parseInt(d.formattedDate) === day);
        if (dayData) {
          dayData.registrations += 1;
        }
      }
    });
    setMonthlyRegistrationsData(monthlyGraphData);
  };

  // useEffect hook to run the filter and graph processing functions whenever search inputs change or data is updated
  useEffect(() => {
    filterTable();
    processGraphData();
    // Reset to the first page whenever the filter changes
    setCurrentPage(1);
  }, [searchName, searchMobile, searchEmail, searchPincode, startDate, endDate]);

  // Pagination logic to calculate data for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Render the component
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">User Authentication Dashboard</h2>

        {/* Graphs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Last 7 Days Registrations Graph */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Last 7 Days Registration Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last7DaysData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="registrations" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Registrations Progress Graph */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{monthlyGraphTitle}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRegistrationsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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

        <hr className="my-6 border-gray-300"/>

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
                <th className="py-3 px-6 border-b border-gray-200 rounded-tl-xl">Username</th>
                <th className="py-3 px-6 border-b border-gray-200">Email</th>
                <th className="py-3 px-6 border-b border-gray-200">Mobile Number</th>
                <th className="py-3 px-6 border-b border-gray-200">Location</th>
                <th className="py-3 px-6 border-b border-gray-200">Pincode</th>
                <th className="py-3 px-6 border-b border-gray-200 rounded-tr-xl">Registered On</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {/* Map through the current data for the table rows */}
              {currentData.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50 border-b border-gray-200">
                  <td className="py-4 px-6">{user.username}</td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">{user.mobileNumber}</td>
                  <td className="py-4 px-6">{user.location}</td>
                  <td className="py-4 px-6">{user.pincode}</td>
                  <td className="py-4 px-6">{new Date(user.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {/* Show a message if no data is found */}
              {currentData.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-4 px-6 text-center text-gray-500">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl transition-colors duration-200 ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-xl transition-colors duration-200 ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-xl transition-colors duration-200 ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
