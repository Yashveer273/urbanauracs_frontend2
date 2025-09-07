// HomePage.jsx
import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSectionWrapper';
import FeatureHighlights from '../components/FeatureHighlights';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import HowItWorks from '../components/HowItWorks';
import PromotionSection from '../components/PromotionSection';
import FAQSection from '../components/FAQSection';
import FooterWithCarousel from '../components/FooterWithCarousel';
import ServicePopup from '../components/ServicePopup';
import CartSidebar from '../components/CartSidebar'; 

const HomePage = () => {
  const [showServices, setShowServices] = useState(false);
  const servicesRef = useRef(null);
  const featuresRef = useRef(null);

  const toggleServicePopup = () => setShowServices(!showServices);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
    <>
      <Navbar toggleServicePopup={toggleServicePopup} showServices={showServices} onServiceClick={scrollToServices} onAboutClick={scrollToFeatures}  />

      {showServices && (
        <ServicePopup
          services={services}
          onClose={toggleServicePopup}
        />
      )}
      <CartSidebar /> 
      <HeroSection />
      <div ref={featuresRef}>
        <FeatureHighlights />
      </div>
      <WhyChooseUs />
      <div ref={servicesRef}>
        <Services />
      </div>
      <HowItWorks />
      <PromotionSection />
      <FAQSection />
      <FooterWithCarousel />
    </>
  );
};

export default HomePage;
