import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOrder } from "../store/orderSlices";
import { selectUser } from "../store/userSlice";

const PaymentGateway = () => {
  const location = useLocation();
  const { date, total_price } = location.state || {};
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [message, setMessage] = useState(null);

  // ✅ Handle Pay Now
  const handlePayment = async (amount, status, left_amount) => {
    if (!user?.username || !user?.mobileNumber) {
      setMessage({ type: "error", text: "❌ Missing user details or amount!" });
      return;
    }

    const orderId = `TXN_${user.mobileNumber}_${date}`;
    const data = {
      name: user.username,
      mobileNumber: user.mobileNumber,
      amount,
      left_amount,
      status,
      date,
      orderId,
    };

    try {
      const response = await axios.post("https://totaltimesnews.com/create-order", data);
      const { url } = response.data;

      if (url) {
        dispatch(setOrder(data));
        window.location.href = url; // redirect to PhonePe gateway
      } else {
        setMessage({ type: "error", text: "❌ Payment initialization failed!" });
      }
    } catch (error) {
      console.error("❌ Error in payment:", error);
      setMessage({ type: "error", text: "Something went wrong! Please try again." });
    }
  };

  // ✅ GST Breakdown
  const base = Number(total_price) || 0;
  const gst18 = Math.round(base * 0.18);
  const delivery = 0;
  const total = base + gst18 + delivery - discount;
  const advance = Math.round(total * 0.1);

  // ✅ Coupon Handling
  const verifyCoupon = async () => {
    try {
      const res = await fetch(`https://totaltimesnews.com/api/coupons/${coupon}`);
      const data = await res.json();

      if (data.success) {
        const { discount: d, type } = data.coupon;

        let discountAmount = d;
        if (type === "percent") {
          discountAmount = Math.round((total * d) / 100);
        }

        setDiscount(discountAmount);
        setAppliedCoupon(data.coupon.code);
        setMessage({
          type: "success",
          text: `🎉 Coupon applied! Saved ₹${discountAmount}.`,
        });
      } else {
        setDiscount(0);
        setAppliedCoupon(null);
        setMessage({ type: "error", text: data.message || "Invalid coupon" });
      }
    } catch (error) {
      console.error("Error verifying coupon:", error);
      setMessage({ type: "error", text: "Server error. Try again later." });
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setMessage(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md space-y-6">
        <h2 className="text-xl font-bold text-gray-800">Payment Summary</h2>

        {message && (
          <div
            className={`p-3 rounded-lg text-sm font-semibold shadow-md ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <p>Item Total: ₹{base}</p>
        <p>GST @ 18%: ₹{gst18}</p>
        <p>Delivery Charges: ₹{delivery}</p>
        {discount > 0 && (
          <p className="text-green-600 font-semibold">Coupon Discount: -₹{discount}</p>
        )}

        <div className="border-t pt-3 mt-3 text-lg font-bold text-gray-900">
          Total Payable: ₹{total}
        </div>
        <p className="text-blue-600 font-semibold">
          Advance Booking (10%): ₹{advance}
        </p>

        {/* Coupon Input */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Enter Coupon Code"
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            onClick={() => verifyCoupon()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Verify
          </button>
        </div>

        {/* Applied Coupon */}
        {appliedCoupon && (
          <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200">
            <span className="text-green-700 font-semibold">
              {appliedCoupon} applied - ₹{discount} savings
            </span>
            <button onClick={removeCoupon} className="text-red-500 font-bold">
              Remove
            </button>
          </div>
        )}

        {/* Buttons */}
        <button
          onClick={() => handlePayment(total - discount, "Full Amount", 0)}
          className="w-full py-3 text-lg font-bold text-white bg-green-600 rounded-xl shadow-md hover:bg-green-700 transition"
        >
          Pay Full Amount ₹{total - discount}
        </button>

        <button
          onClick={() => handlePayment(advance - discount, "Pay Advance", total - advance)}
          className="w-full py-3 text-lg font-bold text-white bg-orange-500 rounded-xl shadow-md hover:bg-orange-600 transition"
        >
          Pay Advance ₹{advance - discount}
        </button>
      </div>
    </div>
  );
};

export default PaymentGateway;
