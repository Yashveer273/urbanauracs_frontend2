import React, { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toggleChatbox, selectChatbox } from "../store/chatboxSlice";
import { firestore } from "../firebaseCon";

export default function Chatbot() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectChatbox); // ✅ from Redux

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! Please enter your Name." },
  ]);
  const [inputValue, setInputValue] = useState("");

  const chatIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 16"
      className="w-8 h-8"
    >
      <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
    </svg>
  );

  const closeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 16"
      className="w-8 h-8"
    >
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
    </svg>
  );

  const handleUserInput = async (value) => {
    let newMessages = [...messages, { from: "user", text: value }];

    if (step === 1) {
      setName(value.trim());
      if (value.trim() !== "") {
        newMessages.push({ from: "bot", text: "Now enter your 10-digit Phone Number." });
        setStep(2);
      } else {
        newMessages.push({ from: "bot", text: "❌ Name cannot be empty." });
      }
    } else if (step === 2) {
      setPhone(value.trim());
      const isPhoneValid = value.replace(/\D/g, "").length === 10;
      if (isPhoneValid) {
        newMessages.push({
          from: "bot",
          text: "Please let us know your query",
        });
        setStep(3);
      } else {
        newMessages.push({
          from: "bot",
          text: "📞 Phone must be exactly 10 digits.",
        });
      }
    } else if (step === 3) {
      setStep(4);

      // Save to Firestore
      await addDoc(collection(firestore, "homeCleaningTicket"), {
        data: {
          name,
          phone,
          message: value.trim(),
          status: "New",
          createdAt: serverTimestamp(),
        },
      });

      newMessages.push({ from: "bot", text: "✅ We'll get back to you within 24 hours." });
    }

    setMessages(newMessages);
  };

  const handleSend = () => {
    if (inputValue.trim() !== "") {
      handleUserInput(inputValue.trim());
      setInputValue("");
    }
  };

  return (
    <>
      {/* Chat button */}
      <div
        className="fixed bottom-15 right-6 z-50 p-4 bg-teal-500 text-white rounded-full shadow-lg cursor-pointer transition-transform duration-300 hover:scale-110"
        onClick={() => dispatch(toggleChatbox())} // ✅ use Redux toggle
      >
        {isOpen ? closeIcon : chatIcon}
      </div>

      {/* Chatbox */}
      <div
        className={`fixed bottom-24 right-6 w-96 max-w-[90vw] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden z-40 transition-all duration-400 ${
          isOpen ? "flex" : "hidden"
        }`}
      >
        <div className="flex justify-between items-center px-5 py-4 bg-gray-100 border-b border-gray-200">
          <span className="text-lg font-semibold text-gray-800">Chatbot</span>
          <button
            className="text-2xl text-gray-500 hover:text-gray-800"
            onClick={() => dispatch(toggleChatbox())}
          >
            ✖
          </button>
        </div>

        <div className="p-4 flex-grow h-96 overflow-y-auto bg-gray-50">
          {messages.map((msg, index) => (
            <p
              key={index}
              className={`py-2 px-3 mb-2 rounded-lg max-w-[80%] text-sm ${
                msg.from === "bot"
                  ? "bg-gray-200 text-gray-800"
                  : "bg-blue-200 text-blue-800 ml-auto"
              }`}
            >
              {msg.text}
            </p>
          ))}
        </div>

        {step !== 4 && (
          <div className="flex p-4 border-t border-gray-200 bg-white">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg ml-2 cursor-pointer hover:bg-blue-600 transition-colors duration-200"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </>
  );
}
