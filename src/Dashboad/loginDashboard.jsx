import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../API";

export default function DashboardLogin() {
  const [formData, setFormData] = useState({ id: "", pass: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/login-dashAuth`, formData);

      if (res.data.token) {
        // Save token + role + username in localStorage
        localStorage.setItem("dashauthToken", res.data.token);
        localStorage.setItem("dashtagAccess", res.data.user.tagAccess);
        localStorage.setItem("dashusername", res.data.user.username);
        localStorage.setItem("dashid", res.data.user.id);

        setMessage(`✅ Welcome ${res.data.user.username} (${res.data.user.tagAccess})`);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      }
      
    } catch (err) {

      setMessage(err.response?.data?.error || "❌ Invalid credentials");
    }
  };

 

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login to Dashboard</h2>

        <input
          type="text"
          name="id"
          placeholder="Login ID"
          value={formData.id}
          onChange={handleChange}
          className="w-full mb-3 px-3 py-2 border rounded-lg"
          required
        />

        <input
          type="password"
          name="pass"
          placeholder="Password"
          value={formData.pass}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Login
        </button>

        {/* 🔹 One-click Admin Login Button */}
        

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
}
