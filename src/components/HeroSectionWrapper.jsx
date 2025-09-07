import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, Phone, Menu, X, ChevronRight, Wind, Sun, Droplets, Sparkles, Map } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import VendorSection from "./VendorSection";
import ServiceCard from "./ServiceCard";
import ViewAllPopup from "./ViewAllPopup";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
const services = [
    { title: "Full Home Cleaning", image: "/images/home_cleaning copy.jpg", link: "/services/full-home-cleaning" },
    { title: "AC Repair Service", image: "/images/ac_repair.jpg", link: "/services/ac-repair" },
    { title: "Cleaning Service", image: "/images/cleaning_service.jpg", link: "/services/cleaning" },
    { title: "Commercial Cleaning", image: "/images/commercial.jpg", link: "/services/commercial-cleaning" },
    { title: "Pest Control", image: "/images/pest_control.jpg", link: "/services/pest-control" },
    { title: "Carpenter", image: "/images/carpenter.jpg", link: "/services/carpenter" },
    { title: "Home Painting", image: "/images/home_painting.jpg", link: "/services/home-painting" },
    { title: "Plumber", image: "/images/plumber.jpg", link: "/services/plumber" },
    { title: "Electrician", image: "/images/electrician.jpg", link: "/services/electrician" },
    { title: "Balloon Decoration", image: "/images/balloon_decoration.jpg", link: "/services/balloon-decoration" },
];
 const images = [
    {
      src: "https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg",
      alt: "Clean living room",
    },
    {
      src: "https://images.pexels.com/photos/713297/pexels-photo-713297.jpeg",
      alt: "Cleaning supplies",
    },
    {
      src: "https://images.pexels.com/photos/6186813/pexels-photo-6186813.jpeg",
      alt: "Happy client",
    },
  ];

const HeroSectionWrapper = () => {
    const [showServices, setShowServices] = useState(false);
    const [filteredVendors, setFilteredVendors] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
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
                <HeroSection onShowServices={handleShowServices} />
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

const HeroSection = ({ onShowServices }) => {
    const heroRef = useRef(null);
    

    return (
        <section
            ref={heroRef}
            className="relative bg-[#15171f] pt-16 pb-10 px-6 overflow-hidden rounded-3xl shadow-lg"
        >
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mt-28 md:mt-22">
     <div>
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="rounded-2xl shadow-lg"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-[400px] md:h-[500px] object-cover rounded-2xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
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
                    <BookingForm onShowServices={onShowServices} />
                </motion.div>

           
            </div>
        </section>
    );
};

const BookingForm = () => {
    const [location, setLocation] = useState("");
    const [isManualLocation, setIsManualLocation] = useState(false);
    const [selectedService, setSelectedService] = useState(services[0].link);
    const navigate = useNavigate();


     useEffect(() => {
        if ("geolocation" in navigator && !isManualLocation && !location) {
            navigator.geolocation.getCurrentPosition(
                async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    try {
                        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                        const data = await res.json();
                        const city = data.address.city || data.address.town || data.address.village || "";
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
    }, [isManualLocation, location]);

    const handleLocationChange = (e) => {
        const value = e.target.value;
        setLocation(value);
        setIsManualLocation(!!value);
    };

    const handleBookNow = () => {
        navigate(selectedService, { state: { location: location } });
    };

    return (
        <motion.div
            className="mt-8 bg-[#2c2d34] p-4 rounded-xl shadow-lg border border-gray-700 flex flex-col gap-4 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-full md:flex-1 flex items-center">
                    <div className="w-full">
                        <label htmlFor="service" className="text-xs text-gray-400">
                            Select
                        </label>
                        <select
                            id="service"
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            className="w-full bg-transparent focus:outline-none font-semibold text-white appearance-none"
                        >
                            {services.map((service, idx) => (
                                <option
                                    key={idx}
                                    value={service.link}
                                    className="bg-[#2c2d34]"
                                >
                                    {service.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="w-full h-px md:w-px md:h-10 bg-gray-600"></div>
                <div className="w-full md:flex-1 flex items-center">
                    <MapPin className="text-gray-400 mr-3" size={22} />
                    <div className="w-full">
                        <label htmlFor="location" className="text-xs text-gray-400">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            placeholder="City, State"
                            value={location}
                            onChange={handleLocationChange}
                            className="w-full bg-transparent focus:outline-none font-semibold text-white placeholder-gray-500"
                        />
                    </div>
                </div>
            </div>
            <button
                onClick={handleBookNow}
                className="w-full bg-[#f87559] text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-500 transition-all duration-300 flex items-center justify-center gap-2"
            >
                Book Now <ChevronRight size={20} />
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
                        😔 No services available in {selectedLocation || 'the selected location'}. Please try another location.
                    </div>
                </div>
            </motion.section>
        );
    }
    
    const vendors = filteredVendors.reduce((acc, vendor) => {
        const existingVendor = acc.find(v => v.vendorName === vendor.vendorName);
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

// // Service Filter Bar
// const ServiceFilterBar = ({ setShowServices }) => {
//     const [search, setSearch] = useState("");
//     const [kind, setKind] = useState("");
//     const [place, setPlace] = useState("");
//     const [date, setDate] = useState("");

//     const handleChange = (e) => {
//         const selectedDate = e.target.value;
//         if (selectedDate) {
//             setDate(selectedDate); // Only update if a valid date is selected
//         }
//     };
//     const resetFilters = () => {
//         setShowServices(false);
//         setSearch("");
//         setKind("");
//         setPlace("");
//         setDate("");
//     };

//     return (
//         <div className="bg-[#12131a] text-white py-4 px-4 md:px-8 rounded-xl mt-12 shadow-lg flex flex-col md:flex-row gap-4 items-center justify-center container mx-auto border border-gray-800">
//             <div className="flex items-center bg-[#2c2d34] rounded-lg px-4 py-2 w-full md:w-1/3">
//                 <Search className="mr-2 text-gray-400" size={18} />
//                 <input
//                     type="text"
//                     placeholder="Search for a service..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="bg-transparent text-white placeholder-gray-400 focus:outline-none w-full"
//                 />
//             </div>
//             <select
//                 value={kind}
//                 onChange={(e) => setKind(e.target.value)}
//                 className="bg-[#2c2d34] text-white px-4 py-2 rounded-lg w-full md:w-auto"
//             >
//                 <option value="" className="bg-[#2c2d34]">
//                     Full AC Cleaning
//                 </option>
//                 <option value="home" className="bg-[#2c2d34]">
//                     AC Pine Cleaning
//                 </option>
//                 <option value="deep" className="bg-[#2c2d34]">
//                     AC repairing
//                 </option>
//                 <option value="window" className="bg-[#2c2d34]">
//                     Micro Cleaning Part in ac
//                 </option>
//             </select>
//             <select
//                 value={place}
//                 onChange={(e) => setPlace(e.target.value)}
//                 className="bg-[#2c2d34] text-white px-4 py-2 rounded-lg w-full md:w-auto"
//             >
//                 <option value="" className="bg-[#2c2d34]">
//                     Place
//                 </option>
//                 <option value="nyc" className="bg-[#2c2d34]">
//                     City1 in haryana
//                 </option>
//                 <option value="la" className="bg-[#2c2d34]">
//                     City2 in haryana
//                 </option>
//             </select>
//             <div className="relative w-full max-w-sm">
//                 {/* Styled Container */}
//                 <div className="bg-[#2c2d34] text-white px-4 py-2 rounded-lg flex items-center gap-2 w-full">
//                     {/* Calendar Icon */}
//                     <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5 text-white"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M8 7V3M16 7V3M4 11h16M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                         />
//                     </svg>

//                     {/* Adaptive Input Field */}
//                     <input
//                         type={date ? "date" : "text"}
//                         value={date}
//                         placeholder="Book your appointment on…"
//                         onChange={(e) => setDate(e.target.value)}
//                         onFocus={(e) => (e.target.type = "date")}
//                         onBlur={(e) => {
//                             if (!e.target.value) e.target.type = "text";
//                         }}
//                         className="bg-transparent text-white placeholder-white focus:outline-none w-full cursor-pointer"
//                     />
//                 </div>
//             </div>
//             <button
//                 onClick={resetFilters}
//                 className="text-gray-400 hover:text-white transition-colors"
//             >
//                 <X size={24} />
//             </button>
//         </div>
//     );
// };
