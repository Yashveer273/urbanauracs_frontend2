import React, { useEffect, useState } from "react";
import { getBlockedDates, deleteBlockedDate, addBlockedDate } from "../API";

const BlockedDatesTable = () => {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDates();
  }, []);

  const fetchDates = async () => {
    const data = await getBlockedDates(); 
    setDates(data);
  };

const handleBlockDate = async (e) => {
    e.preventDefault();
    if (!selectedDate) return;

    // 1. Normalize comparison: Extract YYYY-MM-DD from the DB date string
    const existingDate = dates.find((d) => {
      // This handles "2026-01-28T00:00:00.000Z" -> "2026-01-28"
      const formattedDBDate = d.date.split("T")[0]; 
      return formattedDBDate === selectedDate;
    });

    // 2. Alert and provide Unblock option
    if (existingDate) {
      const confirmUnblock = window.confirm(
        `Date ${selectedDate} is already blocked. Would you like to unblock it?`
      );
      
      if (confirmUnblock) {
        try {
          setLoading(true);
          await deleteBlockedDate(existingDate._id);
          setSelectedDate("");
          fetchDates();
        } catch (err) {
          console.log(err);
          alert("Error unblocking date.");
        } finally {
          setLoading(false);
        }
      }
      return; // Stop here if date was already blocked
    }

    // 3. If it's a new date, add it
    try {
      setLoading(true);
      await addBlockedDate(selectedDate);
      setSelectedDate("");
      fetchDates();
    } catch (err) {
               console.log(err);
      alert("Failed to block date.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (id) => {
    if (window.confirm("Are you sure you want to unblock this date?")) {
      await deleteBlockedDate(id);
      fetchDates();
    }
  };

  return (
    <div style={{ marginTop: 40, maxWidth: "600px" }}>
      <h2>Manage Blocked Dates</h2>

      {/* --- Calendar Input Section --- */}
      <div style={formContainer}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={inputStyle}
          min={new Date().toISOString().split("T")[0]} // Prevent past dates
        />
        <button 
          onClick={handleBlockDate} 
          disabled={loading || !selectedDate}
          style={loading ? {...btnBlue, opacity: 0.5} : btnBlue}
        >
          {loading ? "Processing..." : "Block Date"}
        </button>
      </div>

      <hr style={{ margin: "20px 0" }} />

      {/* --- Table Section --- */}
      <table style={tableStyle}>
        <thead>
          <tr style={{ background: "#111827", color: "white" }}>
            <th style={th}>#</th>
            <th style={th}>Blocked Date</th>
            <th style={th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {dates.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ padding: 20, textAlign: "center" }}>
                No blocked dates found.
              </td>
            </tr>
          ) : (
            dates.map((d, i) => (
              <tr key={d._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={td}>{i + 1}</td>
                <td style={td}>{  d.date.split("T")[0]??""}</td>
                <td style={td}>
                  <button style={btnRed} onClick={() => handleUnblock(d._id)}>
                    Unblock
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// --- Styles ---

const formContainer = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const inputStyle = {
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  flex: 1,
};

const btnBlue = {
  padding: "8px 16px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: 5,
  cursor: "pointer",
};

const tableStyle = { width: "100%", borderCollapse: "collapse", background: "white" };
const th = { padding: 12, textAlign: "left" };
const td = { padding: 12 };
const btnRed = { padding: "6px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: 5, cursor: "pointer" };

export default BlockedDatesTable;