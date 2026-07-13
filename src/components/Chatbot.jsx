import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toggleChatbox, selectChatbox } from "../store/chatboxSlice";
import { firestore } from "../firebaseCon";
import { createUnread } from "../Dashboad/utility";
import { FaWhatsapp } from "react-icons/fa";
export default function Chatbot() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectChatbox);
  const messagesEndRef = useRef(null);

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! Please enter your name." },
  ]);

  const queryOptions = [
    "I want to book a cleaning service",
 
    "I need help with my existing booking",
    "Connect me with an agent",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, step]);

  const chatIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 16 16"
      className="w-7 h-7"
    >
      <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
    </svg>
  );

  const closeIcon = <span className="text-3xl leading-none font-light">×</span>;

  const addMessage = (from, text) => {
    setMessages((prev) => [...prev, { from, text }]);
  };

  const validateName = (value) => {
    return /^[A-Za-z\s]{2,40}$/.test(value.trim());
  };

  const normalizeIndianMobile = (value) => {
    return value.replace(/\s/g, "").replace(/^(\+91|91|0)/, "");
  };

  const validateIndianMobile = (value) => {
    const mobile = normalizeIndianMobile(value);
    return /^[6-9]\d{9}$/.test(mobile);
  };

  const saveTicket = async (queryMessage) => {
    try {
      setIsSaving(true);

      await addDoc(collection(firestore, "homeCleaningTicket"), {
        data: {
          name,
          phone,
          message: queryMessage,
          status: "New",
          createdAt: serverTimestamp(),
        },
      });

      await createUnread("Ticket");

      addMessage(
        "bot",
        "Thank you! Your request has been submitted successfully. We’ll get back to you within 24 hours."
      );

      setStep(4);
      setInputValue("");
    } catch (error) {
      console.error("Ticket save error:", error);
      addMessage(
        "bot",
        "Something went wrong while submitting your request. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleUserInput = async (value) => {
    const trimmedValue = value.trim();

    if (!trimmedValue || isSaving) return;

    addMessage("user", trimmedValue);

    if (step === 1) {
      if (!validateName(trimmedValue)) {
        addMessage("bot", "Please enter a valid name using only letters.");
        return;
      }

      setName(trimmedValue);
      addMessage("bot", "Please enter your Indian mobile number.");
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!validateIndianMobile(trimmedValue)) {
        addMessage(
          "bot",
          "Please enter a valid Indian mobile number. Example: 9876543210"
        );
        return;
      }

      const cleanMobile = normalizeIndianMobile(trimmedValue);

      setPhone(cleanMobile);
      addMessage(
        "bot",
        "Please select a suggestion below or type your own query."
      );
      setStep(3);
      return;
    }

    if (step === 3) {
      if (trimmedValue.length < 5) {
        addMessage("bot", "Please write a little more about your query.");
        return;
      }

      await saveTicket(trimmedValue);
    }
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      handleUserInput(inputValue);
      setInputValue("");
    }
  };

  const handleQueryClick = (query) => {
    handleUserInput(query);
  };

  return (
    <>
      {/* Floating Chat Button */}
      


<div className="fixed bottom-6 right-6 z-50 flex flex-row items-center gap-4">
  {/* WhatsApp Floating Button */}
  <a
  href={`https://wa.me/917015953419?text=${encodeURIComponent(
    `Hello Urban Aura Services,

I would like to know more about your services and discuss my requirements. Please let me know how we can proceed.

Thank you.`
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  className="w-15 h-15 rounded-full bg-green-500 hover:bg-green-600 shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
>
  <FaWhatsapp size={34} className="text-white" />
</a>

  {/* Chatbot Floating Button */}
  <div
    className="w-15 h-15 bg-slate-950 hover:bg-blue-950 text-white rounded-full shadow-2xl cursor-pointer transition-all duration-300 hover:scale-110 flex items-center justify-center"
    onClick={() => dispatch(toggleChatbox())}
  >
    {isOpen ? closeIcon : chatIcon}
  </div>
</div>
      {/* Chat Box */}
      <div
        className={`fixed bottom-34 right-6 w-96 h-100 max-w-[90vw] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-40 border border-gray-200 transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold leading-tight">
              Chatbot Support
            </h3>
            <p className="text-xs text-gray-300 mt-0.5">
              We usually reply within 24 hours
            </p>
          </div>

          <button
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            onClick={() => dispatch(toggleChatbox())}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div className="p-4 flex-grow h-96 overflow-y-auto bg-slate-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 flex ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`py-2.5 px-4 rounded-2xl max-w-[82%] text-sm leading-relaxed shadow-sm ${
                  msg.from === "bot"
                    ? "bg-white text-gray-800 rounded-bl-md border border-gray-100"
                    : "bg-slate-950 text-white rounded-br-md"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {step === 3 && (
            <div className="mt-3 space-y-2">
              {queryOptions.map((query, index) => (
                <button
                  key={index}
                  disabled={isSaving}
                  onClick={() => handleQueryClick(query)}
                  className="w-full text-left px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm hover:bg-slate-100 hover:border-slate-400 transition disabled:opacity-60"
                >
                  {query}
                </button>
              ))}
            </div>
          )}

          {isSaving && (
            <div className="mt-3 text-xs text-gray-500">
              Submitting your request...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {step !== 4 && (
          <div className="flex p-4 border-t border-gray-200 bg-white">
            <input
              type={step === 2 ? "tel" : "text"}
              className="flex-1 p-2.5 border border-gray-300 rounded-xl outline-none text-sm focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
              placeholder={
                step === 1
                  ? "Enter your name..."
                  : step === 2
                  ? "Enter mobile number..."
                  : "Type your query..."
              }
              value={inputValue}
              maxLength={step === 2 ? 14 : step === 1 ? 40 : 200}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isSaving}
            />

            <button
              className="px-4 py-2.5 bg-slate-950 text-white rounded-xl ml-2 cursor-pointer hover:bg-blue-950 transition-colors duration-200 disabled:opacity-60"
              onClick={handleSend}
              disabled={isSaving}
            >
              Send
            </button>
          </div>
        )}
      </div>
    </>
  );
}