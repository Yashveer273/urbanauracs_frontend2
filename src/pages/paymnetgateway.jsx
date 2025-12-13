import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOrder } from "../store/orderSlices";
import { selectUser } from "../store/userSlice";
import { API_BASE_URL, handleBuy } from "../API";
import CheckoutSummaryCard from "./CartProductSummery";
import { CheckCircle } from "lucide-react";
import { CalculateGrandTotal } from "../components/TexFee";
import { FaArrowLeft } from "react-icons/fa";

const PaymentGateway = () => {
  const scrollRef = useRef(null);
  const { items: cartItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const { date } = location.state || {};
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [loadingType, setLoadingType] = useState(null);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [message, setMessage] = useState(null);
  const action = async (response, data) => {
    
    const { Url, status } = response.data;

    if (status == "success") {
      dispatch(setOrder(data));
      window.location.href = Url;
    } else {
      setMessage({
        type: "error",
        text: "❌ Payment initialization failed!",
      });
    }
  };
  // ✅ Handle Payment
  const handlePayment = async (
    advance,
    status,
    left_amount,
    oGtotal_price,
    total_price
  ) => {
    if (!user?.username || !user?.mobileNumber) {
      setMessage({ type: "error", text: "❌ Missing user details or amount!" });
      return true;
    }

    const orderId = `${date}`;
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
      discount,
      appliedCoupon
    };

    try {
      if (status !== "CoD") {
        // const response = await axios.post(`${API_BASE_URL}/create-order`, data);

        await handleBuy(data, action);
        return true;
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/create-case-on-delivery`,
          data
        );
        const { url } = response.data;

        if (status === "CoD") {
          window.location.href = url;
          dispatch(setOrder(data));
          setMessage({
            type: "success",
            text: "✅ Order placed! Pay on delivery..",
          });
        } else {
          setMessage({
            type: "error",
            text: "❌ Payment initialization failed!",
          });
          return true;
        }
      }
    } catch (error) {
      console.error("❌ Error in payment:", error);
      setMessage({
        type: "error",
        text: "Something went wrong! Please try again.",
      });
      return true;
    }
  };

  // ✅ Coupon Handling
  const verifyCoupon = async (selectedCoupon) => {
    const code = selectedCoupon || coupon;
    if (!code) {
      setMessage({ type: "error", text: "Please enter or select a coupon!" });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/coupons/${code}`);
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
      const res = await axios.get(`${API_BASE_URL}/api/Allcoupons`);
      setCoupons(res.data.coupons || []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setMessage({ type: "error", text: "Failed to load coupons" });
    }
  };
  useEffect(() => {
    setTotal(CalculateGrandTotal(cartItems));

    setAdvance(Math.round(total * 0.1));
  }, [total, advance]);
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

  }, [discount]);
  const handlePayment2 = (totalAmount) => {
    // Here you would implement actual payment initiation logic
    console.log(`Final payment amount ready to be processed: ₹${totalAmount}`);
  };
  return (
    <>
      <style>
        {`
                
                .total-label {
                    font-size: 1.125rem; /* text-lg */
                    font-weight: 400; /* font-normal */
                    color: #d1d5db; /* gray-300 */
                    display: block;
                }
                .final-total-amount {
                    font-size: 1.5rem; /* text-4xl */
                    font-weight: 800; /* font-extrabold */
                    color: #f97316; /* orange-500 */
                }

                /* Action Button */
                .action-button {
                    width: 100%;
                    padding: 0.75rem 2.5rem; /* px-10 py-3 */
                    background-color: #ea580c; /* orange-600 */
                    color: white;
                    font-weight: 600; /* font-semibold */
                    font-size: 1.25rem; /* text-xl */
                    border-radius: 0.5rem; /* rounded-lg */
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
                    transition: all 0.2s ease-in-out;
                }
                @media (min-width: 640px) { /* sm: */
                    .action-button {
                        width: auto; /* sm:w-auto */
                    }
                }
                .action-button:hover {
                    background-color: #c2410c; /* hover:bg-orange-700 */
                    transform: scale(1.02); /* hover:scale-[1.02] */
                }
                .button-inner {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .button-inner svg {
                    margin-right: 0.5rem;
                }
                `}
      </style>{" "}
      <div className="font-sans">
        <div className="bg-white min-h-screen shadow-lg p-4 sm:p-6 md:p-10 w-full">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-black mb-4"
          >
            <FaArrowLeft /> Back
          </button>
          <div className="flex flex-col gap-5  lg:flex-row lg:space-x-8">
            <CheckoutSummaryCard
              items={cartItems}
              onProceedToPayment={handlePayment2}
            />
            <div className="flex-1 lg:max-w-[720px]">
              {/* Coupon Section */}
              {!appliedCoupon && (
                <div className="space-y-4 sm:space-y-6 mt-6 sm:mt-10">
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 items-stretch sm:items-center">
                    <select
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 p-2 border rounded-lg text-sm sm:text-base bg-white text-black"
                    >
                      <option value="">Select Coupon</option>

                      {coupons.map((c) => (
                        <option
                          key={c.id}
                          value={c.code}
                          style={{
                            backgroundColor: "#2d2d2d", // Dark background
                            color: "#f87559", // Orange text
                          }}
                        >
                          {c.code} — {c.discount}% OFF
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => verifyCoupon(coupon)}
                      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm sm:text-base"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}
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
              <div className="border-t p-2 mt-4 sm:mt-6 text-lg sm:text-xl font-bold text-gray-900">
                {discount > 0 && (
                  <p className="text-green-600 font-semibold">
                    Coupon Discount: -₹{discount}
                  </p>
                )}
              </div>
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

              {/* Payment Buttons */}
              <div className="mt-6 sm:mt-3 space-y-4 sm:space-y-6">
                {/* 1st Button – Pay Advance */}
                <div className="flex justify-center">
                  <button
                    disabled={loadingType !== null} // disable if any request running
                    onClick={async () => {
                      setLoadingType("advance");

                      await handlePayment(
                        advance - discount,
                        "Pay Advance",
                        total - advance,
                        total,
                        total - discount
                      );

                      setLoadingType(null); // re-enable buttons
                    }}
                    className={`w-full px-6 sm:px-12 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-lg shadow-lg transition-all duration-300
        ${
          loadingType !== null
            ? "bg-gray-700 cursor-not-allowed text-gray-300"
            : "bg-black text-white"
        }
      `}
                  >
                    {loadingType === "advance" ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Processing...
                      </span>
                    ) : (
                      <>Booking Advance ₹{advance - discount}</>
                    )}
                  </button>
                </div>

                {/* 2nd + 3rd Buttons */}
                <div className="flex flex-col sm:flex-row justify-between w-full space-y-3 sm:space-y-0 sm:space-x-4">
                  {/* CANCEL BUTTON */}
                  <button
                    disabled={loadingType !== null} // disabled during loader
                    onClick={() => window.history.back()}
                    className={`
        w-full sm:w-1/2 px-6 sm:px-12 py-3 sm:py-4 
        text-sm sm:text-base rounded-lg shadow-md 
        transition-all duration-300 flex items-center justify-center
        ${
          loadingType !== null
            ? "bg-gray-300 cursor-not-allowed text-gray-500"
            : "bg-gray-400 text-white hover:bg-gray-500"
        }
      `}
                    style={{ fontSize: "20px", fontWeight: "600" }}
                  >
                    Cancel
                  </button>

                  {/* PAY LATER (COD) */}
                  <button
                    disabled={loadingType !== null} // disable all buttons
                    onClick={async () => {
                      setLoadingType("cod");

                      await handlePayment(
                        0,
                        "CoD",
                        total - discount,
                        total,
                        total - discount
                      );

                      setLoadingType(null);
                    }}
                    className={`
        w-full sm:w-1/2 px-6 py-3 text-base sm:text-lg font-semibold rounded-lg shadow-md 
        transition-all duration-300 flex items-center justify-center gap-2
        ${
          loadingType !== null
            ? "bg-gray-400 cursor-not-allowed text-gray-300"
            : "bg-[#f87559] hover:bg-[#ff8f6e] text-white"
        }
      `}
                  >
                    {loadingType === "cod" ? (
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <CheckCircle size={24} />
                        Pay Later
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentGateway;
