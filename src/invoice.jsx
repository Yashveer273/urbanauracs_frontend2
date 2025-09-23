// Invoice.jsx
import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from 'file-saver'; 
const Invoice = () => {
  const today = new Date().toISOString().split("T")[0];
  const invoiceRef = useRef();

  const [invoiceData, setInvoiceData] = useState({
    invoiceNo: "UAS/2025/001",
    invoiceDate: today,
    customerName: "Customer Name / Company Name",
    address: "Address Line, City, State, Pincode",
    phone: "+91-XXXXXXXXXX",
    gstin: "XXXXXXXXXX",
    services: [
      { description: "House Cleaning Service", code: "998533", qty: 1, date: today, amount: 2500 },
      { description: "Deep Sanitation", code: "998533", qty: 1, date: today, amount: 1500 },
    ],
    cgstRate: 9,
    sgstRate: 9,
  });

  const [pdfUrl, setPdfUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const calculateSubTotal = () =>
    invoiceData.services.reduce((sum, item) => sum + Number(item.amount), 0);

  const cgstAmount = ((calculateSubTotal() * invoiceData.cgstRate) / 100).toFixed(2);
  const sgstAmount = ((calculateSubTotal() * invoiceData.sgstRate) / 100).toFixed(2);
  const grandTotal = (calculateSubTotal() + Number(cgstAmount) + Number(sgstAmount)).toFixed(2);

  const generatePDFBlob = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("URBAN AURA SERVICES PVT. LTD.", 14, 15);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Address - Gurugram, Haryana - 122105", 14, 22);
    doc.text("Phone: +91-XXXXXXXXXX | Email: info@urbanauraservices.com", 14, 28);

    doc.setFontSize(11);
    doc.text(`Invoice No: ${invoiceData.invoiceNo}`, 14, 40);
    doc.text(`Invoice Date: ${invoiceData.invoiceDate}`, 150, 40, { align: "right" });

    let y = 50;
    doc.setFont("helvetica", "bold");
    doc.text("Bill To (Customer Details)", 14, y);
    doc.setFont("helvetica", "normal");
    y += 6;
    doc.text(invoiceData.customerName, 14, y);
    y += 5;
    doc.text(invoiceData.address, 14, y);
    y += 5;
    doc.text(`Phone: ${invoiceData.phone} | GSTIN: ${invoiceData.gstin}`, 14, y);

    autoTable(doc, {
      startY: y + 10,
      head: [["S.No", "Description", "HSN/SAC", "Qty", "Date", "Amount (₹)"]],
      body: invoiceData.services.map((s, i) => [
        i + 1,
        s.description,
        s.code,
        s.qty,
        s.date,
        Number(s.amount).toLocaleString("en-IN"),
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    const finalY = doc.lastAutoTable.finalY || y + 30;

    autoTable(doc, {
      startY: finalY + 10,
      head: [["Tax Type", "Rate (%)", "Amount (₹)"]],
      body: [
        ["CGST", invoiceData.cgstRate, cgstAmount],
        ["SGST", invoiceData.sgstRate, sgstAmount],
        ["Grand Total", "", grandTotal],
      ],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.text(
      "This is a computer-generated invoice and does not require a physical signature.",
      14,
      doc.internal.pageSize.height - 20
    );

    return doc.output("blob");
  };

  const saveToCloud = async () => {
    setIsSaving(true);
    try {
      const pdfBlob = generatePDFBlob();
      const formData = new FormData();
      formData.append("file", pdfBlob, `Invoice-${invoiceData.invoiceNo}.pdf`);
      const res = await fetch("http://localhost:8000/upload-invoice", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setPdfUrl(data.url);
      alert("Invoice uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setIsSaving(false);
    }
  };



// Assuming you are still using fetch for the network request
const downloadPDF = async (pdfUrl) => {
    // 1. Initial Check
    if (!pdfUrl) {
        return alert("Please save invoice to cloud first!");
    }
    
    // Set a clean file name
    const fileName = `Invoice-${invoiceData.invoiceNo}.pdf`;

    try {
        console.log(`Fetching PDF data for non-redirecting download...`);

        // 2. Fetch the file data
        const response = await fetch(pdfUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // 3. Convert the response to a Blob
        const blob = await response.blob(); 

        // 4. Use file-saver to instantly trigger the download
        // saveAs(blob, fileName) handles creating the temporary URL,
        // triggering the click, and cleaning up the memory for you.
        saveAs(blob, fileName);

        console.log(`✅ Direct download of ${fileName} started using file-saver.`);

    } catch (error) {
        console.error("❌ Error during PDF download:", error);
        alert("Failed to download invoice. Check console for details.");
    }
};


  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...invoiceData.services];
    updatedServices[index][field] = value;
    setInvoiceData({ ...invoiceData, services: updatedServices });
  };

  const addService = () => {
    setInvoiceData({
      ...invoiceData,
      services: [...invoiceData.services, { description: "", code: "", qty: 1, date: today, amount: 0 }],
    });
  };

  const removeService = (index) => {
    const updatedServices = invoiceData.services.filter((_, i) => i !== index);
    setInvoiceData({ ...invoiceData, services: updatedServices });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen font-sans">
      <div ref={invoiceRef} className="bg-white shadow-lg p-6 rounded-xl text-gray-800 w-full max-w-[900px] border border-gray-300">
        {/* Header */}
        <div className="flex items-center border-b-2 border-gray-400 pb-4 mb-4">
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-blue-800">URBAN AURA SERVICES PVT. LTD.</h1>
            <p className="text-sm text-gray-600">Address - Line 1, Line 2, Gurugram, Haryana, 122105</p>
            <p className="text-sm text-gray-600">Phone: +91-XXXXXXXXXX | Email: info@urbanauraservices.com</p>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="flex justify-between items-center border border-gray-400 mb-4 rounded-md overflow-hidden">
          <input type="text" value={invoiceData.invoiceNo} onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNo: e.target.value })} className="px-4 py-2 bg-gray-100 text-sm border-r border-gray-400 font-semibold w-1/2" />
          <input type="date" value={invoiceData.invoiceDate} onChange={(e) => setInvoiceData({ ...invoiceData, invoiceDate: e.target.value })} className="px-4 py-2 text-sm font-semibold w-1/2 text-right" />
        </div>

        {/* Bill To */}
        <div className="border border-gray-400 mb-4 p-4 rounded-md">
          <h2 className="font-bold text-lg text-gray-700">Bill To (Customer Details)</h2>
          <input type="text" value={invoiceData.customerName} onChange={(e) => setInvoiceData({ ...invoiceData, customerName: e.target.value })} className="mt-2 border-b border-gray-300 w-full" />
          <input type="text" value={invoiceData.address} onChange={(e) => setInvoiceData({ ...invoiceData, address: e.target.value })} className="mt-1 border-b border-gray-300 w-full" />
          <input type="text" value={invoiceData.phone} onChange={(e) => setInvoiceData({ ...invoiceData, phone: e.target.value })} className="mt-1 border-b border-gray-300 w-full" />
          <input type="text" value={invoiceData.gstin} onChange={(e) => setInvoiceData({ ...invoiceData, gstin: e.target.value })} className="mt-1 border-b border-gray-300 w-full" />
        </div>

        {/* Services Table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse table-auto text-sm">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="border border-gray-300 px-4 py-2 text-center">S. No.</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                <th className="border border-gray-300 px-4 py-2 text-center">HSN/SAC</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Qty</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Amount (₹)</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.services.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-center">{i + 1}</td>
                  <td className="border border-gray-300 px-4 py-2"><input type="text" value={item.description} onChange={(e) => handleServiceChange(i, "description", e.target.value)} className="w-full border-b border-gray-300" /></td>
                  <td className="border border-gray-300 px-4 py-2 text-center"><input type="text" value={item.code} onChange={(e) => handleServiceChange(i, "code", e.target.value)} className="w-full border-b border-gray-300 text-center" /></td>
                  <td className="border border-gray-300 px-4 py-2 text-center"><input type="number" value={item.qty} onChange={(e) => handleServiceChange(i, "qty", e.target.value)} className="w-full border-b border-gray-300 text-center" /></td>
                  <td className="border border-gray-300 px-4 py-2 text-center"><input type="date" value={item.date} onChange={(e) => handleServiceChange(i, "date", e.target.value)} className="w-full border-b border-gray-300 text-center" /></td>
                  <td className="border border-gray-300 px-4 py-2 text-right"><input type="number" value={item.amount} onChange={(e) => handleServiceChange(i, "amount", e.target.value)} className="w-full border-b border-gray-300 text-right" /></td>
                  <td className="border border-gray-300 px-4 py-2 text-center"><button className="text-red-600" onClick={() => removeService(i)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addService} className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg">Add Service</button>
        </div>

        {/* Tax Summary */}
        <table className="w-full border-collapse table-auto text-sm mb-4">
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">CGST (%)</td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                <input type="number" value={invoiceData.cgstRate} onChange={(e) => setInvoiceData({ ...invoiceData, cgstRate: e.target.value })} className="w-full text-right border-b border-gray-300" />
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">{cgstAmount}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">SGST (%)</td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                <input type="number" value={invoiceData.sgstRate} onChange={(e) => setInvoiceData({ ...invoiceData, sgstRate: e.target.value })} className="w-full text-right border-b border-gray-300" />
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">{sgstAmount}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 font-bold">Grand Total</td>
              <td className="border border-gray-300 px-4 py-2 text-right font-bold" colSpan={2}>{grandTotal}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Buttons */}
      <div className="text-center mt-6 flex gap-4">
        <button onClick={saveToCloud} className="px-8 py-3 bg-green-600 text-white rounded-lg" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save to Cloud"}
        </button>
        <button onClick={downloadPDF} className={`px-8 py-3 bg-blue-600 text-white rounded-lg ${!pdfUrl ? "opacity-50 cursor-not-allowed" : ""}`}>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default Invoice;
