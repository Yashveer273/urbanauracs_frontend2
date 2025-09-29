import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Invoice() {
  const invoiceRef = useRef();

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
      pdf.save("Invoice.pdf");
    } catch (err) {
      console.error("Download failed:", err);
    }
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
              flex: 1,
              textAlign: "center",
              color: "blue",
              fontWeight: "bold",
            }}
          >
            <h1 style={{ margin: 0 }}>URBAN AURA SERVICES PVT. LTD.</h1>
          </div>
          <div
            style={{ position: "absolute", right: "420px", bottom: "420px" }}
          >
            <img src="/logo.jpg" style={{ height: "150px" }} />
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
            <p>Invoice No: UAS/2025/001</p>
            <p>Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div style={{ marginTop: "20px" }}>
          <h3>Bill To:</h3>
          <p>
            <b>Customer Name / Company Name:</b>{" "}
            <input type="text" defaultValue="ABC Enterprises" />
          </p>
          <p>
            <b>Address:</b>{" "}
            <input
              type="text"
              defaultValue="123 Street, City, State, Pincode"
            />
          </p>
          <p>
            <b>Phone:</b> <input type="text" defaultValue="+91-9876543210" />
          </p>
          <p>
            <b>GSTIN:</b> <input type="text" defaultValue="22AAAAA0000A1Z5" />
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
              <th style={{ border: "1px solid #000", padding: "8px" }}>
                Description
              </th>
              <th style={{ border: "1px solid #000", padding: "8px" }}>P.Id</th>
              <th style={{ border: "1px solid #000", padding: "8px" }}>
                Quantity
              </th>
              <th style={{ border: "1px solid #000", padding: "8px" }}>Date</th>
              <th style={{ border: "1px solid #000", padding: "8px" }}>Booking Date</th>
              <th style={{ border: "1px solid #000", padding: "8px" }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                House Cleaning Service
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                998533
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>1</td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                {new Date().toLocaleDateString()}
              </td>
                <td style={{ border: "1px solid #000", padding: "8px" }}>
                {new Date().toLocaleDateString()}
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                ₹2500
              </td>
            </tr>
            <tr>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                Deep Sanitation
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                998533
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>1</td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                {new Date().toLocaleDateString()}
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                {new Date().toLocaleDateString()}
              </td>
              <td style={{ border: "1px solid #000", padding: "8px" }}>
                ₹1500
              </td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}

        {/* Stamp & Sign */}
        <div
          style={{
            border: "2px solid #000",
            height: "120px",
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
            <p>Sub Total: ₹4000</p>
            <p>CGST (9%): ₹360</p>
            <p>SGST (9%): ₹360</p>
            <h3>Grand Total: ₹4720</h3>
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
              type="text"
              defaultValue="Urban Aura Services Pvt. Ltd."
              style={{ width: "60%" }}
            />
          </p>
          <p>
            <b>Account Number:</b>{" "}
            <input type="text" defaultValue="1234567890" />
          </p>
          <p>
            <b>Branch:</b> <input type="text" defaultValue="Noida" />
          </p>
          <p>
            <b>Account Holder:</b>{" "}
            <input type="text" defaultValue="Urban Aura Pvt Ltd" />
          </p>
          <p>
            <b>IFSC Code:</b> <input type="text" defaultValue="HDFC0001234" />
          </p>
          <p>
            <b>Branch Code:</b> <input type="text" defaultValue="1234" />
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
