import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logoutUser } from "../store/userSlice";
import {
  FaUserCircle,
  FaEnvelope,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaSignOutAlt,
  FaGlobe,
  FaArrowLeft,
  FaClock,
} from "react-icons/fa";
import { clearCart } from "../store/CartSlice";

import { getMyOrderHistory } from "../API";
import {
  CalculateConvenienceFee,
  CalculateConveniencetotalFee,
} from "./TexFee";

const AccountMenu = () => {
  const [history, setHistory] = useState([]);

  const user = useSelector(selectUser);

  const dispatch = useDispatch();

  const callOrderHistory = async () => {
    const res = await getMyOrderHistory(user?.userId);

    if (res?.status === 200 && res.data.orders?.length > 0) {
      const formatted = res.data.orders.map((order) => {
     
        const cartItems = order?.product_info?.cart || [];
        const totalFee = order?.product_info?.cart?.reduce(
          (sum, item) =>
            sum +
            Number(
              item.item_price * item.quantity +
                CalculateConvenienceFee(item.item_price * item.quantity)
                  .convenienceFee
            ),
          0
        );

        return {
          orderSubmittedDate: order?.date_time,
          order_id: order?.orderId,
          payableAmount: order?.payableAmount,
          paidAmount: order?.payedAmount,
          totalPrice: totalFee,

          status: order?.status || "Pending",

          statusColor:
            order?.status === "Completed"
              ? "green"
              : order?.status === "Confirmed"
              ? "blue"
              : order?.status === "Cancelled"
              ? "red"
              : "gray",

          // MULTIPLE ITEMS INSIDE CART
          cart: cartItems.map((item) => ({
            productName: item?.product_name,
            tag: item?.tag,
            duration: item?.duration,
            quantity: item?.quantity,
            product_purchase_id: item?.product_purchase_id,
            status: item?.status,
            itemPrice: item?.item_price,
            product_name: item?.product_name,
            bookingAddress: item?.bookingAddress,
            bookingDate: item?.location_booking_time,
            serviceTime: item?.SelectedServiceTime,
            description: item?.description,
            vendorName: item?.vendor_details?.vendor_name || "",
            image:
              item?.image ||
              "https://cdn-icons-png.flaticon.com/512/2784/2784468.png",
          })),
        };
      });

      setHistory(formatted);
    }
  };

  useEffect(() => {
    if (user.userId) {
      callOrderHistory();
    }
  }, [user]);
  const formatDate = (isoDate) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(isoDate));
  };
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const fallbackCopy = (text) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);

    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  // const action = (res, data) => {

  //   if (res.data.status == "success") {
  //     if (user.userId) {
  //       callOrderHistory();
  //     }
  //   } else {
  //     alert(res.data.message);
  //   }
  // };
  return (
    <>
      <div className="relative w-[100%] h-[100vh]  bg-white  shadow-2xl overflow-hidden animate-fadeIn flex flex-col">
        <div className="relative bg-gradient-to-r from-[#f87559] to-orange-500 text-white p-6 flex flex-col items-start">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white bg-black/20 px-3 py-1.5 rounded-full hover:bg-black/30 transition"
          >
            <FaArrowLeft size={16} />
            Back
          </button>
        </div>
        <div className="overflow-y-auto">
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
          <div className="flex-1  px-5 py-3">
            <h3 className="text-gray-800 font-semibold text-sm mb-2 flex items-center gap-2">
              <FaClock className="text-[#f87559]" /> Purchase History
            </h3>

            {history && history.length > 0 ? (
              history.map((order) => (
                <div
                  key={order.orderId}
                  className="p-4 mb-4 bg-white border border-gray-300 rounded-xl shadow-sm"
                >
                  {/* Top Section */}
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-xs text-black flex items-center gap-2">
                        Order Id:
                        <span className="font-semibold">{order.order_id}</span>
                        {/* Copy Button */}
                        <button
                          type="button"
                          onClick={() => handleCopy(order.order_id)}
                          className="p-1 rounded hover:bg-gray-200 transition flex items-center gap-1"
                        >
                          {copied ? (
                            <span className="text-green-600 text-sm font-bold">
                              ✓
                            </span>
                          ) : (
                            <span className="text-gray-600">📋</span>
                          )}
                        </button>
                      </p>

                      <p className="text-xs text-gray-500">Order Submitted</p>
                      <p className="font-semibold text-gray-800">
                        {formatDate(order.orderSubmittedDate)}
                      </p>
                      <samp
                        className={`px-2 py-1 rounded text-sm font-medium
    ${
      !order.status || order.status === ""
        ? "bg-yellow-100 text-yellow-800"
        : order.status === "Completed"
        ? "bg-green-100 text-green-800"
        : order.status === "Cancelled"
        ? "bg-red-100 text-red-800"
        : "bg-gray-100 text-gray-800"
    }`}
                      >
                        {order.status && order.status !== ""
                          ? order.status
                          : "Pending"}
                      </samp>
                    </div>
                  </div>

                  {/* Billing */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    {/*                      
                      <div className="bg-gray-50 p-2 rounded-md">
                        <p className="text-gray-500 text-xs">Payable Amount</p>
                        <p className="font-semibold text-gray-800 text-base">
                          ₹{order.totalPrice-order.paidAmount}
                        </p>
                        <button
                          disabled={order.totalPrice-order.paidAmount == 0}
                          onClick={async () => {
                            if (order.totalPrice-order.paidAmount == 0) return;

                            const date = Date.now();
                            await handlePaymentLeft(
                              {
                                name: user.name,
                                amount: order.totalPrice-order.paidAmount,
                                order_id: order.order_id,
                                user: user,
                                transectionId: `${date}`,
                              },
                              action
                            );
                          }}
                          className={`font-semibold px-4 py-2 rounded-md shadow transition-all duration-200
                              ${
                                order.totalPrice-order.paidAmount === 0
                                ? "bg-green-500 text-white cursor-not-allowed"
                                 : "bg-orange-500 hover:bg-orange-600 text-white"
                                  }
                                `}
                        >
                          {order.totalPrice-order.paidAmount === 0
                            ? "Complete"
                            : `Pay Now ₹${order.totalPrice-order.paidAmount}`}
                        </button>
                      </div> */}

                    <div className="bg-gray-50 p-2 rounded-md">
                      <p className="text-gray-500 text-xs">Paid Amount</p>
                      <p className="font-semibold text-gray-800">
                        ₹{order.paidAmount}
                      </p>
                    </div>
                  </div>

                  <hr className="my-3" />

                  {/* CART ITEMS */}
                  <div className="space-y-4">
                    {order.cart.map((itm, idx) => (
                      <div
                        key={idx}
                        className="p-3 border border-gray-200 rounded-lg shadow-sm bg-white"
                      >
                        {/* Product Title */}
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">
                          {itm.productName}
                        </h4>

                        {/* Table View */}
                        <table className="w-full text-xs text-gray-600 border-collapse">
                          <tbody>
                            {/* Description + Tag */}
                            {/* Duration */}
                            <tr className="border-b">
                              <td className="py-1 font-semibold w-28">
                                Address
                              </td>
                              <td className="py-1">{itm.bookingAddress}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-1 font-semibold w-28 align-top">
                                Service Details
                              </td>

                              <td className="py-1 align-top">
                                <p className="text-xs text-gray-500 max-w-[250px] break-words">
                                  {itm.product_name} - {itm.description}
                                </p>

                                <span className="text-blue-600 ml-1">
                                  {itm.tag}
                                </span>
                              </td>
                            </tr>

                            {/* Duration */}
                            <tr className="border-b">
                              <td className="py-1 font-semibold w-28">
                                Duration
                              </td>
                              <td className="py-1">{itm.duration}</td>
                            </tr>

                            {/* Price */}
                            <tr className="border-b">
                              <td className="py-1 font-semibold w-28">Price</td>
                              <td className="py-1">₹{itm.itemPrice}</td>
                            </tr>

                            <tr className="border-b">
                              <td className="py-1 font-semibold w-28">
                                Quantity
                              </td>
                              <td className="py-1">{itm.quantity}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-1 font-semibold w-28">
                                Convenience Fee
                              </td>
                              <td className="py-1">
                                ₹
                                {
                                  CalculateConvenienceFee(
                                    itm.itemPrice * itm.quantity
                                  ).convenienceFee
                                }
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-1 font-semibold w-28">
                                Price after Convenience
                              </td>
                              <td className="py-1">
                                ₹
                                {CalculateConveniencetotalFee(
                                  itm.itemPrice * itm.quantity
                                )}
                              </td>
                            </tr>
                            {/* Booking Date */}
                            <tr className="border-b">
                              <td className="py-1 font-semibold w-28">Date</td>
                              <td className="py-1">{itm.bookingDate}</td>
                            </tr>

                            {/* Booking Time */}
                            <tr>
                              <td className="py-1 font-semibold w-28">Time</td>
                              <td className="py-1">{itm.serviceTime}</td>
                            </tr>
                            {/* <tr>
                            <td className="py-1 font-semibold w-28">
                              Product Purchase Id
                            </td>
                            <td className="py-1">{itm.product_purchase_id}</td>
                          </tr> */}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>

                  <div className="text-right mt-3 font-bold text-gray-900">
                    Total Price: ₹{order.totalPrice}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8 text-sm">
                No order history found.
              </div>
            )}
          </div>
        </div>
        {
          /* Footer */
          user?.username ? (
            <div className="p-4 border-t bg-gray-100 text-center">
              <button
                onClick={() => {
                  dispatch(logoutUser());
                  dispatch(clearCart());

                  localStorage.removeItem("urberaura-bookingAddressStatus");
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#f87559] hover:bg-[#e65a3f] text-white py-2 rounded-lg font-semibold transition"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          ) : (
            <></>
          )
        }
      </div>
    </>
  );
};

export default AccountMenu;
