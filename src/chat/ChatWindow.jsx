import React, { useEffect, useState, useRef } from "react";
import { collection, query, orderBy, onSnapshot, doc } from "firebase/firestore";
import { firestore } from "../firebaseCon";
import { deleteMessageByAdmin, markSeenByAdmin } from "./adminChatController";
import MediaMessage from "./mediamessages";
import { FiTrash2 } from "react-icons/fi";
import MessageInput from "./MessageInput";
import { MessageCircle } from "lucide-react";

const ADMIN_ID = "admin_1";

const ChatWindow = ({ selectedUser, currentUser, isAdmin }) => {

  const [messages, setMessages] = useState([]);
  const [userTyping, setUserTyping] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);
  const [lastActiveUser, setLastActiveUser] = useState(null);
  const [lastActiveAdmin, setLastActiveAdmin] = useState(null);

  const bottomRef = useRef(null);

  const userId = isAdmin ? selectedUser?.id : currentUser?._id;
  const chatId = userId ? `${userId}_${ADMIN_ID}` : null;

  /* -------------------- Load Messages -------------------- */

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

      if (isAdmin) {
        markSeenByAdmin(chatId).catch(console.error);
      }

    });

    return () => unsub();

  }, [chatId]);

  /* -------------------- Typing Listener -------------------- */

  useEffect(() => {

    if (!chatId) return;

    const chatRef = doc(firestore, "chats", chatId);

    const unsub = onSnapshot(chatRef, (snapshot) => {

      if (!snapshot.exists()) return;

      const data = snapshot.data();

      setUserTyping(data?.typing?.user || false);
      setAdminTyping(data?.typing?.admin || false);

      setLastActiveUser(data?.lastActive?.user || null);
      setLastActiveAdmin(data?.lastActive?.admin || null);

    });

    return () => unsub();

  }, [chatId]);

  /* -------------------- Auto Scroll -------------------- */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* -------------------- Time Format -------------------- */

  const formatTime = (ts) => {

    if (!ts || !ts.toMillis) return "";

    const diff = Math.floor((Date.now() - ts.toMillis()) / 1000);

    if (diff < 60) return "Active now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

    return `${Math.floor(diff / 86400)}d ago`;
  };

  /* -------------------- Empty State -------------------- */

  if (!selectedUser && isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-center px-6">

        <div className="text-6xl mb-4"><MessageCircle/></div>

        <h2 className="text-xl font-semibold text-gray-700">
          No Conversation Selected
        </h2>

        <p className="text-gray-500 mt-2 max-w-sm">
          Select a user from the right panel to start chatting.
        </p>

      </div>
    );
  }

  /* -------------------- Status Text -------------------- */

  const statusText = () => {

    if (isAdmin) {

      if (userTyping) return "User is typing...";
      if (lastActiveUser) return `Last active ${formatTime(lastActiveUser)}`;

      return "Offline";

    } else {

      if (adminTyping) return "Admin is typing...";
      if (lastActiveAdmin) return `Last active ${formatTime(lastActiveAdmin)}`;

      return "Offline";

    }

  };

  return (
    <div className="flex flex-col h-full">

      {/* Header */}

      <div className="flex items-center gap-3 px-6 py-4 border-b bg-white">

        <div className="w-10 h-10 rounded-full bg-[#f87559] text-white flex items-center justify-center font-semibold">
          {selectedUser?.username?.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="font-semibold text-gray-800">
            {selectedUser?.username}
          </p>

          <p className="text-xs text-green-500">
            {statusText()}
          </p>
        </div>

      </div>

      {/* Messages */}

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 bg-gray-50 space-y-3">

        {messages.map((msg) => {

          const isAdminMsg = msg.senderRole === "admin";

          return (

            <div
              key={msg.id}
              className={`flex ${isAdminMsg ? "justify-end" : "justify-start"}`}
            >

              <div
                className={`relative group max-w-[80%] md:max-w-[420px] px-4 py-2 rounded-xl text-sm shadow-sm
                ${isAdminMsg
                    ? "bg-[#f87559] text-white"
                    : "bg-white text-gray-800"
                  }`}
              >

                <MediaMessage
                  text={msg.text}
                  senderRole={msg.senderRole}
                />

                <div className="text-xs mt-1 opacity-70 text-right">
                  {msg.seen ? "✓✓" : "✓"}
                </div>

                {isAdminMsg && (
                  <button
                    onClick={() => deleteMessageByAdmin(chatId, msg.id)}
                    className="absolute -top-2 -right-2 bg-white text-red-500 p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
                  >
                    <FiTrash2 size={14} />
                  </button>
                )}

              </div>

            </div>

          );

        })}

        <div ref={bottomRef}></div>

      </div>

      {/* Input */}

      <div className="border-t bg-white p-4">
        <MessageInput
          chatId={chatId}
          currentUser={currentUser}
          isAdmin={isAdmin}
        />
      </div>

    </div>
  );
};

export default ChatWindow;