import React from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './FooterWithCarousel.css';
import Chatbot from './Chatbot';

const cities = [
  'Bangalore', 'Udaipur', 'Jaipur', 'Ahmedabad',
  'Surat', 'Pune', 'Gandhinagar', 'Mumbai', 'Delhi', 'Ranchi', 'Bihar'
];

const FooterWithCarousel = () => {
  return (
    <>
      <Chatbot />
      {/* 🔼 Moved carousel section to the top */}
      <div className="brand-carousel-wrapper">
        <div className="brand-carousel">
          {[...cities, ...cities].map((city, index) => (
            <span key={index} className="carousel-item">{city}</span>
          ))}
        </div>
      </div>

      {/* 🔽 Main Footer Section */}
      <div className="bg-[#15171f] text-gray-300 font-[Inter] px-8 sm:px-12 lg:px-16 py-20 sm:py-24 lg:py-28 min-h-[400px] rounded-3xl mx-4 mb-2 shadow-md">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
            
            {/* Company Info */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold">UH</span>
                </div>
                <h3 className="text-2xl font-bold text-white">Uber Home</h3>
              </div>
              <p className="text-md">Your one-stop solution for all home services – from expert cleaning to 
                reliable repairs and professional plumbing. Quick, affordable, and trusted by thousands.</p>
            </div>

            {/* Pages */}
            <div className="flex flex-col space-y-2">
              <h4 className="text-lg font-semibold text-white mb-2">Pages</h4>
              <ul className="space-y-1">
                <li><a href="#" className="hover:text-white transition-colors duration-200">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Contact</a></li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="flex flex-col space-y-2">
              <h4 className="text-lg font-semibold text-white mb-2">Social Media</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex items-center space-x-2 hover:text-white transition-colors duration-200">
                    <FaFacebookF />
                    <span>Facebook</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 hover:text-white transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.8 9.2 1 1.4 4.4 2.8 6.9 4 8.7 5.2c3-1.6 6-1.6 9-1.2C19.7 2.4 21.1 2.9 22 4z"/></svg>
                    <span>Twitter</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 hover:text-white transition-colors duration-200">
                    <FaInstagram />
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 hover:text-white transition-colors duration-200">
                    <FaLinkedinIn />
                    <span>LinkedIn</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="flex flex-col space-y-2">
              <h4 className="text-lg font-semibold text-white mb-2">Contact</h4>
              <p>Email: <a href="mailto:info@urbancompany.com" className="hover:text-white transition-colors duration-200">info@uberhome.com</a></p>
              <p>Phone: <a href="tel:+1234567890" className="hover:text-white transition-colors duration-200">+1 (234) 567-890</a></p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <p>©Cleaning Website - All rights reserved</p>
        <p>
          <a href="#">Privacy Policy</a>
          &nbsp;&nbsp;&nbsp;
          <span>Web Development – The Pretentious</span>
        </p>
      </div>
    </>
  );
};

export default FooterWithCarousel;
