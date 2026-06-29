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
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../firebaseCon";
import AddSalesItem from "./AddSalesItem";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  API_BASE_URL,
  fetchdashAuth,
  updateSale,
  updateServiceStatusOrCommentDB,
  updateStatusOrCommentDB,
} from "../API";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CalculateConvenienceFee,
  CalculateConveniencetotalFee,
} from "../components/TexFee";
import { handleCopy, normalizeDate } from "./utility";
import WhatsAppChatBox from "./whatsappchatopener";
import WhatsappChatCard from "../components/WhatsAppScreen";
import { GetVenderData } from "./GetVenderData";

export default function SalesSection() {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    status: "",
    phone: null,
    product: "",
    orderId: null,
    resPerson: "",
    onDate: "",
    dateX_To: "",
    dateY: "",
    dateMode: "", // "single" | "range"
    responsible: "",
    responsibleVendor: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [editingRow, setEditingRow] = useState(null);
  const [rowForm, setRowForm] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductInfo, setSelectedProductInfo] = useState(null);
  const [showModalContent, setShowModalContent] = useState(false);
  const [viewComment, setViewComment] = useState({
    saleId: null,
    productIndex: null,
  });
  const [openChangeResposibleVendor, setOpenChangeResposibleVendor] = useState({
    status: false,
    saleId: "",
  });

  const [last7DaysData, setLast7DaysData] = useState([]);
  const [responsiblePersons, setResponsiblePersons] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [editingStatus, setEditingStatus] = useState({
    saleId: null,
    productIndex: null,
  });
  const [tempStatus, setTempStatus] = useState("");
  const [tempComment, setTempComment] = useState("");
  const navigate = useNavigate();

  const [tagAccess, setTagAccess] = useState([]);
  const [saleDataTem, setsaleDataTem] = useState(null);

  // ------------------------------------------------------------------
  const checkAuth = () => {
    const token = localStorage.getItem("urbanauraservicesdashauthToken");
    const dashtagAccess = localStorage.getItem(
      "urbanauraservicesdashtagAccess",
    );

    if (token) {
      setTagAccess(dashtagAccess ? dashtagAccess.split(",") : []);
    } else {
      setTagAccess([]);
    }
  };

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
          .reverse(); // 👈 reverse order

        setSalesData(newSales);
        setCurrentPage(1);
      },
      checkAuth(),
      getResponsiblePersion(),
    );

    return () => unsubscribe();
  }, []);
  const getResponsiblePersion = async () => {
    const res = await fetchdashAuth();
    if (res.data) {
      setResponsiblePersons(res.data);
    }
  };
  // Filters & Graph}
  useEffect(() => {
    setFilteredData(salesData);

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
  }, [salesData]);

  const clearFilters = () => {
    const reset = {
      name: "",
      status: "",
      phone: "",
      product: "",
      orderId: "",
      resPerson: "",
      onDate: "",
      dateX_To: "",
      dateY: "",
      dateMode: "",
      responsible: "",
      responsibleVendor: "",
    };

    setFilters(reset);
    setFilteredData(salesData);
  };

  const applyFilters = () => {
    const result = salesData.filter((sale) => {
      const saleDate = normalizeDate(sale.date_time);

      // TEXT FILTERS
      if (
        filters.phone &&
        !sale.phone_number?.toString().includes(filters.phone)
      )
        return false;

      if (
        filters.name &&
        !sale.name?.toLowerCase().includes(filters.name.toLowerCase())
      )
        return false;
      if (
        filters.responsible &&
        sale.responsible?.toLowerCase() == filters.responsible.toLowerCase()
      )
        return true;
      if (
        filters.responsibleVendor &&
        sale?.responsibleVendor?.vendorName === filters.responsibleVendor
      ) {
        console.log(
          filters.responsibleVendor,
          "filters",
          sale?.responsibleVendor?.vendorName,
        );
        return true;
      }

      if (filters.status) {
        const saleStatus = (sale.status || "").toLowerCase();
        const filterStatus = filters.status.toLowerCase();

        if (filterStatus === "pending") {
          if (saleStatus !== "" && saleStatus !== "pending") {
            return false;
          }
        } else {
          if (saleStatus != filterStatus) {
            return false;
          } else return true;
        }
      }

 if (
        filters.orderId &&
      
         sale.orderId?.toString()==filters.orderId.toString()
      ){
        return true;
      }
        
      // SINGLE DATE (onDate)
      if (filters.dateMode === "single" && filters.onDate) {
        return saleDate === filters.onDate;
      }

      // DATE RANGE (X → Y)
      if (filters.dateMode === "range" && filters.dateX_To && filters.dateY) {
        return saleDate >= filters.dateX_To && saleDate <= filters.dateY;
      }
      if (filters.responsible && !sale.orderId?.includes(filters.orderId))
        return false;
    });

    setFilteredData(result);
  };

  const currentData = [...filteredData]
    .sort((a, b) => (b.S_orderId || 0) - (a.S_orderId || 0))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const showProductInfo = (sale) => {
    setsaleDataTem(sale);
    setSelectedProductInfo({
      ...sale.product_info,
      id: sale.id,
      discount: sale.discount,
      userData: {
        userId: sale.userId,
        phone_number: sale.phone_number,
        bookingAddress:
          sale?.product_info?.cart[sale?.product_info?.cart?.length - 1]
            .bookingAddress,
      },
      S_orderId: sale.S_orderId,
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
          s.id === saleId ? { ...s, responsible: newPerson } : s,
        ),
      );
    } catch (e) {
      console.error("Error updating responsible person:", e);
    }
  };
  const updateResponsibleVendor = async (saleId, responsibleVendor) => {
    try {
      const saleRef = doc(firestore, "sales", saleId);
      await setDoc(
        saleRef,
        { responsibleVendor: responsibleVendor },
        { merge: true },
      );
      setSalesData((prev) =>
        prev.map((s) =>
          s.id === saleId ? { ...s, responsibleVendor: responsibleVendor } : s,
        ),
      );
      setOpenChangeResposibleVendor(false);
    } catch (e) {
      console.error("Error updating responsible person:", e);
    }
  };
  const openEditRowCard = (sale) => {
    setEditingRow(sale.id);

    sale?.product_info?.cart?.reduce(
      (sum, item) =>
        sum +
        Number(
          item.item_price * item.quantity +
            CalculateConvenienceFee(item.item_price * item.quantity)
              .convenienceFee,
        ),
      0,
    );

    setRowForm({
      orderId: sale.orderId,
      name: sale.name || "",
      BalanceAmount:
        sale?.product_info?.cart?.reduce(
          (sum, item) =>
            sum +
            Number(
              item.item_price * item.quantity +
                CalculateConvenienceFee(item.item_price * item.quantity)
                  .convenienceFee,
            ),
          0,
        ) -
        Number(sale?.discount || 0) -
        Number(sale?.payedAmount || 0),
      // email: sale.email || "",
      phone: sale.phone_number || "non",
      WhatsApp_Mobile_Number: sale.ConfurmWhatsAppMobileNumber || "",

      // pincode: sale.pincode || "",
      discount: sale.discount || "0",

      payedAmount: sale.payedAmount??"0",
      booking_Date: sale.product_info.cart[0]?.location_booking_time,
      booking_Time: sale.product_info.cart[0]?.SelectedServiceTime,

      // ,
    });
  };
  const saveEditedRow = async () => {
    try {
      let updateSalesData = {
        name: rowForm.name,
        phone_number: rowForm.phone,
        ConfurmWhatsAppMobileNumber: rowForm.WhatsApp_Mobile_Number,
        discount: rowForm.discount,
        location_booking_time: rowForm.booking_Date,
        SelectedServiceTime: rowForm.booking_Time,
      };
      const response = await updateSale(rowForm.orderId, updateSalesData);
      if (response.status != 200) {
        alert(response.data.message);

        return;
      }

      const saleRef = doc(firestore, "sales", editingRow);

      await updateDoc(saleRef, {
        name: rowForm.name,
        phone_number: rowForm.phone,
        ConfurmWhatsAppMobileNumber: rowForm.WhatsApp_Mobile_Number,
        discount: rowForm.discount,
        product_info: response.data.data.product_info ?? { cart: [] },
      });

      setSalesData((prev) =>
        prev.map((s) =>
          s.id === editingRow
            ? {
                ...s,
                name: rowForm.name,

                phone_number: rowForm.phone,
                WhatsApp_Mobile_Number: rowForm.WhatsApp_Mobile_Number,
                discount: rowForm.discount,
                location_booking_time: rowForm.booking_Date,
                SelectedServiceTime: rowForm.booking_Time,
              }
            : s,
        ),
      );

      setEditingRow(null);
      alert("Sale updated successfully");
    } catch (e) {
      console.error("Error updating row:", e);
    }
  };
  const [open, setOpen] = useState(false);

  const [editingCartProduct, setEditingCartProduct] = useState({
    saleId: null,
    productIndex: null,
    productData: null,
  });
  const [isEditCartModalOpen, setIsEditCartModalOpen] = useState(false);
  const openEditCartModal = (item, index, saleId) => {
    setEditingCartProduct({
      saleId,
      productIndex: index,
      productData: item,
    });
    setModalOpen(false);
    setIsEditCartModalOpen(true);
  };

  const saveCartEdit = async (data) => {
    try {
      // SelectedServiceTime
      console.log(data.productData);
      const saleId = data.saleId;
      const res = await axios.put(
        `${API_BASE_URL}/editSalesItem/${saleId}/cart`,
        {
          product_purchase_id: data.productData.product_purchase_id,
          updates: data.productData,
          userId: selectedProductInfo.userData.userId,
        },
      );

      if (res.data.success) {
        alert("✅ Cart item updated successfully:");
        setIsEditCartModalOpen(false);
        setModalOpen(true);
      } else {
        alert("❌ Update failed:");
      }
    } catch (err) {
      console.log(err);
      alert("🔥 Server error:");
    }
    try {
      const saleId = data.saleId;
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
      const updatedCart = saleData.product_info.cart.map((item) =>
        item.product_purchase_id === data.productData.product_purchase_id
          ? { ...item, ...data.productData }
          : item,
      );

      await updateDoc(saleRef, { product_info: { cart: updatedCart } });
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
    index = null,
  ) => {
    try {
      const saleRef = doc(firestore, "sales", saleId);

      if (isProduct) {
        const updatedCart = selectedProductInfo.cart.map((p, idx) =>
          idx === index ? { ...p, status: newStatus, comment: newComment } : p,
        );
        await setDoc(
          saleRef,
          { product_info: { ...selectedProductInfo, cart: updatedCart } },
          { merge: true },
        );
        setSelectedProductInfo((prev) => ({ ...prev, cart: updatedCart }));
      } else {
        await setDoc(
          saleRef,
          { status: newStatus, comment: newComment },
          { merge: true },
        );
        setSalesData((prev) =>
          prev.map((s) =>
            s.id === saleId
              ? { ...s, status: newStatus, comment: newComment }
              : s,
          ),
        );
      }
      await updateStatusOrCommentDB(newStatus, saleId);
    } catch (e) {
      console.error("Error updating:", e);
    }
  };
  const openStatusCard = (
    saleId,
    currentStatus,
    currentComment = "",
    isProduct = false,
    index = null,
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
      index,
    );
    setEditingStatus({ saleId: null, productIndex: null });
    setTempStatus("");
    setTempComment("");
  };

  const saveServiceStatusCard = async () => {
    const { saleId, isProduct, serviceId, index } = editingStatus;

    if (!tempComment.trim()) {
      return alert("Comment is required");
    }

    await updateServiceStatusOrComment(
      saleId,
      serviceId,
      tempStatus,
      tempComment,
      isProduct,
      index,
    );
    setEditingStatus({ saleId: null, productIndex: null, serviceId: null });
    setTempStatus("");
    setTempComment("");
  };
  const updateServiceStatusOrComment = async (
    saleId,
    serviceId,
    newStatus,
    newComment = "",
  ) => {
    try {
      const saleRef = doc(firestore, "sales", saleId);

      const updatedCart = selectedProductInfo.cart.map((p) =>
        p.product_purchase_id === serviceId
          ? { ...p, status: newStatus, comment: newComment }
          : p,
      );

      // 🔹 Update Firestore (nested merge-safe)
      await setDoc(
        saleRef,
        {
          product_info: {
            cart: updatedCart,
          },
        },
        { merge: true },
      );

      let data = saleDataTem;
      data.product_info.cart = updatedCart;

      showProductInfo(data);
      await updateServiceStatusOrCommentDB(saleId, serviceId, newStatus);
    } catch (e) {
      console.error("❌ Error updating:", e);
    }
  };

  const tableHeaders = [
    "S OrderId",
    "Order Id",
    "Edit",
    "User Name",
    "Phone",
    "Details",
    "Total Amount",
    "Discount",
    "convenience Fee",
    "Balance Amount",
    "Paid Amount",
    "Booking Date/Time",
    "Status",
    "Responsible",
    "Comment",
    "Vendor",
    "create Invoice",
    "WhatsApp Msg",
  ];
  const orderStatusOptions = [
    "Pending",
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
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
    "06:00 PM - 08:00 PM",
  ];
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-100 w-full">
      {" "}
      {/*Shivani*/}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
          Sales Dashboard
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md w-full min-h-[320px]">
            <h3 className="text-xl font-semibold mb-4">
              Last 7 Days Sales Trend
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={last7DaysData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formattedDate" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} width={30} />
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
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-md w-full min-h-[320px]">
            <h3 className="text-xl font-semibold mb-4">
              Monthly Sales Progress
            </h3>
            <ResponsiveContainer width="100%" height={280}>
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

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          {/* Filter Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {" "}
            {/*Shivani*/}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Phone</label>
              <input
                type="number"
                placeholder="Phone"
                value={filters.phone}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, phone: Number(e.target.value) }))
                }
                className="p-2 border rounded-md text-sm w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">Name</label>
              <input
                type="text"
                placeholder="Name"
                value={filters.name}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, name: e.target.value }))
                }
                className="p-2 border rounded-md text-sm w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">
                Order ID
              </label>
              <input
                type="text"
                placeholder="Order ID"
                value={filters.orderId}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, orderId: Number(e.target.value) }))
                }
                className="p-2 border rounded-md text-sm w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, status: e.target.value }))
                }
                className="p-2 border rounded-md text-sm w-full"
              >
                <option value="">----Select----</option>
                {[
                  "Pending",
                  "Confirmed",
                  "Started",
                  "Completed",
                  "Payment Collected",
                  "Cancelled",
                ].map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">
                Responsible Person
              </label>
              <select
                value={filters.responsible}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, responsible: e.target.value }))
                }
                className="p-2 border rounded-md text-sm w-full"
              >
                <option value="">----Select----</option>
                {responsiblePersons.map((person) => (
                  <option key={person._id} value={person.ResponsiblePersonName}>
                    {person.ResponsiblePersonName}
                  </option>
                ))}
              </select>
            </div>
            {/* Vendor Search (Assuming GetVenderData renders a search input) */}
            <div className="flex flex-col gap-1">
              <GetVenderData
                passVender={(data) =>
                  setFilters((p) => ({
                    ...p,
                    responsibleVendor: data.vendorName,
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500">
                Single Date
              </label>
              <input
                type="date"
                value={filters.onDate}
                onChange={(e) =>
                  setFilters((p) => ({
                    ...p,
                    onDate: e.target.value,
                    dateX_To: "",
                    dateY: "",
                    dateMode: "single",
                  }))
                }
                className="p-2 border rounded-md text-sm w-full"
              />
            </div>
            {/* Date Range Group */}
            <div className="flex flex-col gap-1 md:col-span-1">
              <label className="text-xs font-medium text-gray-500">
                Date Range (From - To)
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.dateX_To}
                  onChange={(e) =>
                    setFilters((p) => ({
                      ...p,
                      dateX_To: e.target.value,
                      onDate: "",
                      dateMode: "range",
                    }))
                  }
                  className="p-2 border rounded-md text-sm w-1/2"
                />
                <input
                  type="date"
                  value={filters.dateY}
                  onChange={(e) =>
                    setFilters((p) => ({
                      ...p,
                      dateY: e.target.value,
                      onDate: "",
                      dateMode: "range",
                    }))
                  }
                  className="p-2 border rounded-md text-sm w-1/2"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-gray-100 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
            <button
              onClick={applyFilters}
              className="px-8 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-shadow shadow-md"
            >
              Apply Filters
            </button>
          </div>
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
        <WhatsAppChatBox />
        <div
          className="table-container bg-white p-4 md:p-6 rounded-xl shadow-md w-full min-h-[280px] overflow-x-auto"
          ref={tableContainerRef}
        >
          {" "}
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-xs md:text-sm">
                {" "}
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
                    <td className="py-4 px-2 ">{sale.S_orderId}</td>
                    <td className="py-2 "> {sale.orderId}</td>
                    <td className="py-4  px-2">
                      <button
                        className="bg-blue-600 text-white cursor-pointer px-3 py-1 rounded-md"
                        onClick={() => openEditRowCard(sale)}
                      >
                        Edit
                      </button>
                    </td>

                    <td className="py-3 px-2 text-xs md:text-sm">
                      {sale.name}
                    </td>

                    <td className="py-3 px-2 text-xs md:text-sm">
                      {sale.phone_number}
                      <br /> /W {sale.ConfurmWhatsAppMobileNumber}
                    </td>
                    <td className="py-3 px-2 text-xs md:text-sm">
                      <button
                        onClick={() => showProductInfo(sale)}
                        className="text-blue-600 cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>

                    <td className="py-3 px-2 text-xs md:text-sm">
                      ₹
                      {Math.round(
                        sale?.product_info?.cart?.reduce(
                          (sum, item) =>
                            sum + Number(item.item_price * item.quantity),
                          0,
                        ),
                      )}
                    </td>
                    <td className="py-3 px-2 text-xs md:text-sm">
                      ₹{Number(sale?.discount || 0)}
                    </td>
                    <td className="py-3 px-2 text-xs md:text-sm">
                      ₹
                      {Math.round(
                        sale?.product_info?.cart?.reduce(
                          (sum, item) =>
                            sum +
                            Number(
                              CalculateConvenienceFee(
                                item.item_price * item.quantity,
                              ).convenienceFee,
                            ),
                          0,
                        ),
                      )}
                    </td>

                    <td className="py-3 px-2 text-xs md:text-sm">
                      ₹
                      {Math.round(
                        sale?.product_info?.cart?.reduce(
                          (sum, item) =>
                            sum +
                            Number(
                              item.item_price * item.quantity +
                                CalculateConvenienceFee(
                                  item.item_price * item.quantity,
                                ).convenienceFee,
                            ),
                          0,
                        ) -
                          Number(sale?.discount || 0) -
                          Number(sale?.payedAmount || 0),
                      )}
                    </td>

                    <td className="py-3 px-2 text-xs md:text-sm">
                      ₹{sale.payedAmount??0}
                    </td>

                    <td className="py-3 px-2 text-xs md:text-sm">
                      {normalizeDate(sale.date_time)}
                      <br />
                      {new Date(sale.date_time).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-2 text-xs md:text-sm">
                      <button
                        onClick={() =>
                          openStatusCard(
                            sale.id,
                            sale.status || "Pending",
                            sale.comment || "",
                          )
                        }
                        className="text-blue-600 cursor-pointer"
                      >
                        {sale.status || "Pending"}
                      </button>
                    </td>
                    <td className="py-3 px-2 text-xs md:text-sm">
                      {responsiblePersons && responsiblePersons.length > 0 ? (
                        tagAccess?.includes("Admin") ? (
                          <select
                            value={sale.responsible || ""}
                            onChange={(e) =>
                              updateResponsiblePerson(sale.id, e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {responsiblePersons.map((person) => (
                              <option
                                key={person._id}
                                value={person.ResponsiblePersonName}
                              >
                                {person.ResponsiblePersonName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-sm font-medium text-gray-700">
                            {sale.responsible || "—"}
                          </span>
                        )
                      ) : (
                        <span className="text-sm text-red-500 italic">
                          Responsible Person data not available
                        </span>
                      )}
                    </td>

                    <td className="py-4">
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
                    <td className="py-4">
                      <button
                        className="text-green-600 cursor-pointer"
                        onClick={() => {
                          setOpenChangeResposibleVendor({
                            status: true,
                            saleId: sale.id,
                          });
                        }}
                      >
                        {sale?.responsibleVendor?.vendorName
                          ? sale.responsibleVendor.vendorName
                          : "Select"}
                      </button>
                    </td>
                    <td>
                      <WhatsappChatCard
                        phone={`91${sale.ConfurmWhatsAppMobileNumber}`}
                        buttonText="Send WhatsApp Message"
                        data={{
                          vendorName: "",
                          customerName: sale.name,
                          serviceId: sale.id,
                          discount: sale.discount,
                          Responsible: sale.responsible || "______",
                          otp: Math.floor(10 + Math.random() * 90) * 100 + 25,
                          serviceDetails: sale.product_info.cart
                            .map((i) => `${i.product_name} (${i.description})`)
                            .join(", "),
                          dateTime: `${sale.product_info.cart[0]?.location_booking_time} || ${sale.product_info.cart[0]?.SelectedServiceTime}`,
                          address: sale.product_info.cart[0]?.bookingAddress,
                          orderAmount: `₹${
                            sale.product_info.cart.reduce(
                              (sum, i) => sum + i.item_price * i.quantity,
                              0,
                            ) - sale.discount
                          }`,
                          convenienceFee: `₹${sale.product_info.cart.reduce(
                            (sum, i) =>
                              sum +
                              CalculateConvenienceFee(i.item_price * i.quantity)
                                .convenienceFee,
                            0,
                          )}`,

                          vendorbalanceAmount: `₹${
                            Math.round(
                              sale.product_info.cart.reduce(
                                (sum, i) => sum + i.item_price * i.quantity,
                                0,
                              ) 
                              -
                                sale.discount +
                                sale.product_info.cart.reduce(
                                  (sum, i) =>
                                    sum +
                                    CalculateConvenienceFee(
                                      i.item_price * i.quantity,
                                    ).convenienceFee,
                                  0,
                                ),
                            )
                             -( sale.payedAmount??0 )
                          }`,
                          Pendingpayment: `₹${Math.round(
                            Math.round(
                              0.25 *
                                Math.round(
                                  sale.product_info.cart.reduce(
                                    (sum, i) => sum + i.item_price * i.quantity,
                                    0,
                                  ) - sale.discount,
                                ) +
                                sale.product_info.cart.reduce(
                                  (sum, i) =>
                                    sum +
                                    CalculateConvenienceFee(
                                      i.item_price * i.quantity,
                                    ).convenienceFee,
                                  0,
                                ),
                            ) -( sale.payedAmount??0 ),
                          )}`,
                          balanceAmount: `₹${Math.round(
                            sale?.product_info?.cart?.reduce(
                              (sum, item) =>
                                sum +
                                Number(
                                  item.item_price * item.quantity +
                                    CalculateConvenienceFee(
                                      item.item_price * item.quantity,
                                    ).convenienceFee,
                                ),
                              0,
                            ) -
                              Number(sale?.discount || 0) -
                              Number(sale?.payedAmount || 0),
                          )}`,
                        }}
                      />
                    </td>

                    <td className="py-3 px-2 text-xs md:text-sm">
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
          <div className="flex flex-wrap justify-center items-center gap-2 mt-6">
            {" "}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-white"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                return (
                  p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1 // pages around current
                );
              })
              .map((p, i, arr) => {
                const prev = arr[i - 1];
                const showDots = prev && p - prev > 1;

                return (
                  <React.Fragment key={p}>
                    {showDots && <span className="px-2">...</span>}
                    <button
                      onClick={() => setCurrentPage(p)}
                      className={`px-4 py-2 rounded-xl ${
                        currentPage === p
                          ? "bg-blue-600 text-white"
                          : "bg-white"
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-white"
            >
              Next
            </button>
          </div>
        )}
        {openChangeResposibleVendor.status && (
       <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
  <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

    {/* Header */}
    

    {/* Body */}
    <div className="h-[40vh] overflow-y-auto px-6 py-5">
      <GetVenderData
        passVender={(data) => {
          updateResponsibleVendor(
            openChangeResposibleVendor.saleId,
            data
          );
        }}
      />
    </div>
<div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Change Responsible Vendor
        </h3>
        
      </div>

       <button
        onClick={() =>
          setOpenChangeResposibleVendor({
            status: false,
            saleId: "",
          })
        }
        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        Cancel
      </button>
    </div>
    {/* Footer */}
    

  </div>
</div>
        )}

        {modalOpen && selectedProductInfo && (
          <div className="mt-10" onClick={closeModal}>
            <div
              className={`table-container bg-white p-6 rounded-xl shadow-md overflow-x-auto ${
                showModalContent ? "opacity-100" : "opacity-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <span
                onClick={closeModal}
                className="text-3xl font-bold text-gray-400 cursor-pointer"
              >
                &times;
              </span>

              <h3 className="text-2xl font-bold mb-4">
                Product Details of {selectedProductInfo.userData.phone_number}
              </h3>

              {/* ===== Address & Date/Time (Outside Table) ===== */}
              <div className="mb-6 text-sm text-gray-700 space-y-1">
                <div>
                  <strong>Booking Address:</strong>{" "}
                  {selectedProductInfo.cart[0]?.bookingAddress}
                </div>
                <div>
                  <strong>Service Date & Time:</strong>{" "}
                  {selectedProductInfo.cart[0]?.location_booking_time} |{" "}
                  {selectedProductInfo.cart[0]?.SelectedServiceTime}
                </div>
              </div>

              {/* ================= TABLE (SUMMARY ONLY) ================= */}
              <div className="overflow-y-auto max-h-[60vh]">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                      <th className="py-3 px-6">Service Details</th>
                      <th className="py-3 px-6">Quantity</th>
                      <th className="py-3 px-6">Order Amount</th>
                      <th className="py-3 px-6">Convenience Fee</th>
                      <th className="py-3 px-6">Total</th>
                      <th className="py-3 px-6">copy</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(() => {
                      const cart = selectedProductInfo.cart;

                      const serviceDetails = cart
                        .map((i) => `${i.product_name} (${i.description})`)
                        .join(", ");

                      const quantities = cart.map((i) => i.quantity).join(", ");

                      const totalItemAmount = cart.reduce(
                        (sum, i) => sum + i.item_price * i.quantity,
                        0,
                      );

                      const totalConvenienceFee = cart.reduce(
                        (sum, i) =>
                          sum +
                          CalculateConvenienceFee(i.item_price * i.quantity)
                            .convenienceFee,
                        0,
                      );

                      const grandTotal =
                        totalItemAmount -
                        selectedProductInfo.discount +
                        totalConvenienceFee;

                      return (
                        <tr className="border-b">
                          <td className="py-4 px-6 max-w-[360px] break-words">
                            {serviceDetails}
                          </td>

                          <td className="py-4 px-6">{quantities}</td>

                          <td className="py-4 px-6">
                            ₹
                            {Math.round(
                              totalItemAmount - selectedProductInfo.discount,
                            )}
                          </td>

                          <td className="py-4 px-6">₹{totalConvenienceFee}</td>

                          <td className="py-4 px-6 font-semibold">
                            ₹{Math.round(grandTotal)}
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() =>
                                handleCopy(
                                  [
                                    "Order ID",
                                    "Service Date/Time",

                                    "Service Details",
                                    "Booking Address",
                                    "Quantity",
                                    "Order Amount",
                                    "Convenience Fee",
                                    "Total",
                                  ],
                                  [
                                    selectedProductInfo.id,
                                    `${selectedProductInfo.cart[0]?.location_booking_time} || ${selectedProductInfo.cart[0]?.SelectedServiceTime}`,

                                    serviceDetails,
                                    selectedProductInfo.cart[0]?.bookingAddress,
                                    quantities,
                                    `₹${totalItemAmount - selectedProductInfo.discount}`,
                                    `₹${totalConvenienceFee}`,
                                    `₹${grandTotal}`,
                                  ],
                                )
                              }
                              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                            >
                              Copy
                            </button>
                          </td>
                        </tr>
                      );
                    })()}
                  </tbody>
                </table>
              </div>

              {/* ================= EDIT SECTION (GRID VIEW) ================= */}
              <h4 className="text-xl font-semibold mt-10 mb-4">
                Edit Service Items
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {selectedProductInfo.cart.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border rounded-2xl shadow-sm p-6 flex flex-col justify-between min-h-[230px] hover:shadow-md transition"
                  >
                    {/* Header */}
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold text-gray-800">
                            {index + 1}. {item.product_name}
                          </h5>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.description}
                          </p>
                        </div>

                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                          Qty {item.quantity}
                        </span>
                      </div>

                      {/* Price Info */}
                      <div className="mt-4 text-sm text-gray-700 space-y-1">
                        <div>Unit Price: ₹{Math.round(item.item_price)}</div>
                        <div className="font-medium">
                          Convenience Fee: ₹
                          {
                            CalculateConvenienceFee(
                              item.item_price * item.quantity,
                            ).convenienceFee
                          }
                        </div>
                      </div>

                      <div className="font-medium">
                        Total: ₹{Math.round(item.item_price * item.quantity)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() =>
                          openEditCartModal(item, index, selectedProductInfo.id)
                        }
                        className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
                      >
                        Edit Item
                      </button>
                      <button
                        onClick={() =>
                          handleCopy(
                            [
                              "Order ID",
                              "Service Details",
                              "Service Date/Time",
                              "Booking Address",
                              "Order Amount",
                              "Quantity",
                              "Order Amount*Quantity",
                              "Convenience Fee",
                              "Total",
                            ],
                            [
                              selectedProductInfo.id,
                              `${item.product_name} || ${item.description}`,
                              `${item.location_booking_time} || ${item.SelectedServiceTime}`,
                              `${item.bookingAddress}`,
                              `₹${item.item_price}`,
                              `${item.quantity}`,
                              `₹${item.item_price * item.quantity}`,
                              `₹${
                                CalculateConvenienceFee(
                                  item.item_price * item.quantity,
                                ).convenienceFee
                              }`,
                              `₹${
                                item.item_price * item.quantity +
                                CalculateConvenienceFee(
                                  item.item_price * item.quantity,
                                ).convenienceFee
                              }`,
                            ],
                          )
                        }
                        className="border border-indigo-200 text-indigo-700 py-2 rounded-lg hover:bg-indigo-50 transition"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Existing Component */}
              <AddSalesItem
                userData={selectedProductInfo.userData}
                selectedProductInfo={selectedProductInfo}
              />
            </div>
          </div>
        )}
      </main>
      {/* Modal */}
      {editingStatus.saleId && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
  <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
    
    {/* Header */}
    <div className="border-b border-slate-100 px-6 py-5">
      <h3 className="text-lg font-semibold text-slate-900">
        Update Status
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Select a new status and add a short comment.
      </p>
    </div>

    {/* Body */}
    <div className="space-y-4 px-6 py-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Status
        </label>
        <select
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
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
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Comment
        </label>
        <textarea
          placeholder="Add comment (required)"
          value={tempComment}
          onChange={(e) => setTempComment(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
        />
      </div>
    </div>

    {/* Footer */}
    <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
      <button
        type="button"
        onClick={() =>
          setEditingStatus({ saleId: null, productIndex: null })
        }
        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={saveStatusCard}
        className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:from-orange-600 hover:to-rose-600"
      >
        Save Status
      </button>
    </div>
  </div>
</div>
      )}
      {editingStatus.serviceId && (
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
                onClick={saveServiceStatusCard}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {viewComment.saleId && (
       <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
  <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

    {/* Header */}
    <div className="border-b border-slate-100 px-6 py-5">
      <h3 className="text-lg font-semibold text-slate-900">
        Customer Comment
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        View the latest comment for this booking.
      </p>
    </div>

    {/* Body */}
    <div className="px-6 py-5">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-[120px]">
        <p className="text-sm leading-7 text-slate-700 whitespace-pre-wrap break-words">
          {viewComment.productIndex === null
            ? salesData.find((s) => s.id === viewComment.saleId)?.comment ||
              "No comment available."
            : selectedProductInfo.cart[viewComment.productIndex]?.comment ||
              "No comment available."}
        </p>
      </div>
    </div>

    {/* Footer */}
    <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
      <button
        type="button"
        onClick={() =>
          setViewComment({
            saleId: null,
            productIndex: null,
          })
        }
        className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:from-orange-600 hover:to-rose-600"
      >
        Close
      </button>
    </div>

  </div>
</div>
      )}
      {editingRow && (
      <div
  className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4"
>
  <div className="w-full max-w-2xl max-h-[88vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
    
    {/* Header */}
    <div className="px-6 py-5 border-b border-slate-100">
      <h3 className="text-lg font-semibold text-slate-900">
        Edit Sale
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Update customer, payment and booking details.
      </p>
    </div>

    {/* Body */}
    <div className="px-6 py-5 max-h-[62vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          "name",
          "phone",
          "WhatsApp_Mobile_Number",
          "discount",
          "BalanceAmount",
          "payedAmount",
          "booking_Date",
          "booking_Time",
        ].map((field) => (
          <div className="relative" key={field}>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              {field.replaceAll("_", " ")}
            </label>

            {field === "booking_Date" && (
              <input
                type="date"
                value={rowForm[field]}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setRowForm((prev) => ({
                    ...prev,
                    [field]: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            )}

            {field === "booking_Time" && (
              <>
                <input
                  type="text"
                  readOnly
                  value={rowForm.booking_Time || ""}
                  placeholder="Select Time Slot"
                  onClick={() => setOpen((prev) => !prev)}
                  className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                />

                {open && (
                  <div className="absolute left-0 right-0 z-[1200] mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
                    <div className="max-h-56 overflow-y-auto">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {timeSlots.map((slot, index) => {
                          const [start, end] = slot.split(" - ");

                          return (
                            <button
                              type="button"
                              key={index}
                              onClick={() => {
                                setRowForm((prev) => ({
                                  ...prev,
                                  booking_Time: slot,
                                }));
                                setOpen(false);
                              }}
                              className={`rounded-xl border px-3 py-2 text-center transition
                                ${
                                  rowForm.booking_Time === slot
                                    ? "border-orange-400 bg-orange-50 text-orange-700 shadow-sm"
                                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                                }`}
                            >
                              <span className="block text-sm font-semibold">
                                {start}
                              </span>
                              <span className="block text-[10px] text-slate-400">
                                to
                              </span>
                              <span className="block text-sm font-semibold">
                                {end}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {!["booking_Date", "booking_Time"].includes(field) && (
              <input
                type={
                  field === "discount" || field === "payedAmount"
                    ? "number"
                    : "text"
                }
                value={rowForm[field]}
                onChange={(e) =>
                  setRowForm((prev) => ({
                    ...prev,
                    [field]:
                      field === "discount" || field === "payedAmount"
                        ? Number(e.target.value)
                        : e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
              />
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Footer */}
    <div className="flex items-center justify-end gap-3 bg-slate-50 px-6 py-4 border-t border-slate-100">
      <button
        type="button"
        onClick={() => setEditingRow(null)}
        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={saveEditedRow}
        className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:from-orange-600 hover:to-rose-600"
      >
        Save Changes
      </button>
    </div>
  </div>
</div>
      )}
      {isEditCartModalOpen && (
       <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
  <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

    {/* Header */}
    <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Edit Cart Product
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Update booking, product and pricing details.
        </p>
      </div>
    </div>

    {/* Body */}
    <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Product Name
          </label>
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
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Booking Address
          </label>
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
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Booking Date
          </label>
          <input
            type="date"
            value={
              editingCartProduct?.productData?.location_booking_time
                ? (() => {
                    let dateValue =
                      editingCartProduct.productData.location_booking_time;

                    if (/^\d{2}-\d{2}-\d{2}$/.test(dateValue)) {
                      const [yy, mm, dd] = dateValue.split("-");
                      dateValue = `20${yy}-${mm}-${dd}`;
                    }

                    return new Date(dateValue).toISOString().split("T")[0];
                  })()
                : ""
            }
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) =>
              setEditingCartProduct((prev) => ({
                ...prev,
                productData: {
                  ...prev.productData,
                  location_booking_time: e.target.value,
                },
              }))
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
          />
        </div>

        <div className="relative">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Booking Time
          </label>

          <input
            type="text"
            readOnly
            name="SelectedServiceTime"
            value={editingCartProduct?.productData?.SelectedServiceTime || ""}
            placeholder="Select Time"
            onClick={() => setOpen((prev) => !prev)}
            className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
          />

          {open && (
            <div className="absolute left-0 right-0 z-[1200] mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
              <div className="max-h-56 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeSlots.map((slot, index) => {
                    const [start, end] = slot.split(" - ");

                    return (
                      <button
                        type="button"
                        key={index}
                        onClick={() => {
                          setEditingCartProduct((prev) => ({
                            ...prev,
                            productData: {
                              ...prev.productData,
                              SelectedServiceTime: slot,
                            },
                          }));
                          setOpen(false);
                        }}
                        className={`rounded-xl border px-3 py-2 text-center transition ${
                          editingCartProduct?.productData
                            ?.SelectedServiceTime === slot
                            ? "border-orange-400 bg-orange-50 text-orange-700 shadow-sm"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="block text-sm font-semibold">
                          {start}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          to
                        </span>
                        <span className="block text-sm font-semibold">
                          {end}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>
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
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Item Price
          </label>
          <input
            type="number"
            value={editingCartProduct?.productData?.item_price}
            onChange={(e) =>
              setEditingCartProduct((prev) => ({
                ...prev,
                productData: {
                  ...prev.productData,
                  item_price: Number(e.target.value),
                },
              }))
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Quantity
          </label>
          <input
            type="number"
            value={editingCartProduct?.productData?.quantity}
            onChange={(e) =>
              setEditingCartProduct((prev) => ({
                ...prev,
                productData: {
                  ...prev.productData,
                  quantity: Number(e.target.value),
                },
              }))
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Convenience Fee
          </label>
          <input
            type="number"
            value={
              CalculateConvenienceFee(
                editingCartProduct?.productData?.item_price *
                  editingCartProduct?.productData?.quantity
              ).convenienceFee
            }
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Total Price
          </label>
          <input
            type="number"
            value={
              (editingCartProduct?.productData?.item_price +
                CalculateConvenienceFee(
                  editingCartProduct?.productData?.item_price *
                    editingCartProduct?.productData?.quantity
                ).convenienceFee) *
              editingCartProduct?.productData?.quantity
            }
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
          />
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
      <button
        type="button"
        onClick={() => {
          setIsEditCartModalOpen(false);
          setModalOpen(true);
        }}
        className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={() => saveCartEdit(editingCartProduct)}
        className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:from-orange-600 hover:to-rose-600"
      >
        Save Changes
      </button>
    </div>
  </div>
</div>
      )}
    </div>
  );
}
