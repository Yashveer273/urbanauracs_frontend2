import axios from "axios";
import { firestore } from "./firebaseCon";

import { collection, doc, getDoc, getDocs } from "firebase/firestore";
export const API_BASE_URL = "https://urbanaurabzcs.xyz";
// export const API_BASE_URL = "http://localhost:8000";


export const fetchImages = async () => {
  try {
    const sliderDocRef = doc(firestore, "homeCleaningSlider", "mainDoc");
    const snap = await getDoc(sliderDocRef);

    if (snap.exists()) {
     
    return  snap.data().data || []
    } 
  } catch (error) {
    console.error("Error fetching slider images:", error);
    return []
  }
};


export const updateStatusOrCommentDB = async ( status,orderId) => {

  try {
    const response = await axios.post(
      `${API_BASE_URL}/sales/updateStatus`,
      { status,orderId }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const updateUser = async (userId, updateData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/update/${userId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const fetchSocialLinks = async () => {
  try {
    const querySnapshot = await getDocs(collection(firestore, "socialLinks"));
    let links = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      const createdAt = data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : null;

      const updatedAt = data.updatedAt?.toDate
        ? data.updatedAt.toDate().toISOString()
        : null;

      links.push({ id: doc.id, ...data, createdAt, updatedAt });
    });

    return links;
  } catch (error) {
    console.error("Error fetching social links:", error);
    return [];
  }
};

export const fetchProdDataDESC = async () => {
  try {
    const snapshot = await getDocs(
      collection(firestore, "homeCleaningServiceDB")
    );

    // Step 1: get raw data
    let result = snapshot.docs.map((doc) => doc.data());

    // Step 2: reverse order of main list by ID
    result.sort((a, b) => (b.id || 0) - (a.id || 0));

    // Step 3: reverse order inside each "data" array
    result = result.map((item) => ({
      ...item,
      data: Array.isArray(item.data)
        ? [...item.data].sort((a, b) => (b.id || 0) - (a.id || 0))
        : [], // fallback
    }));

    console.log("FINAL REVERSED DATA:", result);

    return result;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

export const login = async (mobileNumber, logtoken) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/login`, {
      mobileNumber,
      token: logtoken,
    });

    return res;
  } catch (error) {
    console.error(
      "Error updating user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateSale = async (orderId, updateSalesData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/update/SalesData/${orderId}`,
      updateSalesData
    );
    console.log("✅ Update successful:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Update failed:", error);
    return error.response;
  }
};
export const getVendersData = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/vendors`);
  return res;
};
export const getMyOrderHistory = async (userId, page = 1, limit = 10) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/order-history/${userId}?page=${page}&limit=${limit}`
    );

    console.log("✅ Order History:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Failed to fetch order history:", error);
    return error.response;
  }
};



export const handleBuy = async (data, action) => {
  // Step 1: Load Razorpay SDK


  // Step 2: Create order on backend

  const res = await axios.post(`${API_BASE_URL}/BuyService/create-order`, data);
  const order = res.data;
   if (!window.Razorpay) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }

  // Step 3: Open Razorpay checkout
  const options = {
    key:order.key, 
    amount: order.amount,
    currency: "INR",
    name: "UrbenAuraServices",
    description: "Order Payment",
    order_id: order.id,
     prefill: {
      name: data.name,
      email: data.user?.email,
      contact: data.mobileNumber,
    },
    
    handler: async function (response) {

      try {
        const res = await axios.post(
          `${API_BASE_URL}/BuyService/verify-payment`,
          {
            data: data,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            buyer_name: data.name, // <-- custom field
            message: "Payment Successful", // <-- custom field
          }
        );

        await action(res, data);

        return res;
      } catch (err) {
        console.error("Payment verification failed:", err);
        alert("Payment verification failed!");
        return err.response;
      }
    },
   
    theme: { color: "#cc4f33ff" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};


export const handlePaymentLeft = async (data, action) => {

 

  // Step 1: Create order on backend

  const res = await axios.post(`${API_BASE_URL}/BuyService/handlePaymentLeft`, data);
  const order = res.data;
 if (!window.Razorpay) {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          document.body.appendChild(script);
        });
      }
  // Step 3: Open Razorpay checkout
  const options = {
     // <-- put your test key_id here
    key:order.key, 
    amount: order.amount,
    currency: order.currency,
    name: "My Home Cleaning Services",
    description: "Order Payment",
    order_id: order.id,
    handler: async function (response) {
      try {
        // Send payment details + buyer info + message to backend
        const res = await axios.post(
          `${API_BASE_URL}/BuyService/handlePaymentLeft/verify-payment`,
          {
            data: data,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            buyer_name: data.name, // <-- custom field
            message: "Payment Successful", // <-- custom field
          }
        );

        await action(res, data);

        return res;
      } catch (err) {
        console.error("Payment verification failed:", err);
        alert("Payment verification failed!");
        return err.response;
      }
    },
    prefill: {
      name: data.name,
      contact: data.mobileNumber,
    },
    theme: { color: "#cc4f33ff" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};