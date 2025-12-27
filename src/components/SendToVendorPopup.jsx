import React, { useState } from "react";
import { GetVenderData } from "../Dashboad/GetVenderData";

const SendToVendorPopup = ({ 
  open,                
  onClose,             
  userNumber = "",     
  onSend               
}) => {
  const [Vendor, setVendor] = useState({});
  const [vendorMobile, setVendorMobile] = useState("");

  if (!open) return null;

  const passVender = (selectedVendor) => {
    console.log("Selected Vendor in Invoice:", selectedVendor);
    setVendor(selectedVendor);
    setVendorMobile(selectedVendor.vendorPhoneNo || "");
  };

  // New handler to close popup and reset vendor
  const handleClose = () => {
    setVendor({});
    setVendorMobile("");
    onClose();
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="pointer-events-auto fixed bottom-4 right-4 bg-white rounded-lg w-[380px] p-4 shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold">Send to Vendor</h2>
          <button
            type="button"
            onClick={handleClose} // Reset vendor on close
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Vendor Selector */}
        <GetVenderData passVender={passVender} />

        {/* FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();

            const formData = new FormData(e.currentTarget);
            const user = formData.get("UserMobile");
            const vendor = vendorMobile;

            if (!user && !vendor) {
              alert("Please enter at least one mobile number");
              return;
            }

            const payload = {
              usernumber: user || null,
              vendernumber: vendor || null,
            };

            onSend(payload);

          }}
          className="mt-4 flex flex-col gap-4"
        >
          {/* User Mobile */}
          <input
            type="text"
            name="UserMobile"
            defaultValue={userNumber}
            placeholder="Enter user mobile number"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Vendor Mobile (controlled) */}
          <input
            type="text"
            name="VendorMobile"
            value={vendorMobile}
            onChange={(e) => setVendorMobile(e.target.value)}
            placeholder="Vendor mobile number"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Send Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendToVendorPopup;
