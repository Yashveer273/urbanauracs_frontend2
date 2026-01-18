import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useLocation } from "react-router-dom";
import "./invoice.css";

import { doc, setDoc } from "firebase/firestore";
import { firestore } from "./firebaseCon";
import {
  CalculateConvenienceFee,
  
} from "./components/TexFee";

import SendToVendorPopup from "./components/SendToVendorPopup";
import { normalizeDate, uploadInvoice } from "./Dashboad/utility";
export default function Invoice() {
  const invoiceRef = useRef();
  const location = useLocation();
  const { state } = location;
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [showSendInvoice, setshowSendInvoice] = useState({});
  const [loading, setLoading] = useState(false);

  const cart = state?.product_info?.cart || [];

  const openEditRowCard = async (sale) => {
    try {
      (sale.invoice = invoiceUrl),
        (sale.generatedInvoiceDate_time = Date.now());
       
      const saleRef = doc(firestore, "sales", sale.id);

      await setDoc(saleRef, sale, { merge: true });

      setshowSendInvoice({
        invoice: invoiceUrl,
        generatedInvoiceDate_time: Date.now(),
      });
    } catch (err) {
      console.log("Error updating sale:", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
  const input = invoiceRef.current;
  if (!input) return;

  try {
    setLoading(true);

    const canvas = await html2canvas(input, {
      scale: 1.2,          // 🔽 reduced scale
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    // 🔽 JPEG instead of PNG
    const imgData = canvas.toDataURL("image/jpeg", 0.65);

    const pdf = new jsPDF("p", "mm", "a4", true); // compression ON

    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;
    }

    const pdfBlob = pdf.output("blob");

    // 🔹 Upload directly to Firebase
    const invoiceUrl = await uploadInvoice(pdfBlob, state);
    
    setInvoiceUrl(invoiceUrl);

  } catch (err) {
    console.error("Download failed:", err);
  } finally {
    setLoading(false);
  }
};
  const discountAmount = state.discount;
  const [sendToOpen, setSendToOpen] = useState(false);
  const saveInvoice2 = () => {
    setshowSendInvoice({
      invoice: state.invoice,
      generatedInvoiceDate_time: state.generatedInvoiceDate_time ?? "",
    });
  };
  useEffect(() => {
    saveInvoice2();
  }, []);
  const numberToIndianWords = (num) => {
    if (num === 0) return "zero";

    const a = [
      "",
      "one ",
      "two ",
      "three ",
      "four ",
      "five ",
      "six ",
      "seven ",
      "eight ",
      "nine ",
      "ten ",
      "eleven ",
      "twelve ",
      "thirteen ",
      "fourteen ",
      "fifteen ",
      "sixteen ",
      "seventeen ",
      "eighteen ",
      "nineteen ",
    ];
    const b = [
      "",
      "",
      "twenty",
      "thirty",
      "forty",
      "fifty",
      "sixty",
      "seventy",
      "eighty",
      "ninety",
    ];

    const format = (n, suffix) => {
      if (n === 0) return "";
      let str = n > 19 ? b[Math.floor(n / 10)] + " " + a[n % 10] : a[n];
      return str + suffix;
    };

    let res = "";
    res += format(Math.floor(num / 10000000), "crore ");
    res += format(Math.floor((num / 100000) % 100), "lakh ");
    res += format(Math.floor((num / 1000) % 100), "thousand ");
    res += format(Math.floor((num / 100) % 10), "hundred ");

    const lastPart = num % 100;
    if (num > 100 && lastPart > 0) res += "and ";
    res +=
      lastPart > 19
        ? b[Math.floor(lastPart / 10)] + " " + a[lastPart % 10]
        : a[lastPart];

    return res.trim();
  };
  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: "20px" }}>
      <div
        ref={invoiceRef}
        style={{
          width: "800px",
          margin: "0 auto",
          background: "#fff",
          padding: "20px",
          border: "1px solid #000",
        }}
      >
        {/* Company Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px solid #000",
            paddingBottom: "10px",
            marginBottom: "15px",
          }}
        >
          <div
            style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "blue",
              gap: 15,
              fontWeight: "bold",
            }}
          >
            <img src="/logo.png" style={{ height: "50px" }} />
            <h1 style={{ margin: 0 }}>Urban Aura SERVICES PVT. LTD.</h1>
          </div>
        </div>

        {/* Company Address & Contact */}
        <div
          style={{
            marginBottom: "20px",
            textAlign: "left",
            fontSize: "14px",
            lineHeight: "1.6",
          }}
        >
          <p>
            <b>Address:</b> Tauru City, Sohna City, Gurgaon, Haryana, 122105
          </p>
          <p>
            <b>Phone:</b> +91 - 7015953419  | <b>E-mail:</b>
            auraservicesurban@gmail.com  | <b>Website:</b>  www.urbanauracs.com/
          </p>
        </div>

        {/* Header */}

        <div className="h-1 w-full border-t "></div>

        <table className="w-full border-collapse border   text-[15px]   ">
          <tbody>
            <tr className="h-10">
              <td className="border  px-3 py-1 w-1/2">
                <span className="font-medium">
                  Invoice No. :- {state.S_orderId}
                </span>
              </td>
              <td className="border  px-3 py-1 w-1/2">
                <span className="font-medium">
                  Dated:- {new Date().toLocaleDateString()}
                </span>
              </td>
            </tr>
            <tr className="h-10">
              <td className="border  px-3 py-1 w-1/2">
                <span className="font-medium">
                  Invoice Date:-{new Date().toLocaleDateString()}
                </span>
              </td>
              <td className="border  px-3 py-1 w-1/2">
                <span className="font-medium">Order ID:- {state.orderId}</span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Customer Info */}

        <div className=" px-2 py-1 border-b  mt-2">
          <h2 className="font-bold text-lg">Bill To (Customer Details)</h2>
        </div>

        <div className="border   text-[15px] leading-relaxed ">
          <div className="p-2 space-y-1">
            <div>
              <span className="font-medium">
                Customer Name / Company Name:-
              </span>{" "}
              {state.name}
            </div>
            <div>
              <span className="font-medium">Address:-</span>{" "}
              {`${state.user_location} | Pin Code:- ${state.pincode}`}
            </div>
            <div>
              <span className="font-medium ">Phone:</span> {state.phone_number}{" "}
              |<span className="font-medium"> GSTIN (if applicable):</span>{" "}
              XXXXXXXX
            </div>
          </div>
        </div>

        {/* Services Table */}
        {/* <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th className="table-cell-wrap">Service Id</th>
              <th className="table-cell-wrap">Description</th>
              <th className="table-cell-wrap">Booking Date</th>
              <th className="table-cell-wrap">Booking Add.</th>
              <th className="table-cell-wrap">Quantity</th>{" "}
              <th className="table-cell-wrap">Service Charge</th>
              <th className="table-cell-wrap">Conven. Fee</th>
              <th className="table-cell-wrap">Total Charge</th>
            </tr>
          </thead>

          <tbody>
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <tr
                  key={index}
                  style={{ cursor: "pointer" }} // 👈 makes the row clickable
                  onClick={() => console.log("Clicked:", item)} // optional
                >
                  <td className="table-cell-wrap">
                    {item.product_purchase_id}
                  </td>
                  <td className="table-cell-wrap">
                    {item.product_name} <br />
                    <small>{item.description}</small>
                  </td>

                  <td className="table-cell-wrap">
                    {item.location_booking_time}
                  </td>
                  <td className="table-cell-wrap">
                    {item.bookingAddress ?? "non"}
                  </td>
                  <td className="table-cell-wrap">{item.quantity}</td>
                  <td className="table-cell-wrap">₹{item.item_price}</td>
                  <td className="table-cell-wrap">
                    ₹
                    {
                      CalculateConvenienceFee(item.item_price * item.quantity)
                        .convenienceFee
                    }
                  </td>

                  <td className="table-cell-wrap">
                    ₹
                    {CalculateConveniencetotalFee(
                      item.item_price * item.quantity
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table> */}
        <div className="w-full  text-[14px] mt-3">
          <h2 className="font-bold text-base mb-1">Service Details</h2>

          <div className="border-t border-l  grid grid-cols-[50px_1fr_120px_100px_120px_100px]">
            {/* Header Row */}
            {[
              "S. No.",
              "Description of Service",
              "Duration",
              "Qty / Hours",
              "Date/Time Slot",
              "Amount (₹)",
            ].map((header) => (
              <div
                key={header}
                className="border-r border-b  p-2 font-bold  flex items-center"
              >
                {header}
              </div>
            ))}

            {cart.length > 0 ? (
              cart.map((item, index) => (
                <React.Fragment key={index}>
                  {/* S. No. */}
                  <div className="border-r border-b  p-2 text-center">
                    {index + 1}
                  </div>

                  {/* Description */}
                  <div className="border-r border-b  p-2">
                    {item.product_name} <br />
                    <small>{item.description}</small>
                  </div>

                  {/* HSN/SAC Code */}
                  <div className="border-r border-b  p-2">
                    {item.duration}
                  </div>

                  {/* Qty / Hours */}
                  <div className="border-r border-b  p-2 text-center">
                    {item.quantity}
                  </div>

                  {/* Date/Time Slot */}
                  <div className="border-r border-b  p-2">
                   
                    {item.location_booking_time}
                  </div>

                  {/* Amount */}
                  <div className="border-r border-b  p-2 text-right">
                    ₹{parseFloat(item.item_price * item.quantity)}
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div className="col-span-6 border-r border-b  p-4 text-center text-gray-500 italic">
                No services added to cart.
              </div>
            )}
          </div>
        </div>
  {/* Tax Summary */}
      <div className="max-w-5xl mx-auto  text-[14px] mt-3 ">

         <h2 className="font-bold text-base mb-1 ">  Tax Summary</h2>
  <div className="grid grid-cols-[1fr_250px] border-t border-l ">
    
   
    <div className="grid grid-cols-[2fr_1fr_1.5fr]">
      {/* Header */}
      <div className="border-r border-b  p-1 font-bold">Order Details</div>
      <div className="border-r border-b  p-1 font-bold text-center">Area/Rate</div>
      <div className="border-r border-b  p-1 font-bold text-right">Amount (₹)</div>

      {/* Order Amount */}
      <div className="border-r border-b  p-1">Order Amount:-</div>
      <div className="border-r border-b  p-1"></div>
      <div className="border-r border-b  p-1 text-right">
        {cart?.reduce((sum, item) => sum + Number(item.item_price * item.quantity), 0)}
      </div>

      {/* Convenience Fee */}
      <div className="border-r border-b  p-1">Convenience Fee:-</div>
      <div className="border-r border-b  p-1"></div>
      <div className="border-r border-b  p-1 text-right">
        {cart?.reduce((sum, item) => sum + Number(CalculateConvenienceFee(item.item_price * item.quantity).convenienceFee), 0)}
      </div>

      {/* NEW: Discount Amount Row */}
      <div className="border-r border-b  p-1">Discount Amount:-</div>
      <div className="border-r border-b  p-1"></div>
      <div className="border-r border-b  p-1 text-right ">
        - ₹{Number(discountAmount || 0).toLocaleString()}
      </div>

      {/* Total */}
      <div className="border-r border-b  p-1 font-bold">Total:-</div>
      <div className="border-r border-b  p-1"></div>
      <div className="border-r border-b  p-1 text-right font-bold">
        ₹ {Math.round(
          cart?.reduce((sum, item) => sum + Number(item.item_price * item.quantity + CalculateConvenienceFee(item.item_price * item.quantity).convenienceFee), 0) - Number(discountAmount || 0)
        ).toLocaleString()}
      </div>
    </div>

    {/* Signature Area with Image */}
    <div className="border-r border-b  flex items-center justify-center p-2">
      <img src="/stamp.png" alt="Stamp" className="w-32 h-auto" />
   
    </div>
  </div>

  {/* Amount in Words */}
  <div className="border-l border-r border-b  p-2  text-[13px]">
    (Amount in words: Rupees{" "}
    <span className="capitalize">
      {numberToIndianWords(
        Math.round(
          cart?.reduce((sum, item) => sum + Number(item.item_price * item.quantity + CalculateConvenienceFee(item.item_price * item.quantity).convenienceFee), 0) - Number(discountAmount || 0)
        )
      )}
    </span>{" "}
    Only)
  </div>
</div>

        {/* Bank Details */}
      <div className="max-w-5xl mx-auto text-[14px]">
      
      {/* 1. COMPANY & BANK DETAILS SECTION */}
      <div className="grid grid-cols-2 border-t border-l ">
        {/* Company Details Column */}
        <div className="border-r border-b  p-3">
          <h3 className="font-bold  mb-2 text-base">Company Details</h3>
          <div className="space-y-1">
            <p><span className="font-bold">Name:</span> Urban Aura Services Private Limited</p>
            <p><span className="font-bold">CIN:</span> U81210HR2025PTC136650</p>
            <p><span className="font-bold">GSTIN:</span> 06AADCU9498E1ZV</p>
            <p><span className="font-bold">PAN:</span> AADCU9498E</p>
          </div>
        </div>

        {/* Bank Details Column */}
        <div className="border-r border-b  p-3">
          <h3 className="font-bold underline mb-2 text-base">Bank Details</h3>
          <div className="space-y-1">
            <p><span className="font-bold">Bank Name:</span> HDFC Bank</p>
            <p><span className="font-bold">AC Holder:</span> Urban Aura Services Pvt. Ltd.</p>
            <p><span className="font-bold">Account No.:</span> 50200116397557</p>
            <p><span className="font-bold">IFSC Code:</span> HDFC0005460</p>
            <p><span className="font-bold">Branch Code:</span> 5460</p>
          </div>
        </div>
      </div>

      {/* 2. NOTE SECTION */}
      <div className="border-l border-r border-b  p-3">
        <p className="font-bold underline mb-1">Note:-</p>
        <ol className="list-none space-y-0.5">
          <li>1. This is a computer-generated Invoice and does not require a physical signature.</li>
          <li>2. No refund will be entertained once the service has been completed.</li>
        </ol>
      </div>

      {/* 3. THANK YOU MESSAGE */}
      {/* <div className="border-l border-r border-b border-black p-3 text-center font-bold">
        Thank you for letting us brighten your space. We look forward to serve you again – Team Urban Aura Services!
      </div> */}

    </div>
      </div>

      <SendToVendorPopup
  open={sendToOpen}
  onClose={() => setSendToOpen(false)}
  userNumber={state.phone_number || ""}
  msg={`Hi from urbanauracs.com this is your invoice generated on ${
    showSendInvoice?.generatedInvoiceDate_time 
      ? normalizeDate(showSendInvoice.generatedInvoiceDate_time) 
      : "N/A"
  } ${state.invoice || ""}`}
/>

      <div className="flex justify-center gap-2 mt-4">
        <button
          onClick={downloadPDF}
          disabled={loading}
          style={{
            padding: "10px 20px",
            background: loading ? "#90caf9" : "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Generating..." : "Download PDF"}
        </button>

        {invoiceUrl && (
          <button
            onClick={() => {
              openEditRowCard(state);
              alert("invoce updated");
            }}
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: loading ? "#7ae59b" : "#19d247ff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        )}

        {state.invoice || showSendInvoice.invoice ? (
          <button
            className="center"
            onClick={() => setSendToOpen(true)}
            style={{
              padding: "10px 20px",
              background: "#d2bd19ff",
              color: "#000000ff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              alignItems: "center",
            }}
          >
            Send
          </button>
        ) : null}
      </div>
    </div>
  );
}
