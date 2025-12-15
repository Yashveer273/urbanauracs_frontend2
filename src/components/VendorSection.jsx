
import React, { useRef, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ServiceCard from './ServiceCard';
import ViewAllPopup from './ViewAllPopup';
import './VendorSection.css';

const VendorSection = ({ vendor,userLocation }) => {
  const [showPopup, setShowPopup] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    const scrollAmount = 320 * 2;

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleViewAll = () => {
    setShowPopup(true);
  };

  const servicesToRender = vendor?.services || [];

  if (!vendor || servicesToRender.length === 0) {
    return null;
  }

  return (
    <div className="vendor-section">
      <div className="vendor-header-container">
        <div className="vendor-header">
          <div className="vendor-header-left">
            <h2 className="vendor-title">{vendor.vendorName=="self"?"Urban Aura Services":vendor.vendorName}</h2>
            <p className="vendor-description">
              Discover top-rated services offered by{' '}
              <strong>{vendor.vendorName=="self"?"Urban Aura Services":vendor.vendorName}</strong>. Rated by thousands of users!
            </p>
          </div>

          <div className="view-scroll-controls">
            <button className="view-all-main-btn" onClick={handleViewAll}>
              View All
            </button>
            <button
              onClick={() => handleScroll('left')}
              className="arrow-btn-circle"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="arrow-btn-circle"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
{showPopup && (
        <ViewAllPopup
        vendor={vendor}
        userLocation={userLocation}
          category={vendor.vendorName}
          services={servicesToRender}
          onClose={() => setShowPopup(false)}
        />
      )}
      <div className="service-card-wrapper" ref={scrollRef}>
        
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