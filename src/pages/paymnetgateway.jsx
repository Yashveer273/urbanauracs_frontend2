import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOrder } from "../store/orderSlices";
import { selectUser } from "../store/userSlice";


const PaymentGateway = () => {
  const scrollRef = useRef(null);

  const location = useLocation();
  const { date, total_price, } = location.state || {};
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [message, setMessage] = useState(null);

  

  // ✅ Handle Payment
  const handlePayment = async (advance, status, left_amount,oGtotal_price,total_price) => {
    if (!user?.username || !user?.mobileNumber) {
      setMessage({ type: "error", text: "❌ Missing user details or amount!" });
      return;
    }

    const orderId = `TXN_${user.mobileNumber}_${date}`;
    const data = {
      name: user.username,
      mobileNumber: user.mobileNumber,
      advance,
      left_amount,
      oGtotal_price,
      total_price,
      status,
      date,
      orderId,
    };

    try {
      
      if ( status !== "CoD") {
      const response = await axios.post(
        "http://localhost:8000/create-order",
        data
      );
      const { url } = response.data;

      if (url ) {
        dispatch(setOrder(data));
        window.location.href = url;
      }  else {
        setMessage({
          type: "error",
          text: "❌ Payment initialization failed!",
        });
      }
    }else{const response = await axios.post(
        "http://localhost:8000/create-case-on-delivery",
        data
      );
      const { url } = response.data;

     if (status === "CoD") {
       window.location.href = url;
        dispatch(setOrder(data));
        setMessage({
          type: "success",
          text: "✅ Order placed! Pay on delivery.",
        });
      } else {
        setMessage({
          type: "error",
          text: "❌ Payment initialization failed!",
        });
      }}
    } catch (error) {
      console.error("❌ Error in payment:", error);
      setMessage({
        type: "error",
        text: "Something went wrong! Please try again.",
      });
    }
  };

  // ✅ GST Breakdown
  const base = Number(total_price) || 0;
  const gst18 = Math.round(base * 0.09);
  const gst25 = Math.round(base * 0.25);
  const delivery = 0;
  const total = base + gst18 +gst25 + delivery - discount;
  const advance = Math.round(total * 0.1);

  // ✅ Coupon Handling
  const verifyCoupon = async (selectedCoupon) => {
    const code = selectedCoupon || coupon;
    if (!code) {
      setMessage({ type: "error", text: "Please enter or select a coupon!" });
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/api/coupons/${code}`);
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
          text: `🎉 ${data.coupon.code} applied - ₹${discountAmount} savings`,
        });
        setCoupon("");

        setTimeout(() => {
          setAppliedCoupon(null);
          setMessage(null);
          setCoupon("");
        }, 3000);
      } else {
        setDiscount(0);
        setAppliedCoupon(null);
        setMessage({ type: "error", text: data.message || "Invalid coupon" });
      }
    } catch (error) {
      console.error("Error verifying coupon:", error);
      setMessage({ type: "error", text: "Server error. Try again later." });
    }
    // ✅ catch case me bhi reset daal do
    setTimeout(() => {
      setAppliedCoupon(null);
      setMessage(null);
      setCoupon("");
    }, 3000);
  };

  const removeCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setMessage(null);
    setCoupon("");
  };
    const [coupons, setCoupons] = useState([]);
  const fetchCoupons = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/Allcoupons");
      setCoupons(res.data.coupons || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setMessage({ type: "error", text: "Failed to load coupons" });
    }
  };
  useEffect(() => {
fetchCoupons();
    const el = scrollRef.current;
    // eslint-disable-next-line no-unused-vars
    let scrollAmount = 0;

    const interval = setInterval(() => {
      if (!el) return;
      if (window.innerWidth >= 640) {
        // Desktop: horizontal scroll
        el.scrollLeft += 1;
        scrollAmount += 1;
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
          el.scrollLeft = 0; // loop
        }
      } else {
        // Mobile: vertical scroll
        el.scrollTop += 1;
        scrollAmount += 1;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
          el.scrollTop = 0; // loop
        }
      }
    }, 30); // speed (lower = faster)

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="font-sans">
      <div className="bg-white min-h-screen shadow-lg p-4 sm:p-6 md:p-10 w-full">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
          Payment Summary
        </h2>

        {message && (
          <div
            className={`p-3 rounded-lg text-xs sm:text-sm font-semibold shadow-md mb-4 sm:mb-6 ${
              message.type === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-6 sm:mt-10 mb-6 sm:mb-10 space-y-3 sm:space-y-5 text-gray-700 text-base sm:text-lg">
          <p>Item Total: ₹{base}</p>
          <p>Taxes and Fee 9%: ₹{gst18}</p>
          <p>Service Charge 25%: ₹{gst25}</p>

          {discount > 0 && (
            <p className="text-green-600 font-semibold">
              Coupon Discount: -₹{discount}
            </p>
          )}
        </div>

        <div className="border-t pt-4 mt-4 sm:mt-6 text-lg sm:text-xl font-bold text-gray-900">
          Grand Total: ₹{total}
        </div>
        <p className="text-[#f87559] font-semibold mt-2 text-sm sm:text-base">
          Advance Booking (10%): ₹{advance}
        </p>

        {/* Coupon Section */}
        {!appliedCoupon && (
          <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-10">
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-stretch sm:items-center">
              <div className="flex items-center space-x-2 flex-1">
                {/* <FaTag className="text-[#f87559] text-xl sm:text-2xl" /> */}
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter Coupon Code"
                  className="flex-1 p-2 border rounded-lg text-sm sm:text-base"
                />
              </div>
              <button
                onClick={() => verifyCoupon(coupon)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm sm:text-base"
              >
                Verify
              </button>
            </div>

           
              <div
                ref={scrollRef}
                className="
        relative overflow-auto 
        h-50 sm:h-auto 
        scrollbar-hide
      "
              >
                <div
                  className="
          flex sm:flex-row flex-col 
          sm:space-x-6 space-y-4
          items-center sm:items-start
          py-2 mt-4
        "
                >
                  {coupons.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => setCoupon(c.code)}
                      className="min-w-[260px] sm:min-w-[200px] p-4 pl-8 bg-gray-800 
                       rounded-xl shadow cursor-pointer hover:scale-105 hover:shadow-lg transition-transform"
                    >
                      <div className="flex items-center space-x-2">
                        
                        <p className="font-bold text-[#f87559] text-sm sm:text-base">
                          {c.code}
                        </p>
                      </div>
                      <p className="text-xs sm:text-sm text-white">
                       
                           {c.discount}% OFF
                         
                      </p>
                      <p className="text-xs text-red-500">Exp: {c.expiry}</p>
                    </div>
                  ))}
                </div>
              </div>
          

            
          </div>
        )}

        {appliedCoupon && (
          <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200 mt-4 sm:mt-6 text-sm sm:text-base">
            <span className="text-green-700 font-semibold">
              {appliedCoupon} applied - ₹{discount} savings
            </span>
            <button
              onClick={removeCoupon}
              className="text-red-500 font-bold text-sm sm:text-base"
            >
              Remove
            </button>
          </div>
        )}

        {/* ✅ Payment Buttons Fixed */}
        <div className="mt-6 sm:mt-3 space-y-4 sm:space-y-6">
          <div className="flex justify-center">
            <button
              onClick={() =>
                handlePayment(
                  advance - discount,
                  "Pay Advance",
                  total - advance,
                  total,
                  total-discount
                )
              }
              className="w-full sm:w-auto px-6 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-[#4caf50] to-[#43a047] rounded-lg shadow-lg hover:from-[#43a047] hover:to-[#4caf50] transition-all duration-300"
            >
              Pay Advance ₹{advance - discount}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-6 sm:px-12 py-3 sm:py-4 text-sm sm:text-base font-bold text-white bg-gray-400 rounded-lg shadow-md hover:bg-gray-500 transition-all duration-300"
            >
              Cancel
            </button>

            <button
              onClick={() =>
                handlePayment(0, "CoD", total - discount, total,total - discount)
              }
              className="w-full sm:w-auto px-6 sm:px-12 py-3 sm:py-4 text-sm sm:text-base font-bold text-white bg-gradient-to-r from-[#f87559] to-[#f8594b] rounded-lg shadow-md hover:from-[#f8594b] hover:to-[#f87559] transition-all duration-300"
            >
              Cash on delivery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
