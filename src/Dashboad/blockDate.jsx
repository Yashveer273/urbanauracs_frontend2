import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  getBlockedDates,
  addBlockedDate,
  editBlockedDate,
  deleteBlockedDate,
} from "../API";

const BlockedDatesManager = () => {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedBlockedObj, setSelectedBlockedObj] = useState(null);

  useEffect(() => {
    fetchDates();
  }, []);

  const fetchDates = async () => {
    const data = await getBlockedDates();
    setDates(data);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const blockedMap = {};
  dates.forEach((d) => {
    blockedMap[new Date(d.date).toDateString()] = d;
  });

  // 🚫 ONLY past disabled
  const tileDisabled = ({ date }) => date < today;

  // 🔴 Perfect red circle
  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;

    const key = date.toDateString();
    if (blockedMap[key]) {
      return <div className="dot" />;
    }
  };

  // When clicking any date
  const handleDateClick = (date) => {
    setSelectedDate(date);
    const obj = blockedMap[date.toDateString()];
    setSelectedBlockedObj(obj || null);
  };

  // ➕ Block
  const handleBlock = async () => {
    await addBlockedDate(selectedDate);
    fetchDates();
  };

  // ❌ Unblock
  const handleUnblock = async () => {
    await deleteBlockedDate(selectedBlockedObj._id);
    setSelectedBlockedObj(null);
    fetchDates();
  };

  // ✏ Move blocked date
  const handleMoveDate = async (newDate) => {
    await editBlockedDate(selectedBlockedObj._id, newDate, true);
    fetchDates();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Blocked Dates Manager</h2>

      <Calendar
        onClickDay={handleDateClick}
        tileDisabled={tileDisabled}
        tileContent={tileContent}
      />

      <div style={{ marginTop: 20 }}>
        <h3>Selected: {selectedDate.toDateString()}</h3>

        {!selectedBlockedObj && selectedDate >= today && (
          <button style={btnBlue} onClick={handleBlock}>
            Block This Date
          </button>
        )}

        {selectedBlockedObj && (
          <div style={{ display: "flex", gap: 10 }}>
            <button style={btnRed} onClick={handleUnblock}>
              Unblock
            </button>

            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => handleMoveDate(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* 🔴 True center circle */}
      <style>{`
        .react-calendar__tile {
          position: relative;
        }
        .dot {
          height: 8px;
          width: 8px;
          background: red;
          border-radius: 50%;
          position: absolute;
          bottom: 6px;
          left: 50%;
          transform: translateX(-50%);
        }
      `}</style>
    </div>
  );
};

const btnBlue = {
  padding: "8px 14px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 6,
};

const btnRed = {
  padding: "8px 14px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: 6,
};

export default BlockedDatesManager;
