// const saveToCloud = async () => {
//   setIsSaving(true);
//   try {
//     const pdfBlob = generatePDFBlob(invoiceData); // Pass invoiceData here
//     const formData = new FormData();
//     formData.append("file", pdfBlob, `Invoice-${invoiceData.invoiceNo}.pdf`);
//     const res = await fetch("http://localhost:8000/upload-invoice", {
//       method: "POST",
//       body: formData,
//     });
//     const data = await res.json();
//     setPdfUrl(data.url);
//     alert("Invoice uploaded successfully!");
//   } catch (err) {
//     console.error("Upload failed:", err);
//   } finally {
//     setIsSaving(false);
//   }
// };