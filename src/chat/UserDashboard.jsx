import React, { useState } from "react";
import UserSidebar from "./UserSidebar";
import ChatWindow from "./ChatWindow";



const UserDashboard = ({ currentUser }) => {
  const [selectedChat, setSelectedChat] = useState("company");

  if (!currentUser) {
    return <h2>Please Login First</h2>;
  }

  return (
    <div className="dashboard">
      <UserSidebar
        currentUser={currentUser}
        onSelectChat={setSelectedChat}
      />

      <ChatWindow
        selectedUser={selectedChat}
        currentUser={currentUser}
        isAdmin={false}
      />
    </div>
  );
};

export default UserDashboard;