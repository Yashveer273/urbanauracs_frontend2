import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebaseCon";

const ADMIN_ID = "admin_1";

const UserSidebar = ({ currentUser, onSelectChat }) => {
  const [adminTyping, setAdminTyping] = useState(false);

  useEffect(() => {
    if (!currentUser?._id) return;

    const chatId = `${currentUser._id}_${ADMIN_ID}`;
    const chatRef = doc(firestore, "chats", chatId);

    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAdminTyping(data?.typing?.admin || false);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const openChat = () => {
    onSelectChat("company");
  };

  return (
    <div className="sidebar">
      <div className="user-info">
        <h3>{currentUser.username}</h3>
        <p>{currentUser.mobileNumber}</p>
        <small>{currentUser.location}</small>
      </div>

      <div className="chat-item" onClick={openChat}>
        <strong>Company Support</strong>
        {adminTyping && <p style={{ color: "green" }}>Typing...</p>}
      </div>
    </div>
  );
};

export default UserSidebar;