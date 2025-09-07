import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeItem, closeCart, selectCartTotal } from "../store/CartSlice";
import { addToHistory } from "../store/userSlice";
import { FaTimes, FaTrash, FaCalendarAlt } from "react-icons/fa";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { items: cartItems, isOpen } = useSelector((state) => state.cart);
  const cartTotal = useSelector(selectCartTotal);
  const navigate = useNavigate();

  const handleRemoveItem = (id) => {
    dispatch(removeItem(id));
  };

  const handleClose = () => {
    dispatch(closeCart());
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    // Convert cart items into history entries (preserve bookingDate if available)
    const newHistoryItems = cartItems.map((item) => ({
      id: Date.now() + Math.random(),
      title: item.title,
      description: item.description,
      price: item.price,
      serviceImage:
        item.serviceImage ||
        "https://via.placeholder.com/80x80.png?text=Service",
      bookingDate: item.bookingDate || "Not selected",
      purchasedOn: new Date().toISOString().split("T")[0],
      status: "processing",
      statusColor: "blue",
    }));

    // Add each cart item to purchase history
    newHistoryItems.forEach((historyItem) => {
      dispatch(addToHistory(historyItem));
    });
    let date = Date.now();
    let total_price = cartTotal.toFixed(2);
    navigate("/PaymentGateway", {
      state: { date, cartItems, total_price },
    });

    // alert("✅ Checkout successful! Your services have been added to history.");
  };

  return (
    <div
      className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg flex flex-col font-sans z-1002 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4 p-6">
        <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
        <button
          className="text-lg text-gray-500 hover:text-gray-700 ml-4"
          onClick={handleClose}
        >
          <FaTimes />
        </button>
      </div>

      {/* Items */}
      <div className="flex-grow overflow-y-auto px-6">
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            Your cart is empty.
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id || item.title}
              className="flex items-center py-4 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-md mr-4">
                <img
                  src={item.serviceImage}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>

                {/* Booking Date */}
                {item.bookingDate && (
                  <div className="flex items-center text-xs text-gray-600 mt-1">
                    <FaCalendarAlt className="mr-1 text-[#f87559]" />
                    <span>Booking Date: {item.bookingDate}</span>
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{item.price}
                  </span>
                  <button
                    className="text-gray-400 hover:text-[#f87559] transition-colors ml-4"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer (Checkout) */}
      {cartItems.length > 0 && (
        <div className="px-6 pt-4 pb-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4 text-lg font-bold">
            <span>Total:</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <button
            className="w-full bg-[#f87559] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#fa8f76]"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
