import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react"; // Success icon
import {
  AiOutlineLoading3Quarters,
  AiOutlineCloseCircle,
} from "react-icons/ai"; // Loading & error icons

import { clearOrder } from "../store/orderSlices";
import { closeCart, clearCart, selectCartTotal } from "../store/CartSlice"; //jj
import OrderSuccess from "./thankyou";

const PaymentSuccess = () => {
  const { id, amount } = useParams();
  const dispatch = useDispatch();
  const hasRun = useRef(false);
  const cartTotal = useSelector(selectCartTotal);
  let total_price = cartTotal.toFixed(2);
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.user.user);
  const order = useSelector((state) => state.order);

  const [status, setStatus] = useState("pending"); // pending | success | error

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const saveOrder = async () => {
      try {
        if (
          !order ||
          order.orderId !== id ||
          Math.round(Number(order.amount) * 100) !==
            Math.round(Number(amount) * 100)
        ) {
          console.error("Order mismatch!");
          setStatus("error");
          return;
        }

        const payload = {
          email: user?.email,
          name: user?.name || "Guest",
          phone_number: user?.mobileNumber,
          total_price: order.amount,
          oGtotal_price: total_price,
          pincode: user?.pincode,
          user_location: user?.location || "Unknown",
          status: "",
          date_time: new Date().toISOString(),
          product_info: {
            cart: cart.map((item) => ({
              location_booking_time: item.bookingDate,
              item_price: item.price,
              originalPrice: item.originalPrice,
              description: item.description,
              duration: item.duration,
              product_purchase_id: `${user?.mobileNumber}_${
                item.price
              }_${Date.now()}`,
              bookingAddress: item.bookingAddress,
              og_product_id: item.productId,
              product_name: item.title,
              tag: item.tag,
              vendor_details: {
                vendor_name: item.vendorName,
                vendor_id: item.vendorId,
                vendorLocation: item.vendorLocation,
              },
            })),
          },
        };

        const response = await axios.post(
          `http://localhost:8000/api/sales/${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (response.status === 200) {
          setStatus("success");
          dispatch(clearOrder());
          dispatch(clearCart());
          dispatch(closeCart());
          setTimeout(() => {
            navigate("/", { replace: true }); // replaces current entry
          }, 4000);
        } else {
          console.error("Unexpected response:", response);
          setStatus("error");
        }
      } catch (error) {
        console.error("Error saving order:", error);
        setStatus("error");
      }
    };

    saveOrder();
  }, [id, amount, order, cart, user, dispatch]);

  const statusMap = {
    pending: {
      text: "Saving order...",
      color: "#3498db",
      icon: (
        <AiOutlineLoading3Quarters className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
      ),
    },
    success: {
      text: "Order saved successfully!",
      color: "#27ae60",
      icon: <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />,
    },
    error: {
      text: "Something went wrong.",
      color: "#e74c3c",
      icon: (
        <AiOutlineCloseCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      ),
    },
  };

  return (
    <div
      className={`${
        status === "success"
          ? ""
          : "bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center border-t-4 " +
            (status === "error" ? "border-red-500" : "border-blue-500")
      }`}
    >
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={status}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
          className={`${
            status === "success"
              ? ""
              : "bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center border-t-4 " +
                (status === "error" ? "border-red-500" : "border-blue-500")
          }`}
        >
          {status === "success" ? <OrderSuccess /> : statusMap[status].icon}

          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: statusMap[status].color }}
          >
            {statusMap[status].text}
          </h2>

          {status === "error" && (
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition w-full mt-4"
            >
              Retry
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PaymentSuccess;
