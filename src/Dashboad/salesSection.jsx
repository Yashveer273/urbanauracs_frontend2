import React, { useState, useEffect, useRef } from "react";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { collection, onSnapshot, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebaseCon";
import AddSalesItem from "./AddSalesItem";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { API_BASE_URL, updateSale, updateStatusOrCommentDB } from "../API";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CalculateConveniencetotalFee } from "../components/TexFee";

export default function SalesSection() {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phone: "",
    product: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const responsiblePersons = ["Alice", "Bob", "Charlie", "David"];
  const [editingRow, setEditingRow] = useState(null);
  const [rowForm, setRowForm] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductInfo, setSelectedProductInfo] = useState(null);
  const [showModalContent, setShowModalContent] = useState(false);
  const [viewComment, setViewComment] = useState({
    saleId: null,
    productIndex: null,
  });

  const [last7DaysData, setLast7DaysData] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [editingStatus, setEditingStatus] = useState({
    saleId: null,
    productIndex: null,
  });
  const [tempStatus, setTempStatus] = useState("");
  const [tempComment, setTempComment] = useState("");
  const navigate = useNavigate();
  // Fetch sales
  useEffect(() => {
  const unsubscribe = onSnapshot(
  collection(firestore, "sales"),
  (snapshot) => {
    const newSales = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .reverse();               // 👈 reverse order

    setSalesData(newSales);
    setCurrentPage(1);
  }
);

    return () => unsubscribe();
  }, []);

  // Filters & Graph
  useEffect(() => {
    const filtered = salesData.filter(
      (sale) =>
        sale.name?.toLowerCase().includes(filters.name.toLowerCase()) &&
        sale.email?.toLowerCase().includes(filters.email.toLowerCase()) &&
        sale.product_info?.cart?.some((item) =>
          item.product_name
            ?.toLowerCase()
            .includes(filters.product.toLowerCase())
        )
    );

    setFilteredData(filtered);

    const daily = {},
      monthly = {};
    const today = new Date();
    salesData.forEach((sale) => {
      const price = Number(sale.total_price) || 0;
      const date = new Date(sale.date_time);
      const dayKey = date.toLocaleDateString("en-CA");
      daily[dayKey] = (daily[dayKey] || 0) + price;
      if (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        const day = date.getDate();
        monthly[day] = (monthly[day] || 0) + price;
      }
    });

    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const key = d.toLocaleDateString("en-CA");
      return {
        formattedDate: `D${d.getDate()}-M${d.getMonth() + 1}`,
        sales: daily[key] || 0,
      };
    });

    const monthlyGraph = Object.keys(monthly)
      .sort((a, b) => a - b)
      .map((day) => ({
        formattedDate: `D${day}-M${today.getMonth() + 1}`,
        sales: monthly[day],
      }));

    setLast7DaysData(last7);
    setMonthlySalesData(monthlyGraph);
  }, [salesData, filters]);

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const showProductInfo = (sale) => {
    setSelectedProductInfo({
      ...sale.product_info,
      id: sale.id,
      userData: {
        userId: sale.userId,
        phone_number: sale.phone_number,
        bookingAddress:
          sale?.product_info?.cart[sale?.product_info?.cart?.length - 1]
            .bookingAddress,
      },
      S_orderId:sale.S_orderId
    });
    setModalOpen(true);
    setTimeout(() => setShowModalContent(true), 50);
  };
  const closeModal = () => {
    setShowModalContent(false);
    setTimeout(() => {
      setModalOpen(false);
      setSelectedProductInfo(null);
    }, 300);
  };
  const updateResponsiblePerson = async (saleId, newPerson) => {
    try {
      const saleRef = doc(firestore, "sales", saleId);
      await setDoc(saleRef, { responsible: newPerson }, { merge: true });
      setSalesData((prev) =>
        prev.map((s) =>
          s.id === saleId ? { ...s, responsible: newPerson } : s
        )
      );
    } catch (e) {
      console.error("Error updating responsible person:", e);
    }
  };
  const openEditRowCard = (sale) => {
    setEditingRow(sale.id);
    setRowForm({
      orderId: sale.orderId,
      name: sale.name || "",
      email: sale.email || "",
      phone: sale.phone_number || "",
      WhatsApp_Mobile_Number: sale.ConfurmWhatsAppMobileNumber || "",
      product:
        sale.product_info?.cart?.map((item) => item.product_name).join(", ") ||
        "",
      pincode: sale.pincode || "",
      location: sale.user_location || "",
      totalPrice: sale.total_price || "",
      payableAmount: sale.payableAmount || "",
      payedAmount: sale.payedAmount || "",

      dateTime: sale.date_time
        ? new Date(sale.date_time).toISOString().slice(0, 16)
        : "",
    });
  };
  const saveEditedRow = async () => {
    try {
      let payable = {
        name: rowForm.name,
        email: rowForm.email,
        phone_number: rowForm.phone,
        ConfurmWhatsAppMobileNumber: rowForm.ConfurmWhatsAppMobileNumber,
        pincode: rowForm.pincode,
        user_location: rowForm.location,
        total_price: Number(rowForm.totalPrice),
        payableAmount: Number(rowForm.payableAmount),
        payedAmount: Number(rowForm.payedAmount),
        date_time: new Date(rowForm.dateTime).toISOString(),
      };
      const response = await updateSale(rowForm.orderId, payable);
      if (response.success != 200) {
        alert(response.data.message);

        return;
      }

      const saleRef = doc(firestore, "sales", editingRow);

      await setDoc(saleRef, payable, { merge: true });

      setSalesData((prev) =>
        prev.map((s) =>
          s.id === editingRow
            ? {
                ...s,
                name: rowForm.name,
                email: rowForm.email,
                phone_number: rowForm.phone,
                WhatsApp_Mobile_Number: rowForm.ConfurmWhatsAppMobileNumber,
                pincode: rowForm.pincode,
                user_location: rowForm.location,
                total_price: Number(rowForm.totalPrice),
                payableAmount: Number(rowForm.payableAmount),
                payedAmount: Number(rowForm.payedAmount),
                date_time: new Date(rowForm.dateTime).toISOString(),
              }
            : s
        )
      );

      setEditingRow(null);
    } catch (e) {
      console.error("Error updating row:", e);
    }
  };

  const [editingCartProduct, setEditingCartProduct] = useState({
    saleId: null,
    productIndex: null,
    productData: null,
  });
  const [isEditCartModalOpen, setIsEditCartModalOpen] = useState(false);
  const openEditCartModal = (item, index, saleId) => {
    
    console.log(item, index, saleId);
    setEditingCartProduct({
      saleId,
      productIndex: index,
      productData: item
    });
    setModalOpen(false);
    setIsEditCartModalOpen(true);
  };

