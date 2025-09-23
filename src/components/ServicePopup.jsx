// ServicePopup.jsx
import React from 'react';
import './ServicePopup.css';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTimes, FaArrowRight } from 'react-icons/fa'; 


const ServicePopup = ({ services }) => {
  return (
    <div className="custom-service-popup-wrapper">
      <div className="custom-service-popup">
        <div className="custom-popup-header">
          <h2 className="custom-popup-title">Our Services</h2>
          
        </div>

        <div className="custom-service-columns">
          {[0, 1].map((col) => (
            <div className="custom-service-column" key={col}>
              {services
                .filter((_, i) => i % 2 === col)
                .map((service, index) => (
                  <a href={service.link} className="custom-service-item-link" key={index}>
                    <div className="custom-service-item">
                      <img src={service.image} alt={service.title} className="custom-service-image" />
                      <span>{service.title}</span>
                      </div>
                  </a>
                ))}
            </div>
          ))}
        </div>

        <div className="custom-popup-footer">
          <div className="footer-quick-links">
  <a href="#" className="footer-link">
    Home <span className="footer-link-icon"><FaArrowRight /></span>
  </a>
  <a href="#" className="footer-link">
    About Us <span className="footer-link-icon"><FaArrowRight /></span>
  </a>
  <a href="#" className="footer-link">
    Blog <span className="footer-link-icon"><FaArrowRight /></span>
  </a>
  <a href="#" className="footer-link">
    Contact <span className="footer-link-icon"><FaArrowRight /></span>
  </a>
</div>

          <div className="social-icons">
            <span>Follow us:</span>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicePopup;