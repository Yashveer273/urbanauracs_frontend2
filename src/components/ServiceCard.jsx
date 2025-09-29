import React, { useState } from 'react';
import { FaStar, FaClock, FaTicketAlt, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, setAuthPopupOpen, selectIsAuthenticated,toggleCart } from '../store/CartSlice';
import './ServiceCard.css';
import BookingPopup from './BookingPopup';


const ServiceDetailPopup = ({ service, onClose,vendor }) => {
  const dispatch = useDispatch();
  
  const handleAddToCart = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) {
    dispatch(setAuthPopupOpen(true));
  } else {
   dispatch(addItem({
   ...service,
   
   vendorId: vendor.vendorId,
   vendorName: vendor.vendorName,
   vendorLocation: vendor.location,
   vendorImage: vendor.vendorImage,
 }));
    console.log("✅ Added to cart:", service);
  }
};


  if (!service) return null;

  return (
   <div className="fixed inset-0 z-50 flex items-start justify-center p-16">
  {/* Transparent overlay */}
  <div
    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
    onClick={onClose}
  ></div>

  {/* Popup container with gap below navbar */}
  <div className="relative w-full h-[50vh] md:h-[70vh] max-w-6xl overflow-hidden rounded-2xl bg-gray-800 text-gray-200 shadow-2xl transition-all duration-300 mt-[120px]">
    {/* Close button */}
    <button
      className="absolute top-3 right-3 z-10 text-gray-400 hover:text-white transition-colors"
      onClick={onClose}
    >
      <FaTimes size={28} />
    </button>

    <div className="flex h-full flex-col md:flex-row">
      {/* Left image */}
      <div className="flex-1 md:w-1/2">
        <img
          src={service.serviceImage}
          alt={service.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right content with scroll */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 md:p-6 overflow-y-auto custom-scroll">
          <h2 className="text-2xl font-bold text-white mb-2">{service.title}</h2>
          <p className="text-sm text-gray-400 mb-4">{service.description}</p>

          <div className="flex items-center space-x-6 text-xs text-gray-400 mb-4">
            <span className="flex items-center">
              <FaStar className="text-yellow-400 mr-1" />
              {service.rating} ({service.reviews} reviews)
            </span>
            <span className="flex items-center">
              <FaClock className="text-gray-400 mr-1" />
              {service.duration}
            </span>
          </div>

          <div className="mb-6 p-3 bg-gray-700 rounded-xl">
            <p className="text-2xl font-bold text-white">
              ₹{service.price}
              <span className="text-xs line-through text-gray-400 ml-2 font-normal">
                ₹{service.originalPrice}
              </span>
            </p>
            <div className="mt-1 text-xs font-semibold text-red-400">
              ₹{service.originalPrice - service.price} Instant off. Upto 20% off on checkout. Use NAKODA2024
            </div>
          </div>

          {/* Inclusions */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-1">Inclusions:</h3>
            <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 ml-4">
              {(service.inclusions || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-1">Exclusions:</h3>
            <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 ml-4">
              {(service.exclusions || []).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Vendor */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-1">Vendor:</h3>
            <p className="text-gray-300 text-sm">Perfect Urban Services</p>
          </div>
        </div>

        {/* Add to cart button */}
        <div className="p-4 border-t border-gray-700">
          <button
            className="w-full py-3 rounded-xl font-bold text-sm text-white bg-[#f87559] hover:bg-[#ff8f6e] transition-colors"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

// --- Frosted Button Component ---
const FrostedActionButton = ({ label, icon: Icon, onClick }) => (
  <div className="frosted-action-group" onClick={onClick}>
    {label && <span className="btn-text">{label}</span>}
    {Icon && (
      <span className="btn-icon-wrapper">
        <Icon className="btn-icon" />
      </span>
    )}
  </div>
);

// --- Price Tag Component ---
const PriceTag = ({ price, originalPrice }) => (
  <div className="price-tag">
    <span className="new-price">₹{price}</span>
    <span className="old-price">₹{originalPrice}</span>
  </div>
);



const ServiceCard = ({ service,vendor,userLocation }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Existing details popup (unchanged)
  const [isPopupOpen, setIsPopupOpen] = useState(false);
const [Devicelocation, setDevicelocation] = useState("");
  // New booking popup state
  const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false);

  // Show login if not authenticated; otherwise open booking calendar
  const handleAddToCart = () => {
    // Be robust to either key your app might set
    const currentUser =
      JSON.parse(localStorage.getItem("currentUser") || "null") ||
      JSON.parse(localStorage.getItem("userData") || "null");

    if (!currentUser && !isAuthenticated) {
      // Not logged in → open auth popup
      dispatch(setAuthPopupOpen(true));

      // Optional: remember what user intended (so you can re-open booking after login)
      // localStorage.setItem("pendingService", JSON.stringify(service));
      return;
    }

    // Logged in → open booking popup (do NOT add to cart yet)
    setIsBookingPopupOpen(true);
  };

  // Confirm from booking popup → now add to cart with the selected date
    const handleConfirmBooking = (selectedDate,selectedTime,address) => {
   
    if ("geolocation" in navigator) {
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
            setDevicelocation(`${city}, ${state}`);
          } catch (err) {
            console.error("Error fetching location details:", err);
            setDevicelocation(userLocation);
          }
        },
        (err) => {
          console.warn("Location access denied:", err);
          setDevicelocation("");
        }
      );
    }
   
   dispatch(addItem({
     ...service,
     roductId:service.id,
     bookingDate: selectedDate,
     vendorId: vendor.vendorId,
     bookingAddress:address,
     deviceLocation:Devicelocation,
     SelectedServiceTime: selectedTime,
     vendorName: vendor.vendorName,
     vendorLocation: vendor.location,
     vendorImage: vendor.vendorImage,
   }));
    dispatch(toggleCart());
  
    setIsBookingPopupOpen(false);
  };



  const handleViewDetails = () => setIsPopupOpen(true);
  const handleCloseDetails = () => setIsPopupOpen(false);

  return (
    <>
      <div className="service-card">
        <div className="image-container">
          <img
            src={service.serviceImage}
            alt={service.title}
            className="service-image"
          />

          <div className="frosted-overlay">
            <div className="service-header">
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
            </div>

            <div className="hover-actions">
              <button className="add-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>

              <FrostedActionButton
                label="View Details"
                customClass="view-detail-btn"
                onClick={handleViewDetails}
              />
            </div>
          </div>
        </div>

        <div className="service-meta">
          <div className="meta-left">
            <div className="rating-duration">
              <span className="rating">
                <FaStar className="star-icon" />
                {service.rating} • {service.reviews} reviews
              </span>
              <span className="duration">
                <FaClock className="clock-icon" /> {service.duration}
              </span>
            </div>

            <PriceTag
              price={service.price}
              originalPrice={service.originalPrice}
            />
          </div>

          <div className="meta-right">
            <FrostedActionButton
              label="Book Now"
              icon={FaTicketAlt}
              customClass="book-now-btn"
              onClick={handleAddToCart}
            />
          </div>
        </div>
      </div>

      {/* Existing details popup (unchanged) */}
      {isPopupOpen && (
        <ServiceDetailPopup service={service} onClose={handleCloseDetails} vendor={vendor} />
      )}

      {/* New booking popup (opens only after login) */}
      {isBookingPopupOpen && (
        <BookingPopup
          onClose={() => setIsBookingPopupOpen(false)}
          onConfirm={handleConfirmBooking}
          
        />
      )}
    </>
  );
};

export default ServiceCard;