const saveCartEdit = async (data) => {
  try {
    const saleId = data.saleId;

    console.log("🛠 Sending update:", data.productData, saleId);
console.log(data.productData, saleId,selectedProductInfo.userData.userId);
    const res = await axios.put(
      `${API_BASE_URL}/editSalesItem/${saleId}/cart`,
      {
        product_purchase_id: data.productData.product_purchase_id,
        updates: data.productData,
        userId:selectedProductInfo.userData.userId
      }
    );

    if (res.data.success) {
      alert("✅ Cart item updated successfully:");
      setIsEditCartModalOpen(false);
      setModalOpen(true);
    } else {
      alert("❌ Update failed:" );
    }
  } catch (err) {
    console.log(err);
    alert("🔥 Server error:");
  }
  try {
    const saleId = data.saleId;

        console.log(data.productData, saleId,selectedProductInfo.userData.userId);
    const saleRef = doc(firestore, "sales", saleId);

    const saleSnap = await getDoc(saleRef);
    if (!saleSnap.exists()) {
      console.error("Sale not found");
      return;
    }

 if (!saleSnap.exists()) {
    console.error("❌ Sale not found in Firestore");
    return;
  }

  const saleData = saleSnap.data();
  console.log("📦 saleData:", saleData);
    const updatedCart = saleData.
product_info.cart.map((item) =>
      item.product_purchase_id === data.productData.product_purchase_id
        ? { ...item, ...data.productData } // merge updates
        : item
    );

    await updateDoc(saleRef, { cart: updatedCart });

    console.log("✅ Cart item updated successfully");
    setIsEditCartModalOpen(false);
    setModalOpen(true);
  } catch (err) {
    console.error("❌ Error updating cart item:", err);
  }
};
  // Update status & comment
  const updateStatusOrComment = async (
    saleId,
    newStatus,
    newComment = "",
    isProduct = false,
    index = null
  ) => {
    try {
      const saleRef = doc(firestore, "sales", saleId);
      if (isProduct) {
        const updatedCart = selectedProductInfo.cart.map((p, idx) =>
          idx === index ? { ...p, status: newStatus, comment: newComment } : p
        );
        await setDoc(
          saleRef,
          { product_info: { ...selectedProductInfo, cart: updatedCart } },
          { merge: true }
        );
        setSelectedProductInfo((prev) => ({ ...prev, cart: updatedCart }));
      } else {
        await setDoc(
          saleRef,
          { status: newStatus, comment: newComment },
          { merge: true }
        );
        setSalesData((prev) =>
          prev.map((s) =>
            s.id === saleId
              ? { ...s, status: newStatus, comment: newComment }
              : s
          )
        );
      }
 await  updateStatusOrCommentDB(newStatus,saleId);

    } catch (e) {
      console.error("Error updating:", e);
    }
  };
  const openStatusCard = (
    saleId,
    currentStatus,
    currentComment = "",
    isProduct = false,
    index = null
  ) => {
    setEditingStatus({ saleId, isProduct, index });
    setTempStatus(currentStatus);
    setTempComment(currentComment);
  };
  const saveStatusCard = async () => {
    const { saleId, isProduct, index } = editingStatus;
    if (!tempComment.trim()) {
      return alert("Comment is required");
    }
    await updateStatusOrComment(
      saleId,
      tempStatus,
      tempComment,
      isProduct,
      index
    );
    setEditingStatus({ saleId: null, productIndex: null });
    setTempStatus("");
    setTempComment("");
  };

  const tableHeaders = [
    "S_orderId",
    "Edit",
    
    "User Name",
    "Email",
    "Phone",
    "WhatsApp Number",
    "Details",
    "Pincode",
    "Location",
    "Total Price",
    "Discount",
    "Payable Amount",
    "Payed Amount",
    "Date/Time",
    "Status",
    "Responsible",
    "Comment",
    "create Invoice",
  ];
  const orderStatusOptions = [
    "Received",
    "Confirmed",
    "Started",
    "Completed",
    "Payment Collected",
    "Cancelled",
  ];
  const productStatusOptions = ["Started", "Completed", "Cancelled"];
  const tableContainerRef = useRef(null);

  const scrollLeft = () => {
    tableContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    tableContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };
    const timeSlots = [
    "6:00 AM",
    "7:00 AM",
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
  ];
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-100 w-300">
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <h2 className="text-3xl font-bold mb-6">Sales Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Last 7 Days Sales Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last7DaysData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Monthly Sales Progress
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-white rounded-xl shadow-md">
          {["phone"].map((f) => (
            <input
              key={f}
              type={f === "phone" ? "number" : "text"}
              placeholder={`Search by ${
                f.charAt(0).toUpperCase() + f.slice(1)
              }`}
              value={filters[f]}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, [f]: e.target.value }))
              }
              className="p-3 border rounded-xl"
            />
          ))}
          <button
            onClick={() => {}}
            className="bg-blue-600 text-white p-3 rounded-xl"
          >
            Search
          </button>
        </div>
        <div className="fixed bottom-4 right-4 flex space-x-2">
          {/* Left (scroll left) */}
          <button
            onClick={scrollLeft}
            className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            <FiChevronLeft size={20} />
          </button>

          {/* Right (scroll right) */}
          <button
            onClick={scrollRight}
            className="p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
        <div
          className="table-container bg-white p-6 rounded-xl shadow-md overflow-x-auto"
          ref={tableContainerRef}
        >
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                {tableHeaders.map((h) => (
                  <th key={h} className="py-3 px-6">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.length ? (
                currentData.map((sale, i) => (
                  <tr key={i} className="hover:bg-gray-50 border-b">
                    <td className="py-4 px-6">{sale.S_orderId}</td>
                    <td className="py-4 px-6">
                      <button
                        className="bg-blue-600 text-white cursor-pointer px-3 py-1 rounded-md"
                        onClick={() => openEditRowCard(sale)}
                      >
                        Edit
                      </button>
                    </td>
                   
                    <td className="py-4 px-6">{sale.name}</td>
                    <td className="py-4 px-6">{sale.email}</td>
                    <td className="py-4 px-6">{sale.phone_number}</td>
                    <td className="py-4 px-6">
                      {sale.ConfurmWhatsAppMobileNumber}

                    </td>
                    
                    <td className="py-4 px-6">
                      <button
                        onClick={() => showProductInfo(sale)}
                        className="text-blue-600 cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>
                    <td className="py-4 px-6">{sale.pincode}</td>
                    <td className="py-4 px-6">{sale.user_location}</td>
                    <td className="py-4 px-6">₹{sale.total_price}</td>
                    <td className="py-4 px-6">₹{sale.discount}</td>
                    <td className="py-4 px-6">₹{sale.payableAmount}</td>
                    <td className="py-4 px-6">₹{sale.payedAmount}</td>

                    <td className="py-4 px-6">
                      {new Date(sale.date_time).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() =>
                          openStatusCard(
                            sale.id,
                            sale.status || "Received",
                            sale.comment || ""
                          )
                        }
                        className="text-blue-600 cursor-pointer"
                      >
                        {sale.status || "Received"}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={sale.responsible || ""}
                        onChange={(e) =>
                          updateResponsiblePerson(sale.id, e.target.value)
                        }
                        className="border rounded-md p-2"
                      >
                        <option value="">Select</option>
                        {responsiblePersons.map((person) => (
                          <option key={person} value={person}>
                            {person}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-4 px-6">
                      {sale.comment && (
                        <button
                          className="text-green-600 cursor-pointer"
                          onClick={() =>
                            setViewComment({
                              saleId: sale.id,
                              productIndex: null,
                            })
                          }
                        >
                          {salesData
                            .find((s) => s.id === sale.id)
                            ?.comment.slice(0, 5) +
                            (salesData.find((s) => s.id === sale.id)?.comment
                              .length > 5
                              ? "..."
                              : "")}
                        </button>
                      )}
                    </td>
                     <td className="py-4 px-6">
                      <button
                        className="bg-blue-600 cursor-pointer text-white px-3 py-1 rounded-md"
                        onClick={() => navigate("/InvoiceApp", { state: sale })}
                      >
                        Generate
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={12}
                    className="py-4 px-6 text-center text-gray-500"
                  >
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-white"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-4 py-2 rounded-xl ${
                  currentPage === p ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-white"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && selectedProductInfo && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className={`bg-white rounded-xl p-8 shadow-2xl relative w-full md:w-3/4 lg:w-1/2 ${
              showModalContent ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              onClick={closeModal}
              className="absolute top-4 right-4 text-3xl font-bold text-gray-400 cursor-pointer"
            >
              &times;
            </span>
            <h3 className="text-2xl font-bold mb-4">Product Details</h3>
            <div className="overflow-y-auto max-h-[70vh]">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                    {[
                      "Purchase ID",

                      "Product ID",
                      "Product Name",
                      "Vendor Name",
                      "Booking Date",
                      "Booking Time",
                      "Booking Address",
                      "Duration",
                      "Item Price","Quantity","Item Price*Quantity",
                      "After Convenience Fee",
                      "Total",
                     
                      "Status",
                      "Comment",
                      "Edit", // 👈 New column header
                    ].map((h) => (
                      <th key={h} className="py-3 px-6">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {selectedProductInfo.cart.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50 border-b">
                      <td className="py-4 px-6">{item.product_purchase_id}</td>
                      <td className="py-4 px-6">{item.og_product_id}</td>
                      <td className="py-4 px-6">{item.product_name}</td>
                      <td className="py-4 px-6">
                        {item.vendor_details.vendor_name}
                      </td>
                      <td className="py-4 px-6">
                        {item.location_booking_time}
                      </td>
                      <td className="py-4 px-6">{item.SelectedServiceTime}</td>
                      <td className="py-4 px-6">{item.bookingAddress}</td>
                   <td className="py-4 px-6">
  {item.duration
    ? item.duration.toString().toLowerCase().includes("hr")
      ? item.duration
      : `${item.duration} hrs`
    : "-"}
</td>

                      <td className="py-4 px-6">₹{item.item_price}</td>
                      <td className="py-4 px-6">{item.quantity  }</td>
                      <td className="py-4 px-6">₹{item.item_price*item.quantity  }</td>
                      <td className="py-4 px-6">₹{CalculateConveniencetotalFee(item.item_price*item.quantity)  }</td>
                      
                    

                      {/* Status Button */}
                      <td className="py-4 px-6">
                        <button
                          onClick={() =>
                            openStatusCard(
                              selectedProductInfo.id,
                              item.status || "Started",
                              item.comment || "",
                              true,
                              i
                            )
                          }
                          className="text-blue-600 hover:underline"
                        >
                          {item.status || "Started"}
                        </button>
                      </td>

                      {/* Comment Button */}
                      <td className="py-4 px-6">
                        {item.comment && (
                          <button
                            className="text-green-600 hover:underline"
                            onClick={() =>
                              setViewComment({
                                saleId: selectedProductInfo.id,
                                productIndex: i,
                              })
                            }
                          >
                            View Comment
                          </button>
                        )}
                      </td>

                      {/* ✅ Edit Button */}
                      <td className="py-4 px-6">
                        <button
                          className="text-indigo-600 hover:text-indigo-800 font-medium"
                          onClick={() =>
                            openEditCartModal(item, i, selectedProductInfo.id)
                          }
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AddSalesItem userData={selectedProductInfo.userData} selectedProductInfo={selectedProductInfo}  />
          </div>
        </div>
      )}
      {editingStatus.saleId && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Update Status</h3>
            <select
              className="border p-2 w-full mb-4"
              value={tempStatus}
              onChange={(e) => setTempStatus(e.target.value)}
            >
              {(editingStatus.isProduct
                ? productStatusOptions
                : orderStatusOptions
              ).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Add comment (required)"
              className="border p-2 w-full mb-4"
              value={tempComment}
              onChange={(e) => setTempComment(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded-xl bg-gray-300"
                onClick={() =>
                  setEditingStatus({ saleId: null, productIndex: null })
                }
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-blue-600 text-white"
                onClick={saveStatusCard}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {viewComment.saleId && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setViewComment({ saleId: null, productIndex: null })}
        >
          <div
            className="bg-white p-6 rounded-xl w-80 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Comment</h3>
            <p className="border p-4 rounded-md">
              {viewComment.productIndex === null
                ? salesData.find((s) => s.id === viewComment.saleId)?.comment
                : selectedProductInfo.cart[viewComment.productIndex]?.comment}
            </p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 rounded-xl bg-blue-600 text-white"
                onClick={() =>
                  setViewComment({ saleId: null, productIndex: null })
                }
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {editingRow && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 "
          onClick={() => setEditingRow(null)}
        >
          <div
            className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg mb-8 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4">Edit Sale</h3>
            {[
              "name",
              "email",
              "phone",
              "WhatsApp_Mobile_Number",
              "product",
              "pincode",
              "location",
              "totalPrice",
              "payableAmount",
              "payedAmount",
              "dateTime",
            ].map((field) => (
              <div className="mb-3" key={field}>
                <label className="block font-medium mb-1">
                  {field === "totalPrice"
                    ? "Total Price"
                    : field === "dateTime"
                    ? "Date/Time"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === "dateTime" ? "datetime-local" : "text"}
                  className="border p-2 w-full rounded-md"
                  value={rowForm[field]}
                  onChange={(e) =>
                    setRowForm((prev) => ({ ...prev, [field]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                className="px-4 py-2 rounded-xl bg-gray-300"
                onClick={() => setEditingRow(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-xl bg-blue-600 text-white"
                onClick={saveEditedRow}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditCartModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[101]">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Edit Cart Product</h2>

      {/* Product Name */}
      <label className="block text-sm font-medium mb-1">Product Name</label>
      <input
        type="text"
        value={editingCartProduct?.productData?.product_name || ""}
        onChange={(e) =>
          setEditingCartProduct((prev) => ({
            ...prev,
            productData: {
              ...prev.productData,
              product_name: e.target.value,
            },
          }))
        }
        className="w-full border px-3 py-2 mb-3 rounded"
      />

      {/* Booking Address */}
      <label className="block text-sm font-medium mb-1">Booking Address</label>
      <input
        type="text"
        value={editingCartProduct?.productData?.bookingAddress || ""}
        onChange={(e) =>
          setEditingCartProduct((prev) => ({
            ...prev,
            productData: {
              ...prev.productData,
              bookingAddress: e.target.value,
            },
          }))
        }
        className="w-full border px-3 py-2 mb-3 rounded"
      />

      {/* Booking Date */}
      <label className="block text-sm font-medium mb-1">Booking Date</label>
   <input
  type="date"
  value={
    editingCartProduct?.productData?.location_booking_time
      ? new Date(editingCartProduct.productData.location_booking_time)
          .toISOString()
          .split("T")[0]
      : ""
  }
  min={new Date().toISOString().split("T")[0]} // disables past dates
  onChange={(e) =>
    setEditingCartProduct((prev) => ({
      ...prev,
      productData: {
        ...prev.productData,
        location_booking_time: e.target.value,
      },
    }))
  }
  className="w-full border px-3 py-2 mb-3 rounded"
/>

      {/* Booking Time */}
      <label className="block text-sm font-medium mb-1">Booking Time</label>
     <select
  value={editingCartProduct?.productData?.SelectedServiceTime || ""}
  onChange={(e) =>
    setEditingCartProduct((prev) => ({
      ...prev,
      productData: {
        ...prev.productData,
        SelectedServiceTime: e.target.value,
      },
    }))
  }
  className="w-full border px-3 py-2 mb-3 rounded bg-white"
>
 
  {timeSlots.map((time) => (
    <option key={time} value={time}>
      {time}
    </option>
  ))}
</select>

      {/* Description */}
      <label className="block text-sm font-medium mb-1">Description</label>
      <input
        type="text"
        value={editingCartProduct?.productData?.description || ""}
        onChange={(e) =>
          setEditingCartProduct((prev) => ({
            ...prev,
            productData: {
              ...prev.productData,
              description: e.target.value,
            },
          }))
        }
        className="w-full border px-3 py-2 mb-3 rounded"
      />


     
      

      {/* Duration */}
      <label className="block text-sm font-medium mb-1">Duration</label>
      <input
        type="text"
        value={editingCartProduct?.productData?.duration || ""}
        onChange={(e) =>
          setEditingCartProduct((prev) => ({
            ...prev,
            productData: {
              ...prev.productData,
              duration: e.target.value,
            },
          }))
        }
        className="w-full border px-3 py-2 mb-3 rounded"
      />

      {/* Vendor Location */}
      <label className="block text-sm font-medium mb-1">Vendor Location</label>
      <input
        type="text"
        value={
          editingCartProduct?.productData?.vendor_details?.vendorLocation || ""
        }
        onChange={(e) =>
          setEditingCartProduct((prev) => ({
            ...prev,
            productData: {
              ...prev.productData,
              vendor_details: {
                ...prev.productData.vendor_details,
                vendorLocation: e.target.value,
              },
            },
          }))
        }
        className="w-full border px-3 py-2 mb-3 rounded"
      />

      {/* Vendor ID */}
      <label className="block text-sm font-medium mb-1">Vendor ID</label>
      <input
        type="text"
        value={editingCartProduct?.productData?.vendor_details?.vendor_id || ""}
        onChange={(e) =>
          setEditingCartProduct((prev) => ({
            ...prev,
            productData: {
              ...prev.productData,
              vendor_details: {
                ...prev.productData.vendor_details,
                vendor_id: e.target.value,
              },
            },
          }))
        }
        className="w-full border px-3 py-2 mb-3 rounded"
      />

      {/* Vendor Name */}
      <label className="block text-sm font-medium mb-1">Vendor Name</label>
      <input
        type="text"
        value={editingCartProduct?.productData?.vendor_details?.vendor_name || ""}
        onChange={(e) =>
          setEditingCartProduct((prev) => ({
            ...prev,
            productData: {
              ...prev.productData,
              vendor_details: {
                ...prev.productData.vendor_details,
                vendor_name: e.target.value,
              },
            },
          }))
        }
        className="w-full border px-3 py-2 mb-3 rounded"
      />

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => {setIsEditCartModalOpen(false); setModalOpen(true);

          }}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          onClick={() => saveCartEdit(editingCartProduct)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

