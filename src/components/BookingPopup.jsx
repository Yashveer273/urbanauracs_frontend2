import React, { useMemo, useState, useEffect } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import Portal from "./Portal";
import { getBlockedDates } from "../API";

const BookingPopup = ({
  onClose,
  onConfirm,
  applyGapCondition = false, // ✅ default false
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [hour, setHour] = useState("");
  const [open, setOpen] = useState(false);
  const [blockedDates, setBlockedDates] = useState([]);

  const [address, setAddress] = useState("");
  const [rememberAddress, setRememberAddress] = useState(false);

  /* ---------------- MIN DATE ---------------- */
  const minDate = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);
  const loadBlockedDates = async () => {
    try {
      const data = await getBlockedDates();

      // convert to YYYY-MM-DD format
      const formatted = data.map((d) => {
        const dt = new Date(d.date);
        return dt.toISOString().split("T")[0];
      });

      setBlockedDates(formatted);
    } catch (err) {
      console.error("Failed to load blocked dates", err);
    }
  };
  /* ---------------- LOAD SAVED ADDRESS ---------------- */
  useEffect(() => {
    loadBlockedDates();
    const saved = localStorage.getItem("urberaura-bookingAddressStatus");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.remember && parsed?.address) {
          setRememberAddress(true);
          setAddress(parsed.address);
        }
      } catch (e) {
        console.error("Error parsing saved booking address:", e);
      }
    }
  }, []);

  /* ---------------- ALL SLOTS ---------------- */
  const timeSlots = [
    "08:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
    "06:00 PM - 08:00 PM",
  ];

  /* ---------------- CHECK TODAY ---------------- */
  const isToday = (date) => {
    const today = new Date();
    const d = new Date(date);
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  /* ---------------- SLOT FILTER LOGIC ---------------- */
  const filteredSlots = useMemo(() => {
    // 🔴 If flag is false → behave normally
    if (!applyGapCondition) {
      return timeSlots;
    }

    if (!selectedDate) return [];

    // Future date → show all slots
    if (!isToday(selectedDate)) {
      return timeSlots;
    }

    const currentHour = new Date().getHours();

    // After 2 PM → no same-day slots
    if (currentHour >= 14) return [];

    if (currentHour < 8) {
      return [
        "02:00 PM - 04:00 PM",
        "04:00 PM - 06:00 PM",
        "06:00 PM - 08:00 PM",
      ];
    }

    if (currentHour < 12) {
      return ["04:00 PM - 06:00 PM", "06:00 PM - 08:00 PM"];
    }

    return ["06:00 PM - 08:00 PM"];
  }, [selectedDate, applyGapCondition]);

  /* ---------------- CLEAR TIME ON DATE CHANGE ---------------- */
  useEffect(() => {
    setHour("");
  }, [selectedDate]);

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (rememberAddress) {
      localStorage.setItem(
        "urberaura-bookingAddressStatus",
        JSON.stringify({ remember: true, address }),
      );
    } else {
      localStorage.removeItem("urberaura-bookingAddressStatus");
    }

    // 🔥 Payable / payment logic untouched
    onConfirm(selectedDate, hour, address);
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[1003] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative w-full max-w-md bg-[#1b1c28] text-white p-10 rounded-2xl">
          <h2 className="text-3xl font-bold text-center mb-6">
            Choose Booking Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* DATE */}
            <div
              className="relative"
              onClick={() =>
                document.getElementById("bookingDate").showPicker()
              }
            >
              <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="date"
                id="bookingDate"
                min={minDate}
                value={selectedDate}
                onChange={(e) => {
                  const chosen = e.target.value;

                  if (blockedDates.includes(chosen)) {
                    alert("This date is not available for booking.");
                    setSelectedDate("");
                    return;
                  }

                  setSelectedDate(chosen);
                }}
                className="w-full bg-gray-700 rounded-lg pl-12 pr-4 py-3"
                required
              />
            </div>

            {/* TIME */}
            <div className="relative">
              <FaClock className="absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                readOnly
                placeholder="Select Time"
                value={hour}
                onClick={() => setOpen(!open)}
                className="w-full bg-gray-700 rounded-lg pl-12 pr-4 py-3 cursor-pointer"
              />

              {open && (
                <div className="absolute mt-2 w-full bg-gray-900 p-4 rounded-xl z-50">
                  {filteredSlots.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center">
                      No slots available
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-3">
                      {filteredSlots.map((slot, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => {
                            setHour(slot);
                            setOpen(false);
                          }}
                          className="bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 text-sm"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ADDRESS */}
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Booking Address"
                className="w-full bg-gray-700 rounded-lg pl-12 pr-4 py-3"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#f87559] py-3 rounded-lg font-bold"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default BookingPopup;
