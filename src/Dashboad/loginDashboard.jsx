import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { API_BASE_URL } from "../API";

export default function DashboardLogin() {
  const [formData, setFormData] = useState({
    id: "",
    pass: "",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/login-dashAuth`,
        formData
      );

      if (res.data.token) {
        localStorage.setItem(
          "urbanauraservicesdashauthToken",
          res.data.token
        );

        localStorage.setItem(
          "urbanauraservicesdashtagAccess",
          res.data.user.tagAccess
        );

        setMessage(`✅ Welcome back, ${res.data.user.username}`);

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard Access
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Enter your credentials to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Login ID */}
          <div>
            <input
              type="text"
              name="id"
              placeholder="Login ID"
              value={formData.id}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="pass"
              placeholder="Password"
              value={formData.pass}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 outline-none transition-all focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-slate-500 transition hover:text-slate-700"
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? (
                <FaEyeSlash size={18} />
              ) : (
                <FaEye size={18} />
              )}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div className="mt-6 rounded-lg bg-slate-50 p-3 text-center text-xs font-medium text-slate-600">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}