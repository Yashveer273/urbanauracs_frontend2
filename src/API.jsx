import axios from "axios";

export const API_BASE_URL = "http://localhost:8000"; // change if deployed

export const updateUser = async (userId, updateData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update/${userId}`, updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error.response?.data || error.message);
    throw error;
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
    console.error("Error updating user:", error.response?.data || error.message);
    throw error;
  }
};

export const updateSale = async (orderId,updateSalesData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/update/SalesData/${orderId}`, updateSalesData);
    console.log("✅ Update successful:", response.data);
    return response;
  } catch (error) {
    console.error("❌ Update failed:", error);
    return error.response;
  }
};
export const getVendersData=async()=>{
 const res= await axios.get(`${API_BASE_URL}/api/vendors`);
return res;
}
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
