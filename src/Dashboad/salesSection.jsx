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
        sale.responsible
          ?.toLowerCase()==filters.responsible.toLowerCase()
          
      )
        return true;

      if (filters.status) {
        const saleStatus = sale.status?.toLowerCase() || "";

        const filterStatus = filters.status?.toLowerCase();

        if (filterStatus === "pending") {
          // allow empty or pending
          if (saleStatus !== "" && !saleStatus.includes("pending")) {
            return false;
          }
        } else if (filterStatus) {
          // normal status filter
          if (!saleStatus.includes(filterStatus)) {
            return false;
          }
        }
      }

      if (filters.orderId && !sale.orderId?.includes(filters.orderId))
        return false;

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

      return true;
    });

    setFilteredData(result);
  };

  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const showProductInfo = (sale) => {
    
    setsaleDataTem(sale);
    setSelectedProductInfo({
      ...sale.product_info,
      id: sale.id,
      discount:sale.discount,
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
      // email: sale.email || "",
      phone: sale.phone_number || "",
      WhatsApp_Mobile_Number: sale.ConfurmWhatsAppMobileNumber || "",

      // pincode: sale.pincode || "",
      discount: sale.discount || "",

      // payableAmount: total - sale.payedAmount || "",
      payedAmount: sale.payedAmount || "",

      dateTime: sale.date_time
        ? new Date(sale.date_time).toISOString().slice(0, 16)
        : "",
    });
  };
  const saveEditedRow = async () => {
    try {
      let updateSalesData = {
        name: rowForm.name,

        phone_number: rowForm.phone,
        ConfurmWhatsAppMobileNumber: rowForm.WhatsApp_Mobile_Number,
        discount: rowForm.discount,
        date_time: new Date(rowForm.dateTime).toISOString(),
      };
      const response = await updateSale(rowForm.orderId, updateSalesData);
      if (response.status != 200) {
        alert(response.data.message);

        return;
      }

      const saleRef = doc(firestore, "sales", editingRow);

      await setDoc(saleRef, updateSalesData, { merge: true });

      setSalesData((prev) =>
        prev.map((s) =>
          s.id === editingRow
            ? {
                ...s,
                name: rowForm.name,

                phone_number: rowForm.phone,
                WhatsApp_Mobile_Number: rowForm.WhatsApp_Mobile_Number,
                discount: rowForm.discount,
                date_time: new Date(rowForm.dateTime).toISOString(),
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
      console.log(data.productData)
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
  // -----------------------------------------------
  // const openServiceStatusCard = (
  //   orderId,
  //   serviceId,
  //   currentStatus,
  //   currentComment = "",
  //   isProduct = false,
  //   index = null
  // ) => {
  //   setEditingStatus({ saleId: orderId, serviceId, isProduct, index });
  //   setTempStatus(currentStatus);
  //   setTempComment(currentComment);
  // };
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

        <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
          {/* ROW 1 — TEXT + SINGLE DATE */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-2">
            <input
              type="number"
              placeholder="Phone"
              value={filters.phone}
              onChange={(e) =>
                setFilters((p) => ({ ...p, phone: Number(e.target.value) }))
              }
              className="p-2 border rounded-md text-sm"
            />

            <input
              type="text"
              placeholder="Name"
              value={filters.name}
              onChange={(e) =>
                setFilters((p) => ({ ...p, name: e.target.value }))
              }
              className="p-2 border rounded-md text-sm"
            />

            <input
              type="text"
              placeholder="Order ID"
              value={filters.orderId}
              onChange={(e) =>
                setFilters((p) => ({ ...p, orderId: Number(e.target.value) }))
              }
              className="p-2 border rounded-md text-sm"
            />

            <input
              type="text"
              placeholder="Status"
              value={filters.status}
              onChange={(e) =>
                setFilters((p) => ({ ...p, status: e.target.value }))
              }
              className="p-2 border rounded-md text-sm"
            />

           <select
  value={filters.responsible}
  onChange={(e) =>
    setFilters((p) => ({ ...p, responsible: e.target.value }))
  }
  className="p-2 border rounded-md text-sm"
>
  <option value="">----Select----</option>
  {responsiblePersons.map((person) => (
    <option
      key={person._id}
      value={person.ResponsiblePersonName}
    > 
      {person.ResponsiblePersonName}
    </option>
  ))}
</select>

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
              className="p-2 border rounded-md text-sm"
            />

            <button
              onClick={applyFilters}
              className="p-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Apply
            </button>
          </div>

          {/* ROW 2 — DATE RANGE + CLEAR */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
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
              className="p-2 border rounded-md text-sm"
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
              className="p-2 border rounded-md text-sm"
            />

            <div className="hidden md:block" />
            <div className="hidden md:block" />
            <div className="hidden md:block" />

            <button
              onClick={clearFilters}
              className="p-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200"
            >
              Clear
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

                    <td className="py-4 px-2">{sale.name}</td>

                    <td className="py-4 px-2">
                      {sale.phone_number}
                      <br /> /W {sale.ConfurmWhatsAppMobileNumber}
                    </td>
                    <td className="py-4 px-2">
                      <button
                        onClick={() => showProductInfo(sale)}
                        className="text-blue-600 cursor-pointer"
                      >
                        View Details
                      </button>
                    </td>

                    <td className="py-4 px-2">
                      ₹
                      {sale?.product_info?.cart?.reduce(
                        (sum, item) =>
                          sum +
                          Number(
                            item.item_price * item.quantity 
                          ),
                        0,
                      )}
                    </td>
                    <td className="py-4 px-2">
                      ₹{Number(sale?.discount || 0)}
                    </td>
                    <td className="py-4 px-2">
                      ₹{sale?.product_info?.cart?.reduce(
                        (sum, item) =>
                          sum +
                          Number(
                            
                              CalculateConvenienceFee(
                                item.item_price * item.quantity,
                              ).convenienceFee,
                          ),
                        0,
                      ) 
                        
                       }
                    </td>
  


                    <td className="py-4 px-2">
                      ₹
                      {sale?.product_info?.cart?.reduce(
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
                        Number(sale?.payedAmount || 0)}
                    </td>
                    <td className="py-4 px-2">₹{sale.payedAmount}</td>

                    <td className="py-4 px-2">
                      {normalizeDate(sale.date_time)}
                      <br />
                      {new Date(sale.date_time).toLocaleTimeString()}
                    </td>
                    <td className="py-4 px-2">
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

                    {/* <SendToVendorPopup
        open={sendToOpen}
        onClose={() => setSendToOpen(false)}
        userNumber={state.phone_number || ""}
        onSend={async (numbersPayload) => {
         
          const userMsg = `Hi from urbanauracs.com this is your invoice generated on ${normalizeDate(
            showSendInvoice.generatedInvoiceDate_time
          )} ${state.invoice}`;

          const res = await sendToVenderUserPersonwhatsapp(numbersPayload, {
            venederMsg: userMsg,
            userMsg,
          });
         
          if (res?.status === "success" && res?.results?.length) {
            const successMessages = res.results
              .map((r) => `✔ ${r.number}: ${r.response?.message}`)
              .join("\n");

            alert(successMessages); // or toast.success(...)
            setSendToOpen(false);
          }
        }}
      /> */}
                    <td className="py-4 px-2">
                      {responsiblePersons && responsiblePersons.length > 0 ? (
                        tagAccess?.includes("Admin") ? (
                          <select
                            value={sale.responsible || ""}
                            onChange={(e) =>
                              updateResponsiblePerson(sale.id, e.target.value)
                            }
                            className="
          w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
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
                    <td>
                      <WhatsappChatCard
                        phone={`91${sale.ConfurmWhatsAppMobileNumber}`}
                        buttonText="Send WhatsApp Message"
                        data={{
                          vendorName: "",
                          customerName: sale.name,
                          serviceId: sale.id,
discount:sale.discount,
                          Responsible: sale.responsible || "______",
                          otp: Math.floor(10 + Math.random() * 90) * 100 + 25,
                          serviceDetails: sale.product_info.cart
                            .map((i) => `${i.product_name} (${i.description})`)
                            .join(", "),
                          dateTime: `${sale.product_info.cart[0]?.location_booking_time} || ${sale.product_info.cart[0]?.SelectedServiceTime}`,
                          address: sale.product_info.cart[0]?.bookingAddress,
                          orderAmount: `₹${sale.product_info.cart.reduce(
                            (sum, i) => sum + i.item_price * i.quantity,
                            0,
                          )-sale.discount}`,
                          convenienceFee: `₹${sale.product_info.cart.reduce(
                            (sum, i) =>
                              sum +
                              CalculateConvenienceFee(i.item_price * i.quantity)
                                .convenienceFee,
                            0,
                          )}`,
                          balanceAmount: `₹${
                            sale.product_info.cart.reduce(
                              (sum, i) => sum + i.item_price * i.quantity,
                              0,
                            ) -sale.discount +
                            sale.product_info.cart.reduce(
                              (sum, i) =>
                                sum +
                                CalculateConvenienceFee(
                                  i.item_price * i.quantity,
                                ).convenienceFee,
                              0,
                            )
                          }`,
                        }}
                      />
                    </td>

                    <td className="py-4 px-2">
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

                      const grandTotal = totalItemAmount - selectedProductInfo.discount + totalConvenienceFee;

                      return (
                        <tr className="border-b">
                          <td className="py-4 px-6 max-w-[360px] break-words">
                            {serviceDetails}
                          </td>

                          <td className="py-4 px-6">{quantities}</td>

                          <td className="py-4 px-6">₹{totalItemAmount- selectedProductInfo.discount}</td>

                          <td className="py-4 px-6">₹{totalConvenienceFee}</td>

                          <td className="py-4 px-6 font-semibold">
                            ₹{grandTotal}
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
                                    `₹${totalItemAmount- selectedProductInfo.discount}`,
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
                        <div>Unit Price: ₹{item.item_price}</div>
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
                        Total: ₹{item.item_price * item.quantity}
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
              // "email",
              "phone",
              "WhatsApp_Mobile_Number",

              // "pincode",
              "discount",

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
                  type={
                    field === "dateTime"
                      ? "datetime-local"
                      : field === "discount" || field === "payedAmount"
                        ? "number"
                        : "text"
                  }
                  className="border p-2 w-full rounded-md"
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
            <label className="block text-sm font-medium mb-1">
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
              className="w-full border px-3 py-2 mb-3 rounded"
            />

            {/* Booking Address */}
            <label className="block text-sm font-medium mb-1">
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
              className="w-full border px-3 py-2 mb-3 rounded"
            />

            {/* Booking Date */}
            <label className="block text-sm font-medium mb-1">
              Booking Date
            </label>
            <input
              type="date"
              value={
                editingCartProduct?.productData?.location_booking_time
                  ? new Date(
                      editingCartProduct.productData.location_booking_time,
                    )
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
            <label className="block text-sm font-medium mb-1">
              Booking Time
            </label>

            <div className="relative">
              <input
                type="text"
                readOnly
                name="SelectedServiceTime"
                required
                value={
                  editingCartProduct?.productData?.SelectedServiceTime || ""
                }
                placeholder="Select Time"
                onClick={() => setOpen((prev) => !prev)}
                className="mt-1 block w-full px-4 py-2 bg-zinc-100 border border-zinc-300 rounded-xl shadow-sm cursor-pointer focus:ring-zinc-500 focus:border-zinc-500"
              />

              {open && (
                <div className="absolute z-50 mt-2 w-full bg-gray-900 rounded-xl shadow-xl p-4 max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-3 gap-3">
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
                          className={`px-3 py-2 rounded-lg transition flex flex-col items-center text-center
                ${
                  editingCartProduct?.productData?.SelectedServiceTime === slot
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }
              `}
                        >
                          <span className="text-sm font-semibold">{start}</span>
                          <span className="text-[10px] opacity-70 leading-tight">
                            to
                          </span>
                          <span className="text-sm font-semibold">{end}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <label className="block text-sm font-medium mb-1">
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
              className="w-full border px-3 py-2 mb-3 rounded"
            />
            {/* --------------------------------------------------------------------------------------------------------------------------------- */}
            <label className="block text-sm font-medium mb-1">Item Price</label>
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
              className="w-full border px-3 py-2 mb-3 rounded"
            />
            <label className="block text-sm font-medium mb-1">Quantity</label>
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
              className="w-full border px-3 py-2 mb-3 rounded"
            />
            <label className="block text-sm font-medium mb-1">
              Convenience Fee
            </label>
            <input
              type="number"
              value={
                CalculateConvenienceFee(
                  editingCartProduct?.productData?.item_price *
                    editingCartProduct?.productData?.quantity,
                ).convenienceFee
              }
              disabled={true}
              className="w-full border px-3 py-2 mb-3 rounded"
            />

            <label className="block text-sm font-medium mb-1">
              Total Price
            </label>
            <input
              type="number"
              value={
                (editingCartProduct?.productData?.item_price +
                  CalculateConvenienceFee(
                    editingCartProduct?.productData?.item_price *
                      editingCartProduct?.productData?.quantity,
                  ).convenienceFee) *
                editingCartProduct?.productData?.quantity
              }
              disabled={true}
              className="w-full border px-3 py-2 mb-3 rounded"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setIsEditCartModalOpen(false);
                  setModalOpen(true);
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
