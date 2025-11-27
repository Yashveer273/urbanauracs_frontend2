// HomePage.jsx
import React, { useState, useRef ,useEffect} from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSectionWrapper';
import AboutUs from '../components/aboutUs';
import Services from '../components/Services';
import WhyChooseUs from '../components/WhyChooseUs';
import HowItWorks from '../components/HowItWorks';
import PromotionSection from '../components/PromotionSection';
import FAQSection from '../components/FAQSection';
import FooterWithCarousel from '../components/FooterWithCarousel';
import ServicePopup from '../components/ServicePopup';
import CartSidebar from '../components/CartSidebar'; 
import { firestore } from "../firebaseCon";
import { useDispatch } from 'react-redux';
import { collection, getDocs } from "firebase/firestore";
import { setLinks } from '../store/socialLinks';
import CityCards from '../components/cityCard';
import {  useSelector } from "react-redux";

import { logoutUser, selectUser } from "../store/userSlice";
import axios from 'axios';
import { API_BASE_URL } from '../API';

const HomePage = () => {
   const user = useSelector(selectUser);
     const dispatch = useDispatch(); 
  const [showServices, setShowServices] = useState(false);
  const [MyCity, setMyCity] = useState("");

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
  
    // ========================================================
const fetchSocialLinks = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "socialLinks"));
    let links = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const createdAt = data.createdAt?.toDate 
        ? data.createdAt.toDate().toISOString() 
        : null;

      const updatedAt = data.updatedAt?.toDate 
        ? data.updatedAt.toDate().toISOString() 
        : null;

      links.push({ id: doc.id, ...data, createdAt, updatedAt });
    });

    return links;
  } catch (error) {
    console.error("Error fetching social links:", error);
    return [];
  }
};


  const getLinks = async () => {
  
    const data = await fetchSocialLinks();
     dispatch(setLinks(data));
    console.log("Social Links:", data);
  };
  const ValidateUse = async () => {
  try {
    if (!user?.token) {

      console.log("No token found for validation.",user);
      dispatch(logoutUser());
      return;
    }

    const res = await axios.post(`${API_BASE_URL}/verify-token`, {
      token: user.token,
    });

    if (res.data.success) {
      console.log("✅ Token is valid:", res.data.data);
    } else {
      console.warn("❌ Token invalid, logging out...");
      dispatch(logoutUser());
    }
  } catch (err) {
    // If token expired or invalid response
    if (err.response && err.response.status === 401) {
      console.warn("⚠️ Token expired — forcing logout.");
      dispatch(logoutUser());
    } else {
      console.error("Token verification failed:", err.message);
    }
    
  }
};

 useEffect(() => {

    getLinks();
    ValidateUse()
  }, []);
  return (
    <>
      <Navbar toggleServicePopup={toggleServicePopup} showServices={showServices} onServiceClick={scrollToServices} onAboutClick={scrollToFeatures}  />

      {showServices && (
        <ServicePopup
          services={services}
          
          onClose={toggleServicePopup}
        />
      )}
      <CityCards setMyCity={setMyCity}/> 
      <CartSidebar /> 
       
      <HeroSection MyCity={MyCity} />
   
      <div ref={featuresRef}>
        <AboutUs />
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
