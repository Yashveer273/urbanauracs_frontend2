import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage,firestore } from "../firebaseCon";
import { doc, setDoc, increment, serverTimestamp, updateDoc } from "firebase/firestore";

export const cities = [
  "Delhi",
  "Kanpur",
  "Gurgaon",
  "Faridabad",
  "Chandigarh",
  "Ghaziabad",
  "Noida",
  "Kolkata",
  "Mumbai",
  "Pune",
  "Varanasi",
  "Mathura",
  "Patna",
  "Meerut",
  "Jaipur",
  "Ranchi",
  "Lucknow",
  "Ahmedabad",
  "Dehradun",
  "Jammu",
  "Gwalior",
  "Bhopal",
  "Indore",
  "Hyderabad",
  "Bengaluru",
  "Mysore",
  "Allahabad",
];
export const normalizeDate = (date) =>
  new Date(date).toISOString().split("T")[0];

export const handleCopy = async (header, body) => {
  // Safety check
  if (!Array.isArray(header) || !Array.isArray(body)) {
    alert("Header and Body must be arrays");
    return;
  }

  if (header.length !== body.length) {
    alert("Header and Body length must be the same");
    return;
  }

  const formattedText = header
    .map((key, index) => `${key}: ${body[index]}`)
    .join("\n");

  await navigator.clipboard.writeText(formattedText);
  alert("Copied to clipboard ✅");
};
  export function openWhatsApp(e) {
  const number = e.target
    .closest("td")
    .querySelector("input")
    .value;

  if (!number) {
    alert("Enter WhatsApp number");
    return;
  }

  const phone = number.replace(/\D/g, "");

  if (phone.length < 10) {
    alert("Invalid WhatsApp number");
    return;
  }

  window.open(`https://wa.me/${phone}`, "_blank");
}



 export const uploadInvoice = async (pdfBlob, ) => {
  try {
    const date = Date.now();
    const fileName = `${date}.pdf`;

    // 🔹 Storage path (like Firestore collection)
    const storageRef = ref(
      storage,
      `invoices/${fileName}`
    );

    // 🔹 Upload PDF
    await uploadBytes(storageRef, pdfBlob, {
      contentType: "application/pdf",
    });

    // 🔹 Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("❌ Upload failed:", error);
    throw error;
  }
};

export const createUnread = async (serviceName) => {
  // ✅ REQUIRED VALIDATION
  if (!serviceName || typeof serviceName !== "string") {
    throw new Error("createUnread: serviceName is required and must be a string");
  }

  const ref = doc(firestore, "notificationCounters", serviceName);

  // ✅ ATOMIC AUTO-INCREMENT
  await setDoc(
    ref,
    {
      unreadCount: increment(1),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return true;
};
export const markServiceAllRead = async (serviceName) => {
  if (!serviceName) {
    throw new Error("serviceName is required");
  }

  const ref = doc(firestore, "notificationCounters", serviceName);

  await updateDoc(ref, {
    unreadCount: 0,
    updatedAt: serverTimestamp(),
  });
};
