import React, { useEffect, useState } from "react";
import { firestore } from "../firebaseCon";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { FaPhone, FaEnvelope, FaYoutube, FaInstagram, FaFacebook, FaMapMarkerAlt } from "react-icons/fa";

const SocialLinksManager = () => {
  const [links, setLinks] = useState({
    phone: "",
    email: "",
    youtube: "",
    insta: "",
    fb: "",
    address: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setLinks({ ...links, [e.target.name]: e.target.value });
  };

  // Save/update Firestore (single doc)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await setDoc(doc(firestore, "socialLinks", "main"), {
        ...links,
        updatedAt: serverTimestamp(),
      });
      alert("Social links saved ✅");
    } catch (err) {
      console.error("Error saving links:", err);
    }
  };

  // Fetch single doc on mount
  useEffect(() => {
    const fetchLinks = async () => {
      const docRef = doc(firestore, "socialLinks", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLinks(docSnap.data());
      }
    };
    fetchLinks();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 mb-8 max-w-3xl mx-auto">
      <h2 className="text-lg font-bold mb-4">Manage Social Links</h2>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-2">
        {Object.keys(links).map((field) => (
          <input
            key={field}
            type="text"
            name={field}
            placeholder={field === "address" ? "ADDRESS" : field.toUpperCase()}
            value={links[field]}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>

      {/* Display icons */}
      <div className="mt-4 flex gap-4 text-2xl">
        {links.phone && <FaPhone />}
        {links.email && <FaEnvelope />}
        {links.youtube && <FaYoutube />}
        {links.insta && <FaInstagram />}
        {links.fb && <FaFacebook />}
        {links.address && <FaMapMarkerAlt />}
      </div>
    </div>
  );
};

export default SocialLinksManager;
