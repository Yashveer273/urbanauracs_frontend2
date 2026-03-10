import React, { useState, useMemo, useEffect } from "react";
import { Notificationsend, FetchAllUsers } from "../API";

const NotificationDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",    // Primary Image
    bannerUrl: "",   // Secondary Image (New)
    message: "",
    type: "broadcast", 
    selectedUser: null
  });

  const loadUsers = async () => {
    setDataLoading(true);
    const result = await FetchAllUsers();
    if (result.success) setUsers(result.users);
    setDataLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.phone?.includes(searchTerm) || user.userId?.includes(searchTerm)
    );
  }, [searchTerm, users]);

  // --- TRIGGER LOGIC ---
  const openModal = (type, user = null) => {
    setFormData({
      title: type.includes("incomplete") ? "Verify your phone number 📱" : "",
      imageUrl: "",
      bannerUrl: "", // Reset second image
      message: type.includes("incomplete") ? "Please update your phone number to continue." : "",
      type: type,
      selectedUser: user
    });
    setIsModalOpen(true);
  };

  const handleFireNotification = async () => {
    if (!formData.title || !formData.message) return alert("Please fill Title and Message");

    setLoading(true);
    const payload = {
      type: formData.type,
      title: formData.title,
      message: formData.message,
      imageUrl: formData.imageUrl,
      bannerUrl: formData.bannerUrl, // Sending the second image field
      ...(formData.selectedUser && { userId: formData.selectedUser.userId })
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
    <div className="w-full min-h-screen bg-gray-50 flex flex-col relative">
      
      {/* HEADER */}
      <div className="sticky top-0 z-10 w-full bg-white border-b shadow-sm p-4 px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-indigo-600 tracking-tight">DASHBOARD</h1>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-bold">
              {users.length} Total Users
            </span>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:w-80">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search phone or ID..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => openModal("incomplete_all")}
              className="whitespace-nowrap bg-amber-500 text-white px-5 py-2 rounded-lg font-bold hover:bg-amber-600 transition-all shadow-md shadow-amber-100"
            >
              ⚠️ Incomplete Users
            </button>

            <button
              onClick={() => openModal("broadcast")}
              className="whitespace-nowrap bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
            >
              📢 Broadcast All
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-grow w-full p-4 lg:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
          {dataLoading ? (
            <div className="flex items-center justify-center h-64 text-gray-400 font-medium">Syncing database...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b">
                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">User Contact</th>
                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Internal User ID</th>
                    <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className={`text-lg font-bold ${!user.phone ? 'text-red-500' : 'text-gray-800'}`}>
                            {user.phone || "MISSING PHONE"}
                          </span>
                          <span className="text-xs text-indigo-400 font-medium uppercase tracking-tighter">Mobile User</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <code className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm font-mono">{user.userId}</code>
                      </td>
                      <td className="px-8 py-5 text-center flex justify-center gap-3">
                        <button
                          onClick={() => openModal("individual", user)}
                          className="bg-white border-2 border-indigo-100 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        >
                          SEND MSG
                        </button>
                        {!user.phone && (
                          <button
                            onClick={() => openModal("incomplete_single", user)}
                            className="bg-white border-2 border-amber-100 text-amber-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                          >
                            INCOMPLETE USER
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* POPUP FORM - UPDATED WITH SECOND IMAGE FIELD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {formData.type.includes('incomplete') ? 'Nudge User' : 'Notification Settings'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 text-3xl">&times;</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 ml-1">Display Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  placeholder="Complete your profile ✨"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 ml-1">Banner Image URL (Second Image)</label>
                <input
                  type="text"
                  value={formData.bannerUrl}
                  onChange={(e) => setFormData({...formData, bannerUrl: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 ml-1">Thumbnail Image URL (FCM Image)</label>
              <input
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                placeholder="https://example.com/icon.jpg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-500 ml-1">Message Content</label>
              <textarea
                rows="4"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-700"
                placeholder="Tell users why they should take action..."
              />
            </div>

            <button
              onClick={handleFireNotification}
              disabled={loading}
              className="w-full bg-[#2563EB] hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>✈️ Fire Notification</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDashboard;