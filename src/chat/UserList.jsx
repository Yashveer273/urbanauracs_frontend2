import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebaseCon";
import { FiSearch } from "react-icons/fi";

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(
      collection(firestore, "User"),
      (snapshot) => {
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      }
    );
    return () => unsub();
  }, []);

  const filtered = users.filter((user) =>
    user.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="p-5 border-b bg-[#f87559] border-gray-200 text-white">
        <h2 className="text-xl font-semibold">Admin Chats</h2>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500 transition">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search users..."
            className="bg-transparent outline-none w-full text-sm"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user)}
            className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-indigo-50 transition duration-200 border-b border-gray-100"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
              {user.username?.charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div>
              <p className="font-medium text-gray-800">
                {user.username}
              </p>
              <p className="text-xs text-gray-500">
                {user.email}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;