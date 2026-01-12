import React, { useState, useRef } from "react";

import { MdClose } from "react-icons/md";
import { GetVenderData } from "../Dashboad/GetVenderData";

const WhatsappChatCard = ({ phone: customerPhone, buttonText = "Send WhatsApp Message", data = {} }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sendButtonText, setSendButtonText] = useState("Send");
  const [vendor, setVendor] = useState(null);
  const [activePhone, setActivePhone] = useState(customerPhone);

  const cardRef = useRef(null);

  /* ---------------- TEMPLATES ---------------- */
  const templates = {
    customerConfirmation: (d) => `Your booking has been successfully confirmed.\n\nDetails: ${d.serviceDetails}\nDate/Time: ${d.dateTime}\nAddress: ${d.address}\nBalance Amount: ${d.balanceAmount}\nOTP: ${d.otp}\n\n (Please confirm this OTP with the service partner before the service begins.)\n\nKindly review the service quality, as refunds are not applicable after payment.\nFor any concerns, please reach out us within 24 hours.`.trim(),

    customerReceived: (d) => `Dear ${d.customerName},\n\nYour booking has been successfully received with Urban Aura Services.\n\nOrder Id: ${d.serviceId}\nDetails: ${d.serviceDetails}\nDate/Time: ${d.dateTime}\nAddress: ${d.address}\nOrder Amount: ${d.orderAmount}\nConvenience Fee: ${d.convenienceFee}\n\nOur team will contact you shortly for confirmation.`.trim(),

    vendorAssignment: (d) => `Dear ${d.vendorName},\n\nA new service has been assigned to you:\n\nOrder Id: ${d.serviceId}\nCustomer Name: ${d.customerName}\nDetails: ${d.serviceDetails}\nDate/Time: ${d.dateTime}\nAddress: ${d.address}\nOrder Amount: ${d.orderAmount}\nConvenience Fee: ${d.convenienceFee}\nBalance Amount: ${d.balanceAmount}\nResponsible: ${d.Responsible}\nOTP: ${d.otp}\n\n(Please confirm this OTP with the customer before the service begins.)`.trim(),
  };

  /* ---------------- LOGIC: VENDOR SELECTION ---------------- */
  const passVender = (selectedVendor) => {
    if (selectedVendor) {
      setVendor(selectedVendor);
      setActivePhone(selectedVendor.vendorPhoneNo); // Switch to Vendor Phone
      setSendButtonText("Send Message to Vendor");
      
      const mergedData = { ...data, vendorName: selectedVendor.vendorName };
      setMessage(templates.vendorAssignment(mergedData));
    } else {
      resetToCustomer();
    }
  };

  /* ---------------- LOGIC: CUSTOMER TEMPLATES ---------------- */
  const applyTemplate = (type) => {
    setVendor(null); // Clear vendor selection if choosing customer template
    setActivePhone(customerPhone); // Switch back to Customer Phone
    
    if (type === "customerConfirmation") {
      setSendButtonText("Send Confirmation to Customer");
    } else {
      setSendButtonText("Send Received Message to Customer");
    }

    setMessage(templates[type]({ ...data, vendorName: "" }));
  };

  const resetToCustomer = () => {
    setVendor(null);
    setActivePhone(customerPhone);
    setMessage("");
    setSendButtonText("Send");
  };

  /* ---------------- HANDLERS ---------------- */
  const handleClose = () => {
    setOpen(false);
    resetToCustomer(); // Clears all inputs and resets phone to default
  };

  const sendMessage = () => {
    if (!message || !activePhone) return;
    window.open(
      `https://wa.me/${activePhone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  /* ---------------- DRAG LOGIC ---------------- */
  const drag = useRef({ x: 0, y: 0, active: false });
  const onMouseDown = (e) => {
    drag.current = {
      x: e.clientX - cardRef.current.offsetLeft,
      y: e.clientY - cardRef.current.offsetTop,
      active: true,
    };
  };
  const onMouseMove = (e) => {
    if (!drag.current.active) return;
    cardRef.current.style.left = e.clientX - drag.current.x + "px";
    cardRef.current.style.top = e.clientY - drag.current.y + "px";
  };
  const onMouseUp = () => (drag.current.active = false);

  const templateBtnStyle = (bg) => ({
    background: bg, color: "#fff", border: "none", borderRadius: 10,
    padding: "10px 12px", fontSize: 13, fontWeight: 500, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
  });

  return (
    <>
      <span onClick={() => setOpen(true)} style={{ color: "#2563eb", cursor: "pointer", fontWeight: 500 }}>
        {buttonText}
      </span>

      {open && (
        <div
          ref={cardRef}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          style={{
            position: "fixed", top: 120, right: 40, width: 380,
            background: "#fff", borderRadius: 14, boxShadow: "0 12px 25px rgba(0,0,0,.15)", zIndex: 9999,
          }}
        >
          <div
            onMouseDown={onMouseDown}
            style={{
              background: "#25D366", color: "#fff", padding: "10px 12px",
              borderRadius: "14px 14px 0 0", display: "flex", justifyContent: "space-between", cursor: "move",
            }}
          >
            <div style={{ display: "flex", gap: 8 }}> WhatsApp</div>
            <MdClose size={20} style={{ cursor: "pointer" }} onClick={handleClose} />
          </div>

          <div style={{ padding: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>  <button onClick={() => applyTemplate("customerReceived")} style={templateBtnStyle("#0284c7")}>
               Received
            </button>
            <button onClick={() => applyTemplate("customerConfirmation")} style={templateBtnStyle("#16a34a")}>
               Confirmation
            </button>
          
            <GetVenderData passVender={passVender} />
          </div>

          <div style={{ padding: 12 }}>
            <div style={{ fontSize: 12, marginBottom: 6, color: "#555" }}>
              Sending to: <b>{vendor ? `${vendor.vendorName} (${activePhone})` : `Customer (${activePhone})`}</b>
            </div>

            <textarea
              rows={9}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Select a template or vendor..."
              style={{ width: "100%", borderRadius: 8, border: "1px solid #ddd", padding: 8, fontSize: 13, resize: "none" }}
            />

            <button
              onClick={sendMessage}
              disabled={!message}
              style={{
                marginTop: 10, width: "100%", background: "#25D366", color: "#fff",
                padding: 10, borderRadius: 8, border: "none", display: "flex",
                justifyContent: "center", gap: 6, cursor: "pointer", opacity: message ? 1 : 0.6,
              }}
            >
               {sendButtonText}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsappChatCard;