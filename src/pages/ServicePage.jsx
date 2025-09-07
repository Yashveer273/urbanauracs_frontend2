// ServicePage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import BannerSlider from '../components/BannerSlider';
import Navbar from '../components/Navbar';
import FooterWithCarousel from '../components/FooterWithCarousel';
import VendorSection from '../components/VendorSection';
import ServicePopup from '../components/ServicePopup';

// Import all service vendor JSONs
import fullHomeVendors from '../data/fullHomeVendors.json';
import acRepairVendors from '../data/acRepairVendors.json';
import cleaningVendors from '../data/cleaningVendors.json';
import commercialVendors from '../data/commercialVendors.json';
import pestControlVendors from '../data/pestControlVendors.json';
import carpenterVendors from '../data/carpenterVendors.json';
import homePaintingVendors from '../data/homePaintingVendors.json';
import plumberVendors from '../data/plumberVendors.json';
import electricianVendors from '../data/electricianVendors.json';
import balloonDecorationVendors from '../data/balloonDecorationVendors.json';

const ServicePage = () => {
  const { serviceName } = useParams();
  const [showServices, setShowServices] = useState(false);
  const toggleServicePopup = () => setShowServices(!showServices);

  // Map service names to vendor data
  const serviceDataMap = {
    'full-home-cleaning': { vendors: fullHomeVendors },
    'ac-repair': { vendors: acRepairVendors },
    'cleaning': { vendors: cleaningVendors },
    'commercial-cleaning': { vendors: commercialVendors },
    'pest-control': { vendors: pestControlVendors },
    'carpenter': { vendors: carpenterVendors },
    'home-painting': { vendors: homePaintingVendors },
    'plumber': { vendors: plumberVendors },
    'electrician': { vendors: electricianVendors },
    'balloon-decoration': { vendors: balloonDecorationVendors },
  };

  // Default to full home cleaning if no match
  const vendors =
    serviceDataMap[serviceName]?.vendors || serviceDataMap['full-home-cleaning'].vendors;

  const services = [
    { title: 'Full Home Cleaning', image: '/images/home_cleaning copy.jpg', link: '/services/full-home-cleaning' },
    { title: 'AC Repair Service', image: '/images/ac_repair.jpg', link: '/services/ac-repair' },
    { title: 'Cleaning Service', image: '/images/cleaning_service.jpg', link: '/services/cleaning' },
    { title: 'Commercial Cleaning', image: '/images/commercial.jpg', link: '/services/commercial-cleaning' },
    { title: 'Pest Control', image: '/images/pest_control.jpg', link: '/services/pest-control' },
    { title: 'Carpenter', image: '/images/carpenter.jpg', link: '/services/carpenter' },
    { title: 'Home Painting', image: '/images/home_painting.jpg', link: '/services/home-painting' },
    { title: 'Plumber', image: '/images/plumber.jpg', link: '/services/plumber' },
    { title: 'Electrician', image: '/images/electrician.jpg', link: '/services/electrician' },
    { title: 'Balloon Decoration', image: '/images/balloon_decoration.jpg', link: '/services/balloon-decoration' },
  ];

  return (
    <div className="service-page" style={{ position: 'relative' }}>
      <Navbar toggleServicePopup={toggleServicePopup} showServices={showServices} />

      {showServices && (
        <ServicePopup
          services={services}
          onClose={toggleServicePopup}
        />
      )}

      <BannerSlider />

      {vendors.map((vendor) => (
        <VendorSection key={vendor.vendorId} vendorId={vendor.vendorId} />
      ))}

      <FooterWithCarousel />
    </div>
  );
};

export default ServicePage;
