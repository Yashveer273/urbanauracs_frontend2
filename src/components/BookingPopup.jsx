import React, { useMemo, useState } from "react";
import { FaTimes, FaCalendarAlt } from "react-icons/fa";
// Use your existing app Portal. If your Portal is elsewhere, adjust the path.
import Portal from "./Portal";

const BookingPopup = ({ onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState("");

  // today in YYYY-MM-DD to prevent past-date selection
  const minDate = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedDate) return;
    onConfirm(selectedDate);
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[1003] flex items-center justify-center p-4 font-inter">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-[#1b1c28] text-white p-10">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
            onClick={onClose}
            aria-label="Close booking popup"
          >
            <FaTimes size={22} />
          </button>

          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Choose Booking Date</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <FaCalendarAlt className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  min={minDate}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#f87559] text-white py-3 rounded-lg font-bold text-lg hover:bg-[#ff8f6e] transition-colors"
              >
                Confirm Date
              </button>
            </form>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default BookingPopup;
