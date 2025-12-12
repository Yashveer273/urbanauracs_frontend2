import React from "react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { Copy, Check} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function OrderSuccess({id}) {
  const navigator =useNavigate();


const [copied, setCopied] = useState(false);

const handleCopy = async (text) => {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 1200); // Auto reset
  } catch (err) {
    console.error("Copy failed", err);
  }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      {/* Success Icon */}
      <div className="text-green-500 text-6xl mb-4">✔</div>

      {/* Thank You Message */}
      <h1 className="text-2xl font-bold mb-2">THANK YOU!</h1>
      <p className="text-gray-700 mb-4">
        Your order has been placed successfully.
      </p>

     <p className="text-lg font-semibold mb-6 flex items-center gap-2">
  Order ID :
  <span className="text-orange-600">{id}</span>

  <button
    onClick={() => handleCopy(id)}
    className="p-1 rounded hover:bg-gray-200 transition flex items-center"
    type="button"
  >
    {copied ? (
      <Check size={18} className="text-green-600" />
    ) : (
      <Copy size={18} className="text-gray-700" />
    )}
  </button>
</p>

      <p className="text-gray-600 mb-8">Our experts will contact you shortly.</p>

      {/* Go Back Button */}
      <a
        href="/"
        className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-600 transition"
      >
        GO BACK TO HOME
      </a>

      {/* Social Media */}
      <div className="flex space-x-6 mt-10">
        <a
          href="https://www.facebook.com/people/Urban-Aura-Services/61578697472510/?rdid=dSpmNYdUtKxfvQEg&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1AyHYzdyE5%2F"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook size={28} className="text-blue-600 hover:text-blue-800" />
        </a>
        <a
          href="https://www.instagram.com/urbanauraservices/?igsh=MTl5aDlua3B4bGRheA%3D%3D#"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram size={28} className="text-pink-500 hover:text-pink-700" />
        </a>
        <a
          href="youtube.com/@urbanauraservices?si=gZsl7vYVsbWpFTW5"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaYoutube size={28} className="text-red-600 hover:text-red-800" />
        </a>
      </div>
    </div>
  );
}
