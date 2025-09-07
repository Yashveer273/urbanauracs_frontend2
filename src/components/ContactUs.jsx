import React, { useState } from "react";
import "./ContactUs.css";
import Chatbot from "./Chatbot";

import { collection, addDoc,serverTimestamp  } from "firebase/firestore";
import { firestore } from "../firebaseCon";
export default function ContactUs() {
  const [name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState(""); // For success message

  // Validation rules
  const isPhoneValid = phone.replace(/\D/g, "").length === 10;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid =
    isPhoneValid && isEmailValid && name.trim() !== "" && message.trim() !== "";

  // Handlers
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      // Log form data to console
      console.log({
        name,
        email,
        phone,
        message,
      });
      await addDoc(collection(firestore, "homeCleaningTicket"), {
        data: {
          name,
          email,
          phone,
          message,
          status: "New",              
    createdAt: serverTimestamp() 
        },
      });
      // Show success message on page
      setSuccessMsg("✅ Form submitted successfully!");

      // Reset form fields
      setFullName("");
      setEmail("");
      setPhone("");
      setMessage("");

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMsg(""), 5000);
    }
  };

  return (
    <div className="contact-page">
      <header className="header">
        <div className="dot"></div>
        <h1>Contact Us</h1>
      </header>

      <main className="contact-container">
        <section className="contact-form">
          <h2>Contact us</h2>

          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter full name"
            value={name}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          {name.trim() === "" && <p className="error">Name is required</p>}

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {!isEmailValid && email && (
            <p className="error">Invalid email address</p>
          )}

          <label>Enter Phone Number</label>
          <div className="phone-input">
            <select>
              <option>+91</option>
              <option>+1</option>
              <option>+44</option>
            </select>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={handlePhoneChange}
              required
            />
          </div>
          {!isPhoneValid && phone && (
            <p className="error">Phone must be exactly 10 digits</p>
          )}

          <label>Enter Message</label>
          <textarea
            placeholder="Enter message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>

          <button
            className="send-btn"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Send Message
          </button>

          {successMsg && <p className="success">{successMsg}</p>}
        </section>

        {/* Contact Info */}
        <section className="contact-info">
          <div className="info-box">
            {/* Call Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="black"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.72 11.72 0 003.68.59 1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.27.21 2.5.59 3.68.09.3.03.63-.24.9l-2.23 2.21z" />
            </svg>
            <p>418 838-6000</p>
          </div>

          <div className="info-box">
            {/* Email Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="black"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path d="M20 4H4a2 2 0 00-2 2v12c0 1.11.89 2 2 2h16c1.1 0 2-.89 2-2V6c0-1.11-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <p>Qlinest.services@gmail.com</p>
          </div>

          <div className="info-box">
            {/* Location Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="black"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
            </svg>
            <p>31 Wolfe Street, Lévis</p>
          </div>
          {/* Social Media Icons */}
          <div className="social-icons">
            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="black"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0-2h10a7 7 0 017 7v10a7 7 0 01-7 7H7a7 7 0 01-7-7V7a7 7 0 017-7zm5 7a5 5 0 100 10 5 5 0 000-10zm0-2a7 7 0 110 14 7 7 0 010-14zm6-1a1 1 0 100 2 1 1 0 000-2z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="black"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.494v-9.294H9.847V11.41h2.972V8.797c0-2.943 1.796-4.555 4.416-4.555 1.255 0 2.334.093 2.646.135v3.07l-1.817.001c-1.426 0-1.701.677-1.701 1.67v2.192h3.401l-.443 3.296h-2.958V24h5.797C23.407 24 24 23.407 24 22.675V1.325C24 .593 23.407 0 22.675 0z" />
              </svg>
            </a>

            {/* Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="black"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724c-.951.566-2.005.978-3.127 1.2a4.916 4.916 0 00-8.384 4.482C7.691 8.094 4.066 6.13 1.64 3.161a4.822 4.822 0 00-.666 2.475 4.916 4.916 0 002.188 4.096 4.903 4.903 0 01-2.229-.616c-.054 2.28 1.582 4.415 3.949 4.89a4.935 4.935 0 01-2.224.084 4.919 4.919 0 004.604 3.417 9.867 9.867 0 01-7.29 2.034 13.945 13.945 0 007.548 2.213c9.058 0 14.01-7.496 14.01-13.986 0-.21-.005-.423-.014-.634A10.025 10.025 0 0024 4.557z" />
              </svg>
            </a>
          </div>
        </section>
      </main>

      <Chatbot />
    </div>
  );
}
