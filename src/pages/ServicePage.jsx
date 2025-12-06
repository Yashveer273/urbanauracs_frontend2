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
    'home-cleaning': { vendors: fullHomeVendors },
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
    serviceDataMap[serviceName]?.vendors || serviceDataMap['home-cleaning'].vendors;

  const services = [
    { title: 'Home Cleaning',  link: '/services/home-cleaning' },
    { title: 'AC Repair Service',  link: '/services/ac-repair' },
    { title: 'Cleaning Service',  link: '/services/cleaning' },
    { title: 'Commercial Cleaning',  link: '/services/commercial-cleaning' },
    { title: 'Pest Control',  link: '/services/pest-control' },
    { title: 'Carpenter',  link: '/services/carpenter' },
    { title: 'Home Painting',  link: '/services/home-painting' },
    { title: 'Plumber',  link: '/services/plumber' },
    { title: 'Electrician',  link: '/services/electrician' },
    { title: 'Balloon Decoration',  link: '/services/balloon-decoration' },
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
