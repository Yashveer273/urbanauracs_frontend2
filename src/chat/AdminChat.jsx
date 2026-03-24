import React, { useState } from "react";
import UserList from "./UserList";
import ChatWindow from "./ChatWindow";

const AdminChat = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex h-[97vh] w-full bg-[#f3f4f6]">
      {/* Sidebar: User List */}
      <div className="w-[350px] flex-shrink-0 border-r border-gray-200 bg-white">
        <UserList
          onSelectUser={setSelectedUser}
          selectedUser={selectedUser}
        />
      </div>

      {/* Main Content: Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        <ChatWindow selectedUser={selectedUser} isAdmin={true} />
      </div>
    </div>
  );
};

export default AdminChat;