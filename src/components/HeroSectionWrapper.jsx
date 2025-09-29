/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VendorSection from "./VendorSection";
import HeroBannerSlider from "./HomeCarousal ";
import fullHomeVendors from "../data/fullHomeVendors.json";
import acRepairVendors from "../data/AcRepair.json";
import commercialCleaning from "../data/CommercialCleaning.json";
import { useDispatch } from "react-redux";
import { openChatbox } from "../store/chatboxSlice";
const serviceDataMap = {
  "full-home-cleaning": fullHomeVendors,
  "ac-repair": acRepairVendors,
  "commercial-cleaning": commercialCleaning,
};

const services = [
  {
    title: "Full Home Cleaning",
    image: "/images/home_cleaning copy.jpg",
    link: "/services/full-home-cleaning",
  },
  {
    title: "AC Repair Service",
    image: "/images/ac_repair.jpg",
    link: "/services/ac-repair",
  },
  {
    title: "Cleaning Service",
    image: "/images/cleaning_service.jpg",
    link: "/services/cleaning",
  },
  {
    title: "Commercial Cleaning",
    image: "/images/commercial.jpg",
    link: "/services/commercial-cleaning",
  },
  {
    title: "Pest Control",
    image: "/images/pest_control.jpg",
    link: "/services/pest-control",
  },
  {
    title: "Carpenter",
    image: "/images/carpenter.jpg",
    link: "/services/carpenter",
  },
  {
    title: "Home Painting",
    image: "/images/home_painting.jpg",
    link: "/services/home-painting",
  },
  { title: "Plumber", image: "/images/plumber.jpg", link: "/services/plumber" },
  {
    title: "Electrician",
    image: "/images/electrician.jpg",
    link: "/services/electrician",
  },
  {
    title: "Balloon Decoration",
    image: "/images/balloon_decoration.jpg",
    link: "/services/balloon-decoration",
  },
];

const HeroSectionWrapper = ({ MyCity}) => {
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
        <HeroSection onShowServices={handleShowServices} MyCity={MyCity} />
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
          <HeroBannerSlider />
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
          <BookingForm onShowServices={onShowServices} MyCity={MyCity}  />
        </motion.div>
      </div>
    </section>
  );
};

const BookingForm = ({ MyCity }) => {
  const dispatch = useDispatch();
  const [location, setLocation] = useState("");
  const [BookingCity, setBookingCity] = useState("");
  const [isManualLocation, setIsManualLocation] = useState(false);
  const [selectedService, setSelectedService] = useState(services[0].link);
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
    if ("geolocation" in navigator && !isManualLocation && !location) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "";
            const state = data.address.state || "";
            setLocation(`${city}, ${state}`);
          } catch (err) {
            console.error("Error fetching location details:", err);
            setLocation("");
          }
        },
        (err) => {
          console.warn("Location access denied:", err);
          setLocation("");
        }
      );
    }
  }, [isManualLocation, location, MyCity]);

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    setIsManualLocation(!!value);
  };

  const handleBookNow = () => {
    const serviceName = selectedService.split("/").pop();
    let vendors = serviceDataMap[serviceName];

    vendors = vendors.filter(
      (vendor) =>
        vendor.location?.toLowerCase().replace(/\s/g, "") ===
        BookingCity.toLowerCase().replace(/\s/g, "")
    );
    console.log(vendors.length);
    if (vendors.length <= 0) {
      alert("😔 No services available in your selected location");
      // setchatopenStatus=true;
         dispatch(openChatbox());
    } else {
      console.log(selectedService);
      navigate(selectedService, {
        state: { location: location, BookingCities: BookingCity },
      });
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
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full bg-transparent focus:outline-none font-semibold text-white placeholder-gray-500 border-b border-gray-600 pb-1 cursor-pointer relative z-10"
            >
              {services.map((service, idx) => (
                <option
                  key={idx}
                  value={service.link}
                  className="bg-[#2c2d34] text-white"
                >
                  {service.title}
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
                <option key={index} value={city} className="text-black">
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Divider */}

        {/* Location Input */}
        <div className="w-full md:flex-1 flex items-center relative">
          <div className="w-full">
            <input
              type="text"
              id="location"
              placeholder="City, State"
              value={location}
              onChange={handleLocationChange}
              className="w-full bg-transparent focus:outline-none font-semibold text-white placeholder-gray-500 relative z-10"
            />
          </div>
        </div>
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
