import React from 'react';
import './ViewAllPopup.css';
import DetailedServiceCard from './DetailedServiceCard';

const ViewAllPopup = ({ services, onClose }) => {
  return (
    <div className="viewall-popup">
      <div className="viewall-header">
        <h3>All Services</h3>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="viewall-scrollable">
        {services.map(service => (
          <DetailedServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};

export default ViewAllPopup;
