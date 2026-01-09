
import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ServiceCard from './ServiceCard';

import './VendorSection.css';

const VendorSection = ({ vendor,userLocation }) => {



  
  const servicesToRender = vendor?.services || [];

  if (!vendor || servicesToRender.length === 0) {
    return null;
  }

  return (
    <div className="vendor-section">
      <div className="vendor-header-container">
        <div className="vendor-header">
          <div className="vendor-header-left">
            <h2 className="vendor-title">{"Urban Aura Services"}</h2>
            <p className="vendor-description">
              Discover top-rated services offered by{' '}
              <strong>{"Urban Aura Services"}</strong>. Rated by thousands of users!
            </p>
          </div>

        </div>
      </div>

      <div className="service-card-wrapper">
        
        {servicesToRender.map((service) => (
          <div key={service.id} className="service-card-slider">
            {/* The ServiceCard now receives the full service object as a prop */}
            <ServiceCard service={service} vendor={vendor}  userLocation={userLocation}/>
          </div>
        ))}
      </div>

      
    </div>
  );
};

export default VendorSection;