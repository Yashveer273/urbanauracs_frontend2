import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
} from "firebase/firestore";
import { firestore } from "../firebaseCon";
import { FiSearch, FiUsers } from "react-icons/fi";

const UserList = ({ onSelectUser, selectedUser }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [chatMeta, setChatMeta] = useState({});
  const unsubscribersRef = useRef([]);

  // Load users
  useEffect(() => {
    const unsub = onSnapshot(collection(firestore, "User"), (snapshot) => {
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsub();
  }, []);

  // Listen unread count + chat meta
  useEffect(() => {
    unsubscribersRef.current.forEach((unsub) => unsub());
    unsubscribersRef.current = [];

    users.forEach((user) => {
      const chatId = `${user.id}_admin_1`;

      // Unread listener
      const messagesRef = collection(
        firestore,
        "chats",
        chatId,
        "messages"
      );

      const unreadQuery = query(
        messagesRef,
        where("senderRole", "==", "user"),
        where("seen", "==", false)
      );

      const unreadUnsub = onSnapshot(unreadQuery, (snapshot) => {
        setUnreadCounts((prev) => ({
          ...prev,
          [user.id]: snapshot.size,
        }));
      });

      unsubscribersRef.current.push(unreadUnsub);

      // Chat document listener
      const chatDocRef = doc(firestore, "chats", chatId);

      const chatUnsub = onSnapshot(chatDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();

          setChatMeta((prev) => ({
            ...prev,
            [user.id]: {
              lastMessage: data.lastMessage || "",
              lastMessageTime:
                data.lastMessageTime?.toMillis?.() || 0,
            },
          }));
        }
      });

      unsubscribersRef.current.push(chatUnsub);
    });

    return () => {
      unsubscribersRef.current.forEach((unsub) => unsub());
      unsubscribersRef.current = [];
    };
  }, [users]);

  // Search by Username OR Phone Number
  // Search by Username OR Phone Number (Robust match)
  const filteredUsers = users.filter((user) => {
    const searchTerm = search.trim().toLowerCase();
    if (!searchTerm) return true; // Show all if search is empty

    // 1. Check Username
    const matchesUsername = user.username?.toLowerCase().includes(searchTerm);
    
    // 2. Check Phone Number fields safely (converts numbers to strings)
    const userPhone = user.phone ? String(user.phone) : "";
    const userPhoneNumber = user.phoneNumber ? String(user.phoneNumber) : "";
    const userMobileNumber = user.mobileNumber ? String(user.mobileNumber) : ""; // Added based on your Sidebar structure

    // Strip out non-numeric characters (like spaces, dashes, +) to match clean numbers
    const cleanSearchTerm = searchTerm.replace(/\D/g, ""); 
    
    let matchesPhone = 
      userPhone.toLowerCase().includes(searchTerm) || 
      userPhoneNumber.toLowerCase().includes(searchTerm) ||
      userMobileNumber.toLowerCase().includes(searchTerm);

    // If the admin typed numbers, try matching against digits only
    if (cleanSearchTerm && !matchesPhone) {
      matchesPhone = 
        userPhone.replace(/\D/g, "").includes(cleanSearchTerm) ||
        userPhoneNumber.replace(/\D/g, "").includes(cleanSearchTerm) ||
        userMobileNumber.replace(/\D/g, "").includes(cleanSearchTerm);
    }

    return matchesUsername || matchesPhone;
  });

  // WhatsApp-style sorting
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aUnread = unreadCounts[a.id] || 0;
    const bUnread = unreadCounts[b.id] || 0;

    // Unread first
    if (aUnread > 0 && bUnread === 0) return -1;
    if (bUnread > 0 && aUnread === 0) return 1;

    // Latest message time
    const aTime = chatMeta[a.id]?.lastMessageTime || 0;
    const bTime = chatMeta[b.id]?.lastMessageTime || 0;

    return bTime - aTime;
  });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <FiUsers className="text-indigo-600 text-xl" />
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            Messages
          </h2>
        </div>

        <div className="relative group">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />

          <input
            type="text"
            placeholder="Search name or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all"
          />
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto py-2">
        {sortedUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-200
            ${
              selectedUser?.id === user.id
                ? "bg-indigo-50 border-r-4 border-indigo-600"
                : "hover:bg-gray-50 border-r-4 border-transparent"
            }`}
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-sm">
                {user.username?.charAt(0).toUpperCase()}
              </div>

              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-900 truncate">
                  {user.username}
                </p>

                <div className="flex items-center gap-2">
                  {chatMeta[user.id]?.lastMessageTime > 0 && (
                    <span className="text-[11px] text-gray-400">
                      {new Date(
                        chatMeta[user.id].lastMessageTime
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}

                  {unreadCounts[user.id] > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold min-w-[22px] h-[22px] flex items-center justify-center rounded-full px-2">
                      {unreadCounts[user.id]}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-500 truncate">
                {chatMeta[user.id]?.lastMessage || user.email}
              </p>
            </div>
          </div>
        ))}

        {sortedUsers.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;