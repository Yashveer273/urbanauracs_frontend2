import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  collection,

  doc,
  updateDoc,
  query,
  orderBy,
  getCountFromServer,
  limit,
  startAfter,
  getDocs,
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
  const pageSize = 6;

  const [tickets, setTickets] = useState([]);


  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageCursors, setPageCursors] = useState([]);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // 🔹 Get total pages + first page
  useEffect(() => {
    const init = async () => {
      const coll = collection(firestore, "homeCleaningTicket");
      const countSnap = await getCountFromServer(coll);
      const totalDocs = countSnap.data().count;
      setTotalPages(Math.ceil(totalDocs / pageSize));
      fetchPage(1);
    };
    init();
  }, []);

  // 🔹 Fetch specific page
  const fetchPage = async (pageNumber) => {


    let q;

    if (pageNumber === 1) {
      q = query(
        collection(firestore, "homeCleaningTicket"),
        orderBy("data.createdAt", "desc"),
        limit(pageSize)
      );
    } else {
      q = query(
        collection(firestore, "homeCleaningTicket"),
        orderBy("data.createdAt", "desc"),
        startAfter(pageCursors[pageNumber - 2]),
        limit(pageSize)
      );
    }

    const snapshot = await getDocs(q);

    const docs = snapshot.docs.map((docSnap) => {
      const docData = docSnap.data().data || {};
      const createdAt = docData.createdAt?.toDate
        ? docData.createdAt.toDate()
        : new Date(docData.createdAt);
      return { id: docSnap.id, ...docData, createdAt };
    });

    setTickets(docs);

    // Save cursor
    const newCursors = [...pageCursors];
    newCursors[pageNumber - 1] = snapshot.docs[snapshot.docs.length - 1];
    setPageCursors(newCursors);

    setCurrentPage(pageNumber);

  };

  // 🔹 Update ticket status
  const updateTicketStatus = async (id, newStatus) => {
    await updateDoc(doc(firestore, "homeCleaningTicket", id), {
      "data.status": newStatus,
    });

    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
    setSelectedTicket(null);
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

  // 🔎 Filters (only current page)
  const filteredTickets = tickets.filter((ticket) => {
    const matchSearch =
      ticket.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const ticketDate = ticket.createdAt
      ? ticket.createdAt.toISOString().slice(0, 10)
      : null;

    return (!filterDate || ticketDate === filterDate) && matchSearch;
  });

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Ticket Dashboard</h1>

      {/* 🔍 Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 w-full">
        <input
          type="text"
          placeholder="Search name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded-lg w-full"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border px-4 py-2 rounded-lg"
        />
      </div>

      {/* 📋 Table */}
      <div className="bg-white shadow rounded-lg overflow-auto max-h-[70vh] w-full">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Phone</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="cursor-pointer hover:bg-indigo-50"
              >
                <td className="px-4 py-2">{ticket.name}</td>
                <td className="px-4 py-2">{ticket.phone}</td>
                <td className="px-4 py-2 max-w-[200px] break-words">
                  {ticket.message}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusClasses(
                      ticket.status
                    )}`}
                  >
                    {ticket.status || "New"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {ticket.createdAt?.toLocaleString() || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔢 Pagination UI */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={() => currentPage > 1 && fetchPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          ⬅
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => fetchPage(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-200"
              }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => currentPage < totalPages && fetchPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          ➡
        </button>
      </div>

      <TicketDetailsModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdateStatus={updateTicketStatus}
      />
    </div>
  );
}