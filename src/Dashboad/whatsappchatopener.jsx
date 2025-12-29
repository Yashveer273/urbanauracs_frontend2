import React, { useState, useRef } from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppChatBox() {
  const [open, setOpen] = useState(false);
  const [number, setNumber] = useState("");

  const wrapperRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const openWhatsApp = () => {
    if (!number) return alert("Enter WhatsApp number");

    const phone = number.replace(/\D/g, "");
    if (phone.length < 10) return alert("Invalid number");

    window.open(`https://wa.me/${phone}`, "_blank");
  };

  /* ---------------- DRAG LOGIC (WHOLE UNIT) ---------------- */
  const startDrag = (e) => {
    const rect = wrapperRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  const onDrag = (e) => {
    wrapperRef.current.style.left = `${e.clientX - offset.current.x}px`;
    wrapperRef.current.style.top = `${e.clientY - offset.current.y}px`;
    wrapperRef.current.style.right = "auto";
    wrapperRef.current.style.bottom = "auto";
  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  };

  return (
    <div
      ref={wrapperRef}
      onMouseDown={startDrag}
      className="fixed bottom-17 right-6 z-50 cursor-move select-none"
    >
      {/* Chat Window */}
      <div
        className={`
          absolute bottom-16 right-0 w-64 bg-white rounded-xl shadow-2xl
          transform origin-bottom-right
          transition-all duration-300 ease-out
          ${open
            ? "scale-100 opacity-100 translate-x-0 translate-y-0"
            : "scale-0 opacity-0 translate-x-6 translate-y-6 pointer-events-none"}
        `}
      >
        <div className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-t-xl">
          <span className="text-sm font-semibold text-gray-700">
            WhatsApp Chat
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <input
            type="tel"
            placeholder="91XXXXXXXXXX"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md px-2 py-2 mb-3
                       focus:border-green-500 focus:ring-1 focus:ring-green-400 outline-none"
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              openWhatsApp();
            }}
            className="w-full bg-green-600 text-white py-2 rounded-lg text-sm
                       hover:bg-green-700 transition"
          >
            Open WhatsApp
          </button>
        </div>
      </div>

      {/* Floating Button */}
      <button
  onClick={(e) => {
    e.stopPropagation();
    setOpen((p) => !p);
  }}
  className="flex items-center gap-2 bg-green-600 text-white px-4 py-3
             rounded-full shadow-lg hover:bg-green-700 transition"
>
  <FaWhatsapp className="w-5 h-5" />
  <span className="text-sm font-medium">Chat</span>
</button>

    </div>
  );
}
