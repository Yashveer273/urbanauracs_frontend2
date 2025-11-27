import { createSlice } from "@reduxjs/toolkit";

const initialState = {
name: "",
      mobileNumber: "",
      advance:0,
      left_amount:0,
      oGtotal_price:0,
      total_price:0,
      status:"",
      date:"",
      orderId:"",
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrder: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearOrder: () => initialState,
  },
});

export const { setOrder, clearOrder } = orderSlice.actions;
export const selectOrder = (state) => state.order;
export default orderSlice.reducer;
