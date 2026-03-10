import React, { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, onSnapshot, doc } from "firebase/firestore";
import { firestore } from "../firebaseCon";
import { deleteMessageByAdmin, markSeenByAdmin } from "./adminChatController";
import MediaMessage from "./mediamessages";
import { FiTrash2 } from "react-icons/fi";
import MessageInput from "./MessageInput";

const ADMIN_ID = "admin_1";

const ChatWindow = ({ selectedUser, currentUser, isAdmin }) => {
  const [messages, setMessages] = useState([]);
  const [userTyping, setUserTyping] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const [lastActiveUser, setLastActiveUser] = useState(null);
  const [lastActiveAdmin, setLastActiveAdmin] = useState(null);
  const bottomRef = useRef(null);

  // determine the participant ID; admin sends to selectedUser.id,
  // regular user sends using their own _id
  const userId = isAdmin ? selectedUser?.id : currentUser?._id;
  const chatId = userId ? `${userId}_${ADMIN_ID}` : null;

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(firestore, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(docs);

      // mark as seen depending on who is viewing
  
        markSeenByAdmin(chatId).catch((e) => console.error(e));
      
    });

    return () => unsub();
  }, [chatId]);

  // watch typing status in the chat document
  useEffect(() => {
    if (!chatId) return;

    const chatRef = doc(firestore, "chats", chatId);
    const unsubTyping = onSnapshot(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUserTyping(data?.typing?.user || false);
        setAdminTyping(data?.typing?.admin || false);
        setLastActiveUser(data?.lastActive?.user || null);
        setLastActiveAdmin(data?.lastActive?.admin || null);
      }
    });

    return () => unsubTyping();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedUser && isAdmin)
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-lg">
        Select a conversation
      </div>
    );

  if (!currentUser && !isAdmin)
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-lg">
        Please login
      </div>
    );

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-white border-b border-gray-200 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
          {isAdmin
            ? selectedUser?.username?.charAt(0).toUpperCase()
            : "C"}
        </div>
        <div>
          <h2 className="font-semibold text-gray-800">
            {isAdmin ? selectedUser?.username : "Company Support"}
          </h2>
          <p className="text-xs text-green-500">
            {(() => {
              const isRecent = (ts, seconds = 60) => {
                if (!ts || !ts.toMillis) return false;
                return (Date.now() - ts.toMillis()) / 1000 < seconds;
              };

              const fmt = (ts) => {
                if (!ts || !ts.toMillis) return "";
                const diff = Math.floor((Date.now() - ts.toMillis()) / 1000);
                if (diff < 60) return "a few seconds ago";
                if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
                if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
                return `${Math.floor(diff / 86400)}d ago`;
              };

              if (isAdmin) {
                if (userTyping) return "User is typing...";
                if (isRecent(lastActiveUser)) return "Active now";
                return lastActiveUser ? `Last seen ${fmt(lastActiveUser)}` : "Inactive";
              } else {
                if (adminTyping) return "Admin is typing...";
                if (isRecent(lastActiveAdmin)) return "Active now";
                return lastActiveAdmin ? `Last seen ${fmt(lastActiveAdmin)}` : "Inactive";
              }
            })()}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-100">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex transition-all duration-300 ${
              msg.senderRole === "admin"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`relative group max-w-md px-4 py-2 rounded-2xl shadow-md transform hover:scale-[1.02] transition ${
                msg.senderRole === "admin"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              <MediaMessage text={msg.text} senderRole={msg.senderRole} />

              <div className="text-xs mt-1 opacity-70 text-right">
                {msg.seen ? "✓✓" : "✓"}
              </div>

              {msg.senderRole === "admin" && (
                <button
                  onClick={() => deleteMessageByAdmin(chatId, msg.id)}
                  className="absolute -top-2 -right-2 bg-white text-red-500 p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
                >
                  <FiTrash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <MessageInput
        chatId={chatId}
        currentUser={currentUser}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default ChatWindow;