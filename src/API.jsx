import axios from "axios";
import { firestore } from "./firebaseCon";

import { collection, getDocs } from "firebase/firestore";
export const API_BASE_URL = "https://urbanaurabzcs.xyz";
// export const API_BASE_URL = "http://localhost:8000";

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

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const handleBuy = async (data, action) => {
  // Step 1: Load Razorpay SDK
  const loaded = await loadScript(
    "https://checkout.razorpay.com/v1/checkout.js"
  );
  if (!loaded) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  // Step 2: Create order on backend

  const res = await axios.post(`${API_BASE_URL}/BuyService/create-order`, data);
  const order = res.data;

  // Step 3: Open Razorpay checkout
  const options = {
    key: "rzp_test_Rp3tT245sBz1CU", // <-- put your test key_id here
    amount: order.amount,
    currency: order.currency,
    name: "My Home Cleaning Services",
    description: "Order Payment",
    order_id: order.id,
    handler: async function (response) {
      try {
        // Send payment details + buyer info + message to backend
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
    prefill: {
      name: data.name,
      contact: data.mobileNumber,
    },
    theme: { color: "#3399cc" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
