import React, { useState } from "react";
import { FiSend } from "react-icons/fi";
import { sendAdminMessage, setAdminTyping,  setAdminActive } from "./adminChatController";


const MessageInput = ({ chatId, currentUser, isAdmin }) => {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      
        if (!chatId) return;
        await sendAdminMessage(chatId, message);
        await setAdminTyping(chatId, false);
       
    } catch (err) {
      console.error("Send message error:", err);
    } finally {
      setMessage("");
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200 flex items-center gap-3">
      <input
        type="text"
        value={message}
        placeholder="Type a message..."
        onChange={async (e) => {
          const val = e.target.value;
          setMessage(val);
         
            if (chatId) {
              await setAdminTyping(chatId, val.length > 0);
              if (val.length > 0) await setAdminActive(chatId);
            }
          
        }}
        className="flex-1 rounded-full bg-gray-100 px-5 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />

      <button
        onClick={handleSend}
        className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition transform hover:scale-105 active:scale-95"
        disabled={isAdmin ? !chatId : !(currentUser && currentUser._id)}
      >
        <FiSend size={18} />
      </button>
    </div>
  );
};

export default MessageInput;