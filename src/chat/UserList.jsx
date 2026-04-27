import React, { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestore } from "../firebaseCon";
import { FiSearch, FiUsers } from "react-icons/fi";

const UserList = ({ onSelectUser, selectedUser }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const unsubscribersRef = useRef([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(firestore, "User"), (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // Clean previous listeners
    unsubscribersRef.current.forEach((unsub) => unsub());
    unsubscribersRef.current = [];

    users.forEach((user) => {
      const chatId = `${user.id}_admin_1`;
      const messagesRef = collection(firestore, "chats", chatId, "messages");
      const q = query(
        messagesRef,
        where("senderRole", "==", "user"),
        where("seen", "==", false)
      );

      const unsub = onSnapshot(q, (snapshot) => {
        setUnreadCounts((prev) => ({ ...prev, [user.id]: snapshot.size }));
      });

      unsubscribersRef.current.push(unsub);
    });

    return () => {
      unsubscribersRef.current.forEach((unsub) => unsub());
      unsubscribersRef.current = [];
    };
  }, [users]);

  const filtered = users.filter((user) =>
    user.username?.toLowerCase().includes(search.toLowerCase())
  );

  const sortedFiltered = [...filtered].sort(
    (a, b) => (unreadCounts[b.id] || 0) - (unreadCounts[a.id] || 0)
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <FiUsers className="text-indigo-600 text-xl" />
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Messages</h2>
        </div>
        
        {/* Search Input */}
        <div className="relative group">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto py-2">
        {sortedFiltered.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-200 
              ${selectedUser?.id === user.id 
                ? "bg-indigo-50 border-r-4 border-indigo-600" 
                : "hover:bg-gray-50 border-r-4 border-transparent"}`}
          >
            {/* Professional Avatar */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-sm">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <p className="font-semibold text-gray-900 truncate">{user.username}</p>
                {unreadCounts[user.id] > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {unreadCounts[user.id]}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;