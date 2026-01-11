import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../firebaseCon"; // adjust path

// ✅ Small popup notification for new ticket
const NewTicketNotification = ({ ticket, onClose }) => {
  if (!ticket) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-xl p-4 flex items-start space-x-4 animate-slide-in-right max-w-sm">
        <div className="flex-1">
          <h3 className="text-sm font-bold">New Ticket from {ticket.name}</h3>
          <p className="text-xs text-gray-400 mt-1">Phone: {ticket.phone}</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          ✕
        </button>
      </div>
    </div>
  );
};

// ✅ Modal for ticket details & update
const TicketDetailsModal = ({ ticket, onClose, onUpdateStatus }) => {
  if (!ticket) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-75 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Ticket Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            ✕
          </button>
        </div>

        <p><strong>Name:</strong> {ticket.name}</p>
        <p><strong>Message:</strong> {ticket.message}</p>
        <p><strong>Phone:</strong> {ticket.phone}</p>
        <p><strong>Date:</strong> {ticket.createdAt ? ticket.createdAt.toLocaleString() : "—"}</p>

        <div className="mt-4">
          <label className="block text-gray-700 font-medium mb-2">
            Update Status
          </label>
          <select
            value={ticket.status || "New"}
            onChange={(e) => onUpdateStatus(ticket.id, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          >
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default function TicketDashboard() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newTicketNotification, setNewTicketNotification] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 🔹 Firestore real-time listener
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "homeCleaningTicket"),
      (snapshot) => {
        let newTickets = [];
        snapshot.forEach((docSnap) => {
          const docData = docSnap.data().data || {}; // unwrap inner `data`

          // ✅ normalize createdAt
          let createdAt = null;
          if (docData.createdAt) {
            if (docData.createdAt.toDate) {
              createdAt = docData.createdAt.toDate(); // Firestore Timestamp
            } else {
              createdAt = new Date(docData.createdAt); // String/ms → Date
            }
          }

          newTickets.push({ id: docSnap.id, ...docData, createdAt });
        });

        if (newTickets.length > tickets.length) {
          const latest = newTickets[0];
          setNewTicketNotification(latest);
          setTimeout(() => setNewTicketNotification(null), 5000);
        }

        setTickets(newTickets);
      }
    );

    return () => unsubscribe();
  }, [tickets]);

  // 🔹 Update ticket status
  const updateTicketStatus = async (id, newStatus) => {
    const ticketRef = doc(firestore, "homeCleaningTicket", id);
    await updateDoc(ticketRef, { "data.status": newStatus });

    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    setSelectedTicket(null);
  };

  // 🔹 Status badge colors
  const getStatusClasses = (status) => {
    switch (status) {
      case "New": return "bg-blue-200 text-blue-800";
      case "In Progress": return "bg-yellow-200 text-yellow-800";
      case "Closed": return "bg-green-200 text-green-800";
      default: return "bg-gray-200 text-gray-800";
    }
  };

  // 🔎 Search + Filter
  const filteredTickets = tickets.filter((ticket) => {
    const matchSearch =
      ticket.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
   
      ticket.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const ticketDate = ticket.createdAt
      ? ticket.createdAt.toISOString().slice(0, 10)
      : null;

    const matchDate = !filterDate || ticketDate === filterDate;

    return matchSearch && matchDate;
  });

  // 📑 Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const currentTickets = filteredTickets.slice(indexOfLast - itemsPerPage, indexOfLast);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  return (
    <div className="bg-gray-100 min-h-screen font-sans p-6">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Ticket Dashboard</h1>
      </header>

      {/* 🔍 Search + Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => {
            setFilterDate(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* 📋 Table */}
      {tickets.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm max-w-3xl mx-auto">
          <p className="text-lg text-gray-500">No tickets found yet!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg max-w-6xl mx-auto max-h-[70vh] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Message</th>
              
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentTickets.length > 0 ? (
                currentTickets.map((ticket, index) => (
                  <tr
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className={`cursor-pointer hover:bg-indigo-50 transition ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">
                      {ticket.name}
                    </td>
                    
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {ticket.phone}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {ticket.message}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClasses(ticket.status)}`}>
                        {ticket.status || "New"}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      {ticket.createdAt ? ticket.createdAt.toLocaleString() : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500">
                    No tickets match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 📑 Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              currentPage === i + 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modals & Notifications */}
      <TicketDetailsModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdateStatus={updateTicketStatus}
      />
      <NewTicketNotification
        ticket={newTicketNotification}
        onClose={() => setNewTicketNotification(null)}
      />
    </div>
  );
}
