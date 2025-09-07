import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  mobileNumber: "",
  amount: 0,
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
