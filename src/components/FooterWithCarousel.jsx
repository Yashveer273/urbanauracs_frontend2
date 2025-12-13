import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import "./FooterWithCarousel.css";
import Chatbot from "./Chatbot";
import { useSelector } from "react-redux";
const cities = [
  "Bangalore",
  "Udaipur",
  "Jaipur",
  "Ahmedabad",
  "Surat",
  "Pune",
  "Gandhinagar",
  "Mumbai",
  "Delhi",
  "Ranchi",
  "Bihar",
];

const FooterWithCarousel = () => {
  const links = useSelector((state) => state.socialLinks.links);
  return (
    <>
      <Chatbot />

      <div className="brand-carousel-wrapper">
        <div className="brand-carousel">
          {[...cities, ...cities].map((city, index) => (
            <span key={index} className="carousel-item">
              {city}
            </span>
          ))}
        </div>
      </div>

      {/* 🔽 Main Footer Section */}
      <div className="bg-[#1e1e1e] text-gray-300 font-[Inter] px-8 sm:px-12 lg:px-16 py-8 sm:py-8 lg:py-8 min-h-[200px] rounded-3xl mx-4 mb-2 shadow-md">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            {/* Company Info */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <img
                  src="/logo.jpg"
                  alt="Clean Logo"
                  width={120}
                  height={50}
                  className="object-cover rounded-full transition-transform duration-500"
                />
              </div>

              <p className="text-md">
                Your one-stop solution for all home services – from expert
                cleaning to reliable repairs and professional plumbing. Quick,
                affordable, and trusted by thousands.
              </p>
            </div>

            {/* Pages */}
            <div className="flex flex-col space-y-2">
              <h4 className="text-lg font-semibold text-white mb-2">Pages</h4>
              <ul className="space-y-1">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/Aboutus"
                    className="hover:text-white transition-colors duration-200"
                  >
                    About us
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
                
                <li>
                  <a
                    href="/PrivacyPolicy"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/RefundCancellationPolicy"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Refund Cancellation Policy
                  </a>
                </li>

                <li>
                  <a
                    href="/ShippingPolicy"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/TermsAndConditions"
                    className="hover:text-white transition-colors duration-200"
                  >
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="flex flex-col space-y-2">
              <h4 className="text-lg font-semibold text-white mb-2">
                Social Media
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href={links[0]?.fb}
                    className="flex items-center space-x-2 hover:text-white transition-colors duration-200"
                  >
                    <FaFacebookF />
                    <span>Facebook</span>
                  </a>
                </li>

                <li>
                  <a
                    href={links[0]?.insta}
                    className="flex items-center space-x-2 hover:text-white transition-colors duration-200"
                  >
                    <FaInstagram />
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a
                    href={links[0]?.youtube}
                    className="flex items-center space-x-2 hover:text-white transition-colors duration-200"
                  >
                    <FaYoutube />
                    <span>You Tube</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="flex flex-col space-y-2">
              <h4 className="text-lg font-semibold text-white mb-2">Contact</h4>
              <p>
                Address:{" "}
                <a
                  href="mailto:info@urbancompany.com"
                  className="hover:text-white transition-colors duration-200"
                >
                  {links[0]?.address}
                </a>
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:info@urbancompany.com"
                  className="hover:text-white transition-colors duration-200"
                >
                  {links[0]?.email}
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  href="tel:+1234567890"
                  className="transition-colors duration-200 hover:text-white pointer-events-auto md:pointer-events-none md:text-inherit md:no-underline"
                >
                  {links[0]?.phone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <p>
          ©Urban Aura Services Pvt Ltd - All rights reserved |{" "}
          <a href="/PrivacyPolicy">Privacy Policy </a> |{" "}
          <a
            href="/RefundCancellationPolicy"
            className="hover:text-white transition-colors duration-200"
          >
            Refund Cancellation Policy
          </a>
        </p>
      </div>
    </>
  );
};

export default FooterWithCarousel;
