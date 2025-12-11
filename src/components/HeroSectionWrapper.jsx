/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {  ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VendorSection from "./VendorSection";
import HeroBannerSlider from "./HomeCarousal ";

import { useDispatch } from "react-redux";
import { openChatbox } from "../store/chatboxSlice";

import { services } from "../data/ProductData";



const HeroSectionWrapper = ({ MyCity }) => {
  const [showServices, setShowServices] = useState(false);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const servicesRef = useRef(null);

  const handleShowServices = (vendors, location) => {
    setFilteredVendors(vendors);
    setSelectedLocation(location);
    setShowServices(true);
    setTimeout(() => {
      servicesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };


  return (
    <div className="bg-[#fff]  font-sans">
      <main className=" px-0">
        <HeroSection onShowServices={handleShowServices} MyCity={MyCity}  />
        <AnimatePresence>
          {showServices && (
            <div ref={servicesRef} className="relative">
              <ServicesSection
                filteredVendors={filteredVendors}
                selectedLocation={selectedLocation}
              />
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const HeroSection = ({ onShowServices, MyCity }) => {
  const heroRef = useRef(null);

  return (
    <section
      ref={heroRef}
      className="relative bg-[#15171f] pt-16 pb-10 px-6 overflow-hidden rounded-3xl shadow-lg"
    >
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mt-28 md:mt-22">
        <div>
          <HeroBannerSlider/>
        </div>
        <motion.div
          className="text-center md:text-left z-5"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Get Your
            <br />
            <span className="text-[#f87559]">Dream Clean</span> Home
          </h1>
          <p className="mt-6 text-lg text-gray-400 max-w-lg mx-auto md:mx-0">
            Professional, reliable, and eco-friendly cleaning solutions tailored
            to your lifestyle.
          </p>
          <BookingForm onShowServices={onShowServices} MyCity={MyCity} />
        </motion.div>
      </div>
    </section>
  );
};

const BookingForm = ({ MyCity }) => {
  const dispatch = useDispatch();

  const [BookingCity, setBookingCity] = useState("");
  const [isManualLocation, setIsManualLocation] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const navigate = useNavigate();
  const BookingCities = [
    "Delhi",
    "Gurgaon",
    "Faridabad",
    "Chandigarh",
    "Ghaziabad",
    "Noida",
    "Kolkata",
    "Mumbai",
    "Pune",
    "Varanasi",
    "Mathura",
    "Patna",
    "Meerut",
    "Jaipur",
    "Ranchi",
    "Lucknow",
    "Ahmedabad",
    "Dehradun",
    "Jammu",
    "Gwalior",
    "Bhopal",
    "Indore",
    "Hyderabad",
    "Bengaluru",
    "Mysore",
    "Allahabad",
  ];

  useEffect(() => {
    if (MyCity) {
      setBookingCity(MyCity);
    }
  }, [isManualLocation, MyCity]);

  const handleBookNow = () => {
    console.log(services);
    let serviceData = services.find((s) => s.ServiceName == selectedService);

    const Data = serviceData.data.filter(
      (Product) =>
        Product.location?.trim().toLowerCase().replace(/\s+/g, "") ===
        BookingCity.trim().toLowerCase().replace(/\s+/g, "")
    );
    console.log(Data.length);
    if (Data.length <= 0) {
      alert("😔 No services available in your selected location");
      // setchatopenStatus=true;
      dispatch(openChatbox());
    } else {
      navigate(`services/${selectedService}-${BookingCity}`);
    }
  };

  return (
    <motion.div
      className="mt-8 bg-[#2c2d34] p-4 rounded-xl shadow-lg border border-gray-700 flex flex-col gap-4 max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-col items-center gap-4">
        {/* Service */}
        <div className="w-full md:flex-1 flex items-center relative">
          <div className="w-full">
            <select
              id="service"
              value={selectedService}
              required
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full bg-transparent focus:outline-none font-semibold text-white placeholder-gray-500 border-b border-gray-600 pb-1 cursor-pointer relative z-10"
            >
              <option value="" disabled hidden>
                Select Service
              </option>
              {services.map((service, idx) => (
                <option
                  key={idx}
                  value={service.ServiceName}
                  className="bg-[#2c2d34] text-white"
                >
                  {service.ServiceName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Divider */}

        {/* Booking City */}
        <div className="w-full md:flex-1 flex items-center relative">
          <div className="w-full">
            <select
              id="Bookinglocation"
              value={BookingCity}
              onChange={(e) => setBookingCity(e.target.value)}
              className="w-full bg-transparent focus:outline-none font-semibold text-white placeholder-gray-500 border-b border-gray-600 pb-1 cursor-pointer relative z-10"
            >
              <option value="" disabled>
                Select City
              </option>
              {BookingCities.map((city, index) => (
                <option key={index} value={city} className="bg-[#2c2d34] text-white">
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Divider */}
      </div>

      {/* Book Now Button */}
      <button
        onClick={handleBookNow}
        className="w-full bg-[#f87559] text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-500 transition-all duration-300 flex items-center justify-center gap-2"
      >
        Proceed <ChevronRight size={20} />
      </button>
    </motion.div>
  );
};

const ServicesSection = ({ filteredVendors, selectedLocation }) => {
  if (filteredVendors.length === 0) {
    return (
      <motion.section
        className="py-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6 text-center mt-12">
          <div className="text-center text-white text-xl p-8 bg-[#12131a] rounded-xl border border-gray-800">
            😔 No services available in{" "}
            {selectedLocation || "the selected location"}. Please try another
            location.
          </div>
        </div>
      </motion.section>
    );
  }

  const vendors = filteredVendors.reduce((acc, vendor) => {
    const existingVendor = acc.find((v) => v.vendorName === vendor.vendorName);
    if (existingVendor) {
      existingVendor.services.push(...vendor.services);
    } else {
      acc.push(vendor);
    }
    return acc;
  }, []);

  return (
    <motion.section
      className="py-12 relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {vendors.map((vendor) => (
            <VendorSection key={vendor.vendorId} vendor={vendor} />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSectionWrapper;
