import React, { useState, useEffect } from "react";
import { GetVenderData } from "../Dashboad/GetVenderData";

const SendToVendorPopup = ({ 
  open,                
  onClose,             
  userNumber = "",     
  msg = ""             
}) => {
  const [vendorMobile, setVendorMobile] = useState("");
  const [userMobile, setUserMobile] = useState(userNumber);
  const [activeTarget, setActiveTarget] = useState("user");

  // Sync userMobile if userNumber prop changes
  useEffect(() => {
    setUserMobile(userNumber || "");
  }, [userNumber]);

  if (!open) return null;

  /* ---------------- LOGIC: VENDOR SELECTION ---------------- */
  const passVender = (selectedVendor) => {
    if (selectedVendor && selectedVendor.vendorPhoneNo) {
      setVendorMobile(selectedVendor.vendorPhoneNo);
      setUserMobile(""); // Clear user field to focus on vendor
      setActiveTarget("vendor");
    }
  };

  /* ---------------- LOGIC: RESET TO CUSTOMER ---------------- */
  const resetToCustomer = () => {
    setVendorMobile("");
    setUserMobile(userNumber || ""); // Re-select the original user number
    setActiveTarget("user");
  };

  const handleClose = () => {
    resetToCustomer();
    onClose();
  };

  /* ---------------- ACTION: OPEN WHATSAPP ---------------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const targetNumber = (activeTarget === "vendor" ? vendorMobile : userMobile) || "";

    if (!targetNumber || targetNumber.trim() === "") {
      alert("Please provide a valid mobile number.");
      return;
    }

    const cleanNumber = targetNumber.toString().replace(/\D/g, "");
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;

    // Reuses the "WhatsAppPortal" tab
    window.open(url, "WhatsAppPortal");
    handleClose();
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] flex items-end justify-end p-6">
      <div className="pointer-events-auto bg-white rounded-2xl w-[360px] p-5 shadow-2xl border border-gray-100 transition-all">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-bold text-gray-800">Send WhatsApp</h2>
          <button 
            onClick={handleClose} 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Vendor Search & Reset Button */}
        <div className="mb-4 flex flex-col gap-2">
          <GetVenderData passVender={passVender} />
          
          <button 
            type="button"
            onClick={resetToCustomer}
            className="w-full py-1.5 border border-blue-200 text-blue-600 rounded-lg text-[11px] font-semibold hover:bg-blue-50 transition-colors"
          >
            ↺ Re-select Customer Number
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Active Number Input */}
          <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 block">
              Sending to: {activeTarget === "vendor" ? "Vendor" : "Customer"}
            </label>
            <input
              type="text"
              value={activeTarget === "user" ? userMobile : vendorMobile}
              onChange={(e) => {
                if (activeTarget === "vendor") setVendorMobile(e.target.value);
                else setUserMobile(e.target.value);
              }}
              placeholder="Enter phone number"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
            />
          </div>

          {/* Message Preview (Removed Italics) */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
             <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Preview</span>
             <p className="text-[12px] text-gray-600 leading-snug">
               {msg ? `"${msg}"` : "No message provided."}
             </p>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#1ebe57] transition-all shadow-lg flex items-center justify-center gap-2"
          >
            Open WhatsApp Tab
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendToVendorPopup;