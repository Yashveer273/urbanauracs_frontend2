import React, { useState, useMemo, useEffect } from "react";
import { Notificationsend, FetchAllFCMUsers } from "../API";

const NotificationDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Pagination States mapping directly to backend response schema
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "", // Primary Image (Thumbnail)
    bannerUrl: "", // Secondary Image (Big Picture)
    message: "",
    type: "broadcast",
    selectedUser: null,
  });

  // Updated to pass target page to API endpoint
  const loadUsers = async (pageTarget = 1) => {
    setDataLoading(true);
    const result = await FetchAllFCMUsers(pageTarget); // Assumes FetchAllFCMUsers routes to /firebase-users?page=X
    
    if (result.success) {
      setUsers(result.data || []);
      if (result.pagination) {
        setPagination(result.pagination);
      } else {
        // Fallback metadata configuration if pagination schema isn't fully ready
        setPagination({
          totalCount: result.count || result.data.length,
          totalPages: 1,
          currentPage: 1,
          limit: 10,
          hasNextPage: false,
          hasPrevPage: false,
        });
      }
    }
    setDataLoading(false);
  };

  useEffect(() => {
    loadUsers(1);
  }, []);

  // Standard client search filter
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;

    return users.filter(
      (user) =>
        (user.phone && user.phone.includes(searchTerm)) ||
        (user.userId && user.userId.includes(searchTerm)) ||
        (user.androidId && user.androidId.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, users]);

  const openModal = (type, user = null) => {
    setFormData({
      title: type.includes("incomplete") ? "Verify your phone number 📱" : "",
      imageUrl: "",
      bannerUrl: "",
      message: type.includes("incomplete")
        ? "Please update your phone number to continue."
        : "",
      type: type,
      selectedUser: user,
    });
    setIsModalOpen(true);
  };

  const handleFireNotification = async () => {
    if (!formData.title || !formData.message)
      return alert("Please fill Title and Message");
    setLoading(true);
    const payload = {
      type: formData.type,
      title: formData.title,
      message: formData.message,
      imageUrl: formData.imageUrl,
      bannerUrl: formData.bannerUrl,
      ...(formData.selectedUser && { userId: formData.selectedUser.userId,firebaseUID: formData.selectedUser.firebaseUID, 
        androidId: formData.selectedUser.androidId }),
    };
    const result = await Notificationsend(payload);
    setLoading(false);
    if (result.success) {
      alert(`Success! Sent to ${result.totalUsers || 1} users.`);
      setIsModalOpen(false);
    } else {
      alert(result.message || "Failed to send");
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900">
      {/* HEADER */}
      <div className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 px-4 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white text-xl">🔔</span>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-slate-800 leading-none">
                Notification Center
              </h1>
              <p className="text-[10px] md:text-xs font-medium text-slate-400 mt-1 uppercase tracking-wider">
                {pagination.totalCount} Total System Profiles
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:flex-grow md:min-w-[240px]">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 grayscale opacity-50">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search phone, userId, or androidId..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => openModal("incomplete_all")}
                className="flex-1 bg-amber-100 text-amber-700 px-3 md:px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold hover:bg-amber-200 transition-colors flex items-center justify-center gap-2"
              >
                <span>⚠️</span> Incomplete
              </button>

              <button
                onClick={() => openModal("broadcast")}
                className="flex-1 bg-indigo-600 text-white px-4 md:px-6 py-2.5 rounded-xl text-xs md:text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
              >
                <span>📢</span> Broadcast
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="max-w-7xl mx-auto w-full p-4 lg:p-10 flex-grow">
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          {dataLoading ? (
            <div className="flex flex-col items-center justify-center h-80 space-y-4">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 font-medium">Fetching Directory...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[750px]">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 md:px-8 py-5 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Contact Details
                      </th>
                      <th className="px-6 md:px-8 py-5 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Device & Token Info
                      </th>
                      <th className="px-6 md:px-8 py-5 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        User ID
                      </th>
                      <th className="px-6 md:px-8 py-5 text-[10px] md:text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-12 text-slate-400 font-medium text-sm">
                          No profiles matching criteria found on this page.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr
                          key={user._id}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          <td className="px-6 md:px-8 py-5">
                            <div className="flex flex-col">
                              <span
                                className={`text-sm md:text-base font-bold ${
                                  !user.phone ? "text-rose-500" : "text-slate-700"
                                }`}
                              >
                                {user.phone || "No Phone Number"}
                              </span>
                              <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                                {!user.phone ? "Action Required" : "Verified Account"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-5">
                            <div className="flex flex-col max-w-[280px]">
                              <span className="text-xs font-bold text-slate-600 truncate">
                                📱 ID: {user.androidId || "Unknown"}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono truncate mt-0.5" title={user.firebaseUID}>
                                FCM: {user.firebaseUID || "No Token Saved"}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 md:px-8 py-5">
                            <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-lg text-[10px] md:text-xs font-mono font-medium border border-slate-200 truncate inline-block max-w-[140px]">
                              {user.userId || "No Custom UID"}
                            </span>
                          </td>
                          <td className="px-6 md:px-8 py-5">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openModal("individual", user)}
                                className="bg-indigo-55 text-indigo-600 bg-indigo-50 px-3 md:px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all whitespace-nowrap"
                              >
                                Send Direct
                              </button>
                              {!user.phone && (
                                <button
                                  onClick={() => openModal("incomplete_single", user)}
                                  className="bg-rose-50 text-rose-600 px-3 md:px-4 py-2 rounded-lg text-[10px] md:text-xs font-bold hover:bg-rose-600 hover:text-white transition-all whitespace-nowrap"
                                >
                                  Alert
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* DYNAMIC PAGINATION CONTROLS */}
              <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-slate-400 font-medium">
                  Showing page <strong className="text-slate-700">{pagination.currentPage}</strong> of{" "}
                  <strong className="text-slate-700">{pagination.totalPages}</strong> ({pagination.totalCount} results)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => loadUsers(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrevPage || dataLoading}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    ⏮️ Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => loadUsers(pageNum)}
                          className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                            pagination.currentPage === pageNum
                              ? "bg-indigo-600 text-white shadow-sm"
                              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => loadUsers(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage || dataLoading}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next ⏭️
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* MODAL WITH PREVIEW */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm md:backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative bg-white w-full max-w-4xl h-[90vh] md:h-auto rounded-t-[32px] md:rounded-[40px] shadow-2xl overflow-y-auto md:overflow-hidden flex flex-col md:flex-row animate-in slide-in-from-bottom md:zoom-in-95 duration-300">
            {/* Form Side */}
            <div className="flex-1 p-6 md:p-10 border-b md:border-b-0 md:border-r border-slate-100">
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">
                    {formData.type.includes("incomplete")
                      ? "Incomplete Alert"
                      : "New Notification"}
                  </h2>
                  <p className="text-xs md:text-sm text-slate-400 mt-1">
                    Setup message delivery
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="md:hidden text-slate-400 p-2"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 md:space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1 space-y-1.5">
                    <label className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase ml-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-4 py-2.5 md:py-3 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm md:text-base text-slate-700 transition-all"
                      placeholder="Notification Heading"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1 space-y-1.5">
                    <label className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase ml-1">
                      Type Tag
                    </label>
                    <div className="px-4 py-2.5 md:py-3 bg-slate-100 text-slate-500 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold uppercase tracking-widest italic">
                      {formData.type}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase ml-1">
                    Thumbnail URL
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 transition-all text-xs md:text-sm"
                    placeholder="https://image-link.png"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase ml-1">
                    Banner URL
                  </label>
                  <input
                    type="text"
                    value={formData.bannerUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, bannerUrl: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 transition-all text-xs md:text-sm"
                    placeholder="https://banner-link.jpg"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase ml-1">
                    Message Body
                  </label>
                  <textarea
                    rows="3"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-slate-700 transition-all text-xs md:text-sm"
                    placeholder="Type content here..."
                  />
                </div>

                <button
                  onClick={handleFireNotification}
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 active:scale-[0.98] transition-all disabled:opacity-50 mt-4"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>🚀 Launch</>
                  )}
                </button>
              </div>
            </div>

            {/* Preview Side */}
            <div className="w-full md:w-[360px] bg-slate-50 p-6 md:p-8 flex flex-col items-center justify-center">
              <p className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4 md:mb-8">
                Live Preview
              </p>

              {/* Phone Mockup */}
              <div className="w-full max-w-[240px] md:max-w-[280px] bg-white rounded-[24px] md:rounded-[32px] shadow-xl border-[4px] md:border-[6px] border-slate-800 p-2 md:p-3 relative mb-6 md:mb-0">
                <div className="w-8 md:w-12 h-0.5 md:h-1 bg-slate-800 rounded-full mx-auto mb-2 md:mb-4 opacity-20"></div>

                <div className="w-full bg-white rounded-xl md:rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                  <div className="p-2 md:p-3 flex gap-2 md:gap-3 items-start">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover flex-shrink-0"
                        alt="icon"
                      />
                    ) : (
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-400 flex-shrink-0 text-sm md:text-base">
                        🔔
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <h4 className="text-[11px] md:text-[13px] font-bold text-slate-800 truncate">
                        {formData.title || "Title"}
                      </h4>
                      <p className="text-[9px] md:text-[11px] text-slate-500 line-clamp-2 leading-tight">
                        {formData.message || "Preview text..."}
                      </p>
                    </div>
                  </div>
                  {formData.bannerUrl && (
                    <div className="px-2 md:px-3 pb-2 md:pb-3">
                      <img
                        src={formData.bannerUrl}
                        className="w-full h-16 md:h-24 object-cover rounded-lg md:rounded-xl"
                        alt="banner"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 md:mt-10 text-slate-400 hover:text-slate-600 font-bold text-xs md:text-sm"
              >
                Cancel & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDashboard;