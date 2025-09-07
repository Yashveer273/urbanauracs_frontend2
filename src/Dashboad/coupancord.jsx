import React, { useEffect, useState } from "react";
import axios from "axios";

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discount: "",
    type: "percent",
    expiresAt: "",
  });
  const [message, setMessage] = useState(null);

  // ✅ Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ✅ Search state
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch All Coupons
  const fetchCoupons = async () => {
    try {
      const res = await axios.get("https://totaltimesnews.com/api/Allcoupons");
      setCoupons(res.data.coupons || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setMessage({ type: "error", text: "Failed to load coupons" });
    }
  };

  // ✅ Handle Create Coupon
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://totaltimesnews.com/Create/discountCoupen",
        form
      );
      if (res.data.success) {
        setMessage({ type: "success", text: "Coupon created successfully!" });
        setForm({ code: "", discount: "", type: "percent", expiresAt: "" });
        fetchCoupons();
      } else {
        setMessage({ type: "error", text: "Failed to create coupon" });
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      setMessage({ type: "error", text: "Server error" });
    }
  };

  // ✅ Handle Delete
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `https://totaltimesnews.com/api/deleteCoupon/${id}`
      );
      if (res.data.success) {
        setMessage({ type: "success", text: "Coupon deleted successfully!" });
        fetchCoupons();
      } else {
        setMessage({ type: "error", text: "Failed to delete coupon" });
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      setMessage({ type: "error", text: "Server error while deleting" });
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // ✅ Filtered & Paginated Coupons
  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCoupons = filteredCoupons.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <h1 className="text-2xl font-bold mb-6">🎟 Coupon Manager</h1>

      {/* ✅ Notification */}
      {message && (
        <div
          className={`p-3 rounded-lg mb-4 text-sm font-semibold shadow-md ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ✅ Create Coupon Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8 max-w-lg">
        <h2 className="text-lg font-bold mb-4">Create New Coupon</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Coupon Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="number"
            placeholder="Discount %"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="date"
            value={form.expiresAt}
            min={new Date().toISOString().split("T")[0]} // prevent past dates
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create Coupon
          </button>
        </form>
      </div>

      {/* ✅ Search Bar */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by code..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset to first page when searching
          }}
          className="w-1/3 p-2 border rounded-lg"
        />
        <button
          onClick={fetchCoupons}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          🔄 Refresh
        </button>
      </div>

      {/* ✅ Coupon Table */}
      <div className="bg-white shadow-lg rounded-xl p-6 overflow-x-auto">
        <h2 className="text-lg font-bold mb-4">All Coupons</h2>
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-2 border">Code</th>
              <th className="p-2 border">Discount %</th>
              <th className="p-2 border">Expires At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCoupons.length > 0 ? (
              currentCoupons.map((c) => (
                <tr key={c._id} className="text-center">
                  <td className="p-2 border font-bold">{c.code}</td>
                  <td className="p-2 border">{c.discount}%</td>
                  <td className="p-2 border">
                    {new Date(c.expiresAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                    >
                      ❌ Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-3 text-gray-500">
                  No coupons found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ✅ Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-4">
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage((prev) => prev - 1)}
    className={`px-4 py-1.5 rounded-lg transition ${
      currentPage === 1
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-700"
    }`}
  >
    ⬅ Prev
  </button>

  <span className="text-gray-700 font-semibold">
    Page {currentPage} of {totalPages}
  </span>

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage((prev) => prev + 1)}
    className={`px-4 py-1.5 rounded-lg transition ${
      currentPage === totalPages
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-700"
    }`}
  >
    Next ➡
  </button>
</div>

      </div>
    </div>
  );
};

export default CouponManager;
