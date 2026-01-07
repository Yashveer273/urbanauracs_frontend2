import React, { useState } from "react";
import { FaStar, FaClock, FaTicketAlt, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  setAuthPopupOpen,
  selectIsAuthenticated,
  toggleCart,
} from "../store/CartSlice";
import "./ServiceCard.css";
import BookingPopup from "./BookingPopup";

import { selectUser } from "../store/userSlice";
import { ServiceDetailPopup } from "./serviceDetail.Popup";


// --- Frosted Button Component ---
const FrostedActionButton = ({ label, onClick }) => (
  <div className="frosted-action-group cursor-pointer" onClick={onClick}>
    {label && <span className="btn-text">{label}</span>}
  </div>
);

// --- Price Tag Component ---
const PriceTag = ({ price, originalPrice }) => (
  <div className="price-tag">
    <span className="new-price">₹{price}</span>
    <span className="old-price">₹{originalPrice}</span>
  </div>
);

const ServiceCard = ({ service, vendor, userLocation }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const user = useSelector(selectUser);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

const [imageLoaded, setImageLoaded] = useState(false);
  // const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false);
 

  const handleAddToCart = () => {
    console.log(user.length < 1);
    if (user.length < 1 && !isAuthenticated) {
      // Not logged in → open auth popup
      dispatch(setAuthPopupOpen(true));

      return;
    }
 dispatch(
      addItem({
        ...service,
        roductId: service.id,
        bookingDate: "",
        vendorId: vendor.vendorId,
        bookingAddress: "",
        SelectedServiceTime: "",
        vendorName: vendor.vendorName,
        vendorLocation: vendor.location,
        vendorImage: vendor.vendorImage,
      })
    );
    dispatch(toggleCart());
    // setIsBookingPopupOpen(true);
  };

  // const handleConfirmBooking = (selectedDate, selectedTime, address) => {

   

  //   dispatch(
  //     addItem({
  //       ...service,
  //       roductId: service.id,
  //       bookingDate: selectedDate,
  //       vendorId: vendor.vendorId,
  //       bookingAddress: address,
   
  //       SelectedServiceTime: selectedTime,
  //       vendorName: vendor.vendorName,
  //       vendorLocation: vendor.location,
  //       vendorImage: vendor.vendorImage,
  //     })
  //   );
  //   dispatch(toggleCart());

  //   setIsBookingPopupOpen(false);
  // };

  const handleViewDetails = () => setIsPopupOpen(true);
  const handleCloseDetails = () => setIsPopupOpen(false);

  return (
    <>
   <div className="maingridbox"> <div className="">
         <div className="half-image">
          {!imageLoaded && <div className="image-skeleton" />}

          <img
            src={service.serviceImage}
            alt={service.title}
            className={`service-image ${imageLoaded ? "loaded" : ""}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        </div>

         
          <div className="mt-3">
            <div className="service-header">
              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>
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
              <PriceTag
                price={service.price}
                originalPrice={service.originalPrice}
              />
            </div>
          </div>
        </div>
        <div className="meta-right gap-6">
          <FrostedActionButton
            label="Add To Cart"
            icon={FaTicketAlt}
            customClass="book-now-btn"
            onClick={handleAddToCart}
          />
          <button
            className="add-cart-btn cursor-pointer"
            onClick={handleViewDetails}
          >
            View Details
          </button>
        </div></div>
       
   

      {/* Existing details popup (unchanged) */}
      {isPopupOpen && (
        <ServiceDetailPopup
          service={service}
          userLocation={userLocation}
          onClose={handleCloseDetails}
          vendor={vendor}
        />
      )}

      {/* New booking popup (opens only after login) */}
      {/* {isBookingPopupOpen && (
        <BookingPopup
          onClose={() => setIsBookingPopupOpen(false)}
          onConfirm={handleConfirmBooking}
        />
      )} */}
    </>
  );
};

export default ServiceCard;
