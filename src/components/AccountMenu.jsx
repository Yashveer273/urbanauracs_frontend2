import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, selectUserHistory,logoutUser } from "../store/userSlice";
import {
  FaUserCircle,
  FaEnvelope,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaSignOutAlt,
  FaGlobe,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";
import { clearCart } from "../store/CartSlice";

const AccountMenu = () => {
  const [open, setOpen] = useState(false);

  const user = useSelector(selectUser);
  const history = useSelector(selectUserHistory);
const dispatch = useDispatch();
  const firstLetter = user?.username
    ? user.username.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  return (
    <>
      {/* Avatar Button */}
      <div
        onClick={() => setOpen(true)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f87559] text-white font-bold cursor-pointer hover:scale-105 transition"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          firstLetter
        )}
      </div>

      {/* Centered Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-[400px] max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn flex flex-col">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#f87559] to-orange-500 text-white p-6 flex flex-col items-center">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-[#f87559] text-4xl font-bold shadow-md mb-3 border-4 border-white">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <FaUserCircle className="text-[#f87559] text-5xl" />
                )}
              </div>

              <h2 className="text-xl font-semibold">
                {user?.username || "Guest"}
              </h2>
              <p className="text-sm text-orange-100 flex items-center gap-1">
                <FaEnvelope className="text-orange-200" />
                {user?.email || "No email provided"}
              </p>

              {/* Close Button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-4 text-white text-2xl hover:text-gray-200 font-bold"
              >
                ×
              </button>
            </div>

            {/* User Info */}
            <div className="px-6 py-4 bg-gray-50 border-b space-y-2 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <FaMobileAlt className="text-[#f87559]" />
                <span className="font-semibold">Mobile:</span>{" "}
                {user?.mobileNumber || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#f87559]" />
                <span className="font-semibold">Location:</span>{" "}
                {user?.location || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-[#f87559]" />
                <span className="font-semibold">Pincode:</span>{" "}
                {user?.pincode || "N/A"}
              </p>
              <p className="flex items-center gap-2">
                <FaGlobe className="text-[#f87559]" />
                <span className="font-semibold">Country Code:</span>{" "}
                {user?.countryCode || "N/A"}
              </p>
            </div>

            {/* Purchase History */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
              <h3 className="text-gray-800 font-semibold text-sm mb-2 flex items-center gap-2">
                <FaClock className="text-[#f87559]" /> Purchase History
              </h3>

              {history && history.length > 0 ? (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 mb-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={item.serviceImage}
                        alt={item.title}
                        className="w-16 h-16 rounded-md object-cover border"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {item.description}
                        </p>

                        <div className="flex justify-between items-center mt-2 text-xs">
                          <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-700 flex items-center gap-1">
                            <FaCalendarAlt className="text-gray-500" />
                            {item.bookingDate || "Not selected"}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full font-semibold flex items-center gap-1 ${
                              item.statusColor === "blue"
                                ? "bg-blue-100 text-blue-700"
                                : item.statusColor === "green"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.statusColor === "green" ? (
                              <FaCheckCircle />
                            ) : item.statusColor === "blue" ? (
                              <FaClock />
                            ) : (
                              <FaTimesCircle />
                            )}
                            {item.status}
                          </span>
                        </div>
                        <div className="text-right font-bold text-gray-900 mt-1">
                          ₹{item.price}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 py-8 text-sm">
                  No purchase history found.
                </div>
              )}
            </div>

            {/* Footer */
        user?.username?   ( <div className="p-4 border-t bg-gray-100 text-center">
              <button
                onClick={() => {
                     dispatch(logoutUser())
                     dispatch(clearCart())
                  setOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#f87559] hover:bg-[#e65a3f] text-white py-2 rounded-lg font-semibold transition"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>):(<></>)}
          </div>
        </div>
      )}
    </>
  );
};

export default AccountMenu;
