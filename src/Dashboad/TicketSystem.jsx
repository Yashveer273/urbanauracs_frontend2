import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  collection,
  doc,
  updateDoc,
  orderBy,
  getDocs,
  query,
} from "firebase/firestore";
import { firestore } from "../firebaseCon"; // adjust path

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
  const pageSize = 5; // Changed layout configuration to 5 rows as requested

  const [allTickets, setAllTickets] = useState([]); // Keeps full list for unified lookup
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // 🔹 Fetch all tickets sequentially on mount to allow accurate searching across pages
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const q = query(
          collection(firestore, "homeCleaningTicket"),
          orderBy("data.createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((docSnap) => {
          const docData = docSnap.data().data || {};
          const createdAt = docData.createdAt?.toDate
            ? docData.createdAt.toDate()
            : docData.createdAt 
              ? new Date(docData.createdAt) 
              : null;
          return { id: docSnap.id, ...docData, createdAt };
        });
        setAllTickets(docs);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };
    fetchAllData();
  }, []);

  // 🔹 Update ticket status directly
  const updateTicketStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(firestore, "homeCleaningTicket", id), {
        "data.status": newStatus,
      });

      setAllTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
      setSelectedTicket(null);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-200 text-blue-800";
      case "In Progress":
        return "bg-yellow-200 text-yellow-800";
      case "Closed":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // 🔎 1. Step 1: Filter full tracking dataset across global parameters completely first
  const masterFilteredTickets = allTickets.filter((ticket) => {
    const matchSearch =
      ticket.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.message?.toLowerCase().includes(searchTerm.toLowerCase());

    const ticketDate = ticket.createdAt
      ? ticket.createdAt.toISOString().slice(0, 10)
      : null;

    return (!filterDate || ticketDate === filterDate) && matchSearch;
  });

  // Reset safely back to page 1 if current selections shrink beyond range
  const totalPages = Math.ceil(masterFilteredTickets.length / pageSize) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;

  // 📋 2. Step 2: Extract current active page segment out of matching subset
  const startIndex = (activePage - 1) * pageSize;
  const paginatedTickets = masterFilteredTickets.slice(startIndex, startIndex + pageSize);

  // 🔢 Generate matching localized pagination layout sequences
  const getPaginationNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (activePage > 3) pages.push("...");

      const start = Math.max(2, activePage - 1);
      const end = Math.min(totalPages - 1, activePage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (activePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Ticket Dashboard</h1>

      {/* 🔍 Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 w-full">
        <input
          type="text"
          placeholder="Search name, phone, or description..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Force reset index back to start
          }}
          className="border px-4 py-2 rounded-lg w-full outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => {
            setFilterDate(e.target.value);
            setCurrentPage(1); // Force reset index back to start
          }}
          className="border px-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* 📋 Table */}
      <div className="bg-white shadow rounded-lg overflow-auto max-h-[70vh] w-full">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Phone</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Message</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedTickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="cursor-pointer hover:bg-indigo-50/50 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-900">{ticket.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{ticket.phone}</td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-[240px] truncate">
                  {ticket.message}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusClasses(
                      ticket.status
                    )}`}
                  >
                    {ticket.status || "New"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {ticket.createdAt?.toLocaleString() || "—"}
                </td>
              </tr>
            ))}
            {paginatedTickets.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-400 text-sm">
                  No matching tickets discovered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔢 Pagination UI */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={activePage === 1}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300 disabled:opacity-40 disabled:hover:bg-gray-200 transition-all"
          >
            Previous
          </button>

          {getPaginationNumbers().map((page, index) =>
            page === "..." ? (
              <span key={index} className="px-2 text-gray-400 select-none">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${
                  activePage === page
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={activePage === totalPages}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300 disabled:opacity-40 disabled:hover:bg-gray-200 transition-all"
          >
            Next
          </button>
        </div>
      )}

      <TicketDetailsModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdateStatus={updateTicketStatus}
      />
    </div>
  );
}