import React, { useState } from "react";
import UserList from "./UserList";
import ChatWindow from "./ChatWindow";

const AdminDashboard = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-slate-100 flex">
      
      {/* Sidebar */}
      <div className="w-1/4 min-w-[280px] bg-white border-r border-gray-200 shadow-lg">
        <UserList onSelectUser={setSelectedUser} />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatWindow selectedUser={selectedUser} isAdmin={true} />
      </div>

    </div>
  );
};

export default AdminDashboard;