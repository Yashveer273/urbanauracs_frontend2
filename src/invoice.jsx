import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useLocation } from "react-router-dom";
import "./invoice.css"
import { API_BASE_URL } from "./API";
export default function Invoice() {
  const invoiceRef = useRef();
  const location = useLocation();
  const { state } = location;
   const cart = state?.product_info?.cart || [];
  const downloadPDF = async () => {
    const input = invoiceRef.current;
    if (!input) return;

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      const date=Date.now();
       const fileName = `InvoiceS_Order${state.S_orderId}_${date}.pdf`;
      // pdf.save(fileName);
const pdfBlob = pdf.output("blob");
const formData = new FormData();

  formData.append("file", pdfBlob, fileName);
  const response = await fetch(`${API_BASE_URL}/upload-invoice?userId=${state.phone_number}`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  console.log("Uploaded:", result.url);

 
    } catch (err) {
      console.error("Download failed:", err);
    }
  };
 
    const base = Number(state.oGtotal_price) || 0;
  const gst18 = Math.round(base * 0.09);
  const gst25 = Math.round(base * 0.25);
  
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
              alignItems:"center",
              color: "blue",
              gap:15,
              fontWeight: "bold",
            }}
          >
            
            <img src="/logo.jpg" style={{ height: "50px" }} />
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
            <b>Address:</b> Line 1, City - Gurugram, State - Haryana, Pincode -
            122105
          </p>
          <p>
            <b>Phone:</b> +91 - XXXXXXXXXX | <b>E-mail:</b>{" "}
            info@urbanauraservices.com | <b>Website:</b> www.urbanauracs.com/
          </p>
        </div>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h2>Invoice</h2>
            <p>Invoice No: {state.S_orderId}</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div style={{ marginTop: "10px" }}>
          <h3>Bill To:</h3>
          <p style={{height:"35px", overflow:"hidden"}}>
            <b>Customer Name / Company Name: </b>
            {state.name}
          </p>
          <p style={{height:"35px", overflow:"hidden"}}>
            <b>Address: </b>
            {`${state.user_location} | Pin Code:- ${state.pincode}`}
          </p>
          <p style={{height:"35px", overflow:"hidden"}}>
            <b>Phone: </b> {state.phone_number}
          </p>
          <p style={{height:"35px", overflow:"hidden"}}>
            <b>Email: </b> {state.email} 
          </p>
        </div>

        {/* Services Table */}
       <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
      }}
    >
      <thead>
        <tr>
          <th className="table-cell-wrap">Description</th>
          <th className="table-cell-wrap">P.Id</th>
          <th className="table-cell-wrap">Quantity</th>
          <th className="table-cell-wrap">Date</th>
          <th className="table-cell-wrap">Booking Date</th>
          <th className="table-cell-wrap">Booking Add.</th>
          <th className="table-cell-wrap">Duration</th>
          <th className="table-cell-wrap">Item Price</th>
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
                {item.product_name} <br />
                <small>{item.description}</small>
              </td>
              <td className="table-cell-wrap">
                {item.og_product_id}
              </td>
              <td className="table-cell-wrap">1</td>
              <td className="table-cell-wrap">
                {new Date().toLocaleDateString()}
              </td>
              <td className="table-cell-wrap">
                {item.location_booking_time}
              </td>
              <td className="table-cell-wrap">
                {item.bookingAddress??"non"}
              </td>
                <td className="table-cell-wrap">
                {item.duration}
              </td>
              <td className="table-cell-wrap">
                ₹{item.item_price}
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
    </table>

        {/* Totals */}

        {/* Stamp & Sign */}
        <div
          style={{
            border: "2px solid #000",
       
            marginTop: "30px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Left side: Totals */}
          <div
            style={{
              flex: 1,
              textAlign: "left",
              padding: "10px",
            }}
          >
         <p>
          
  <strong>Sub Total:</strong> ₹
{base}
</p>

<p>
  Taxes and Fee (9%): ₹
  {gst18}
</p>

<p>
  Service Charge (25%): ₹
  {gst25}
</p>
 <p>
Discount: ₹
  {base+gst18+gst25-state.payableAmount}
</p>
<h3>
  <strong>Grand Total:</strong> ₹{state.payableAmount}
</h3>

          </div>

          {/* Divider in the center */}
          <div
            style={{
              width: "2px",
              background: "#000",
              height: "100%",
            }}
          ></div>

          {/* Right side: Logo */}
          <div
            style={{
              flex: 1 / 2,
              textAlign: "right",
              padding: "10px",
              marginLeft: "150px",
            }}
          >
            <img src="/logo.jpg" style={{ height: "100px" }} />
          </div>
        </div>

        {/* Bank Details */}
        <div style={{ marginTop: "30px" }}>
          <h3>Bank Details</h3>
          <p>
            <b>Bank:</b>{" "}
            <input
              type="text" className="cursor-pointer"
              defaultValue="Urban Aura Services Pvt. Ltd."
              style={{ width: "60%" }}
            />
          </p>
          <p>
            <b>Account Number:</b>{" "}
            <input type="text" defaultValue="1234567890" className="cursor-pointer"/>
          </p>
          <p>
            <b>Branch:</b> <input type="text" defaultValue="Noida" className="cursor-pointer"/>
          </p>
          <p>
            <b>Account Holder:</b>{" "}
            <input type="text" defaultValue="Urban Aura Pvt Ltd" className="cursor-pointer"/>
          </p>
          <p>
            <b>IFSC Code:</b> <input type="text" defaultValue="HDFC0001234" className="cursor-pointer"/>
          </p>
          <p>
            <b>Branch Code:</b> <input type="text" defaultValue="1234" className="cursor-pointer" />
          </p>
        </div>

        {/* Notes */}
        <div style={{ marginTop: "30px" }}>
          <h4>Notes</h4>
          <p>
            1. This is a computer-generated invoice and does not require a
            physical signature.
          </p>
          <p>
            2. Please make the payment within 15 days of receiving this invoice.
          </p>
          <p>3. For any queries, contact us at.</p>
        </div>

        {/* Thank you */}
        <h3 style={{ textAlign: "center", marginTop: "30px" }}>
          Thank You for letting us brighten your space. We look forward to
          serving you again! - Team Urban Aura Services!
        </h3>
      </div>

      {/* Download Button */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={downloadPDF}
          style={{
            padding: "10px 20px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
