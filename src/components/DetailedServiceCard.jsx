import React from 'react';
import { FaStar, FaClock, FaTicketAlt } from 'react-icons/fa';
import './DetailedServiceCard.css';

const DetailedServiceCard = ({ service }) => {
  return (
    <div className="detailed-card">
      <div className="image-container-01">
        <img src={service.serviceImage} alt={service.title} className="detailed-card-img" />
        <div className="overlay">
          <h3 className="overlay-title">{service.title}</h3>
          <div className="overlay-price">
            <span className="new">₹{service.price}</span>
            <span className="old">₹{service.originalPrice}</span>
          </div>
        </div>
      </div>

      <div className="detailed-card-info">
        <p className="detailed-desc">{service.description}</p>

        <div className="detailed-meta">
          <span><FaStar className="icon" /> {service.rating} ({service.reviews} reviews)</span>
          <span><FaClock className="icon" /> {service.duration}</span>
        </div>

        <button className="book-now-btn">
          <FaTicketAlt className="btn-icon" /> Book Now
        </button>
      </div>
    </div>
  );
};

export default DetailedServiceCard;   

