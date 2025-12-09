import React, { useMemo, useState, useEffect } from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Portal from "./Portal";

const BookingPopup = ({ onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [hour, setHour] = useState("");

  const [address, setAddress] = useState("");
  const [rememberAddress, setRememberAddress] = useState(false);

  // today in YYYY-MM-DD to prevent past-date selection
  const minDate = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Load saved address if rememberAddress was true
  useEffect(() => {
    const savedStatus = localStorage.getItem("urberaura-bookingAddressStatus");
    if (savedStatus) {
      try {
        const parsed = JSON.parse(savedStatus);
        if (parsed?.remember && parsed?.address) {
          setRememberAddress(true);
          setAddress(parsed.address);
        }
      } catch (e) {
        console.error("Error parsing saved booking address", e);
      }
    }
  }, []);



  // Validate 3 hours ahead
  // ✅ Validation using selected time + ensuring 3h gap

  const handleSubmit = (e) => {
    e.preventDefault();

    const timeFinal = `${hour}`;

    if (rememberAddress) {
      localStorage.setItem(
        "urberaura-bookingAddressStatus",
        JSON.stringify({ remember: true, address })
      );
    } else {
      localStorage.removeItem("urberaura-bookingAddressStatus");
    }


    onConfirm(selectedDate, timeFinal, address);
    onClose();
  };
const timeSlots = [
  "8:00 AM - 10:00 AM", "10:00 AM - 12:00 PM", "12:00 PM - 02:00 PM", "02:00 PM - 04:00 PM", "04:00 PM - 06:00 PM", "06:00 PM - 08:00 PM"
];
 const [open, setOpen] = useState(false);
  return (
    <Portal>
      <div className="fixed inset-0 z-[1003] flex items-center justify-center p-4 font-inter">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-[#1b1c28] text-white p-10">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
            onClick={onClose}
            aria-label="Close booking popup"
          >
            <FaTimes size={22} />
          </button>

          {/* Form */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Choose Booking Details</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Picker */}
              <div className="relative" onClick={() => document.getElementById("bookingDate").showPicker()}>
                <FaCalendarAlt className="absolute top-1/2 left-4 -translate-y-1/2 text-white h-5 w-5" />
                <input
                  type="date"
                  min={minDate}
                  id="bookingDate"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none"
                  required
                />
              </div>
<div className="relative w-full">
    
      <div
        className="relative cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <FaClock className="absolute top-1/2 left-4 -translate-y-1/2 text-white h-5 w-5" />
        <input
          type="text"
          readOnly
          value={hour || ""}
          placeholder="Select Time"
          className="w-full bg-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none cursor-pointer"
        />
      </div>

      
      {open && (
  <div className="absolute z-50 mt-2 w-full bg-gray-900 rounded-xl shadow-xl p-4 max-h-60 overflow-y-auto">
    <div className="grid grid-cols-3 gap-3">
      {timeSlots.map((slot, index) => {
        const [start, end] = slot.split(" - ");
        return (
          <button
            key={index}
            onClick={() => {
              setHour(slot);
              setOpen(false);
            }}
            className={`px-3 py-2 rounded-lg transition flex flex-col items-center text-center 
              ${hour === slot
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"}
            `}
          >
            <span className="text-sm font-semibold">{start}</span>
            <span className="text-[10px] opacity-70 leading-tight">to</span>
            <span className="text-sm font-semibold">{end}</span>
          </button>
        );
      })}
    </div>
  </div>
)}


    </div>

              {/* Address Field */}
              <div className="relative">
                <FaMapMarkerAlt className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="bookingAddress" 
                  placeholder="Enter Booking Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg pl-12 pr-4 py-3 text-white focus:outline-none"
                  required
                />
              </div>

              {/* Remember Address */}
              <div className="flex items-center gap-2 text-left">
                <input
                  type="checkbox"
                  id="rememberAddress"
                  checked={rememberAddress}
                  onChange={(e) => setRememberAddress(e.target.checked)}
                  className="h-4 w-4"
                />
                <label
                  htmlFor="rememberAddress"
                  className="text-sm text-gray-300"
                >
                  Remember my address for next booking
                </label>
              </div>
              <p className="text-sm text-[#fbbf24] bg-[#2c2d34] px-3 py-2 rounded-lg text-center border border-[#fbbf24]/40">
                The team will be reaching your place within the time slot.
              </p>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#f87559] text-white py-3 rounded-lg font-bold text-lg hover:bg-[#ff8f6e] transition-colors"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default BookingPopup;
