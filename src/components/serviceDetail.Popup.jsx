 
 import React from "react";
import { FaStar, FaClock, FaTicketAlt, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addItem,
  setAuthPopupOpen,
  selectIsAuthenticated,
  toggleCart,
} from "../store/CartSlice";
import "./ServiceCard.css";


import { selectUser } from "../store/userSlice";


 export const ServiceDetailPopup = ({ service, onClose, vendor }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser); // ✅ gets current user state
   
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // const [Devicelocation, setDevicelocation] = useState("");
  
  // const [isBookingPopupOpen, setIsBookingPopupOpen] = useState(false);
   const handleAddToCart = () => {
  

    console.log(user.length < 1);
    if (user.length < 1 && !isAuthenticated) {
      // Not logged in → open auth popup
      dispatch(setAuthPopupOpen(true));

      // Optional: remember what user intended (so you can re-open booking after login)
      // localStorage.setItem("pendingService", JSON.stringify(service));
      return;
    }

    // Logged in → open booking popup (do NOT add to cart yet)
    // setIsBookingPopupOpen(true);
       dispatch(
      addItem({
        ...service,
        roductId: service.id,
        bookingDate: "",
        vendorId: vendor.vendorId,
        bookingAddress: "address",
   
        SelectedServiceTime: "selectedTime",
        vendorName: vendor.vendorName,
        vendorLocation: vendor.location,
        vendorImage: vendor.vendorImage,
      })
    );
    dispatch(toggleCart());
    onClose();
  };

  // Confirm from booking popup → now add to cart with the selected date
  // const handleConfirmBooking = (selectedDate, selectedTime, address) => {
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       async (pos) => {
  //         const { latitude, longitude } = pos.coords;
  //         try {
  //           const res = await fetch(
  //             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
  //           );
  //           const data = await res.json();
  //           const city =
  //             data.address.city ||
  //             data.address.town ||
  //             data.address.village ||
  //             "";
  //           const state = data.address.state || "";
  //           setDevicelocation(`${city}, ${state}`);
  //         } catch (err) {
  //           console.error("Error fetching location details:", err);
  //           setDevicelocation(userLocation);
  //         }
  //       },
  //       (err) => {
  //         console.warn("Location access denied:", err);
  //         setDevicelocation("");
  //       }
  //     );
  //   }

  //   dispatch(
  //     addItem({
  //       ...service,
  //       roductId: service.id,
  //       bookingDate: selectedDate,
  //       vendorId: vendor.vendorId,
  //       bookingAddress: address,
  //       deviceLocation: Devicelocation,
  //       SelectedServiceTime: selectedTime,
  //       vendorName: vendor.vendorName,
  //       vendorLocation: vendor.location,
  //       vendorImage: vendor.vendorImage,
  //     })
  //   );
  //   dispatch(toggleCart());

  //   setIsBookingPopupOpen(false);
  // };


  return (
    <>
      {/* Fade animation */}
      <style>
        {`
      .popup-fade {
        opacity: 0;
        transform: translateY(20px);
        animation: popupFade 0.35s ease-out forwards;
      }

      @keyframes popupFade {
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      `}
      </style>

      <div className="fixed inset-0 z-50 pt-40 flex items-center justify-center px-4 sm:px-8">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Popup */}
        <div className="popup-fade relative w-full max-w-4xl max-h-[75vh]  overflow-y-scroll rounded-2xl bg-gray-800 text-gray-200 shadow-2xl">
          {/* Close button */}
          <button
            className="absolute top-3 right-3 z-10 text-gray-400 hover:text-white transition-colors"
            onClick={onClose}
          >
            <FaTimes size={28} />
          </button>

          <div className="flex h-full flex-col md:flex-row">
            <div className="h-130 md:h-full md:w-1/2 flex-shrink-0">
              <img
                src={service.serviceImage}
                alt={service.title}
                className="h-130 w-full object-cover"
              />
            </div>

            <div className=" h-130 overflow-y-scroll md:w-1/2 flex flex-col ">
              <div className="flex-1 p-4 md:p-6 custom-scroll">
                <h2 className="text-xl md:text-2xl font-bold mb-2">
                  {service.title}
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  {service.description}
                </p>

                <div className="flex items-center space-x-4 text-xs text-gray-400 mb-4">
                  <span className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    {service.rating} ({service.reviews} reviews)
                  </span>
                  <span className="flex items-center">
                    <FaClock className="text-gray-400 mr-1" />
                    {service.duration}
                  </span>
                </div>

                <div className="mb-6 p-3 bg-yellow-500 rounded-xl inline-block">
  <p className="text-xl md:text-2xl font-bold text-black flex items-center gap-3">
    
    {/* Final Price */}
    ₹{service.price}

    {/* Original Price with strikethrough */}
    <span className="text-gray-700 text-lg md:text-xl line-through">
      ₹{service.originalPrice}
    </span>

  </p>
</div>


                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Inclusions:
                  </h3>
                  <ul className="list-disc list-outside text-gray-300 text-sm space-y-1 ml-6 pl-2">
                    {(service.inclusions || []).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Exclusions:
                  </h3>{" "}
                  {/* Change list-inside to list-outside and adjust ml/pl */}
                  <ul className="list-disc list-outside text-gray-300 text-sm space-y-1 ml-6 pl-2">
                    {(service.exclusions || []).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Vendor:{" "}
                    {vendor.vendorName === "self"
                      ? "Urban Aura Services"
                      : vendor.vendorName}
                  </h3>
                </div>
              </div>

              <div className="p-4 border-t border-gray-700 flex-shrink-0">
                <button
                  className=" cursor-pointer w-full py-3 rounded-xl font-bold text-sm text-white bg-[#f87559] hover:bg-[#ff8f6e] transition-colors"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {isBookingPopupOpen && (
        <BookingPopup
          onClose={() => setIsBookingPopupOpen(false)}
          onConfirm={handleConfirmBooking}
        />
      )} */}
    </>
  );
};