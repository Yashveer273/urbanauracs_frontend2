import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: [],
  history: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
  loginUser: (state, action) => {
   const data = action.payload;
      state.user = {
        ConfurmWhatsAppMobileNumber: data.ConfurmWhatsAppMobileNumber,
        userId:data.userId,
        username: data.username,
        email: data.email,
        mobileNumber: data.mobileNumber,
        token: data.token,
        location: data.location,
        countryCode: data.countryCode,
        pincode: data.pincode,
      };
  },
  setUser: (state, action) => {
    state.user = action.payload;  // direct overwrite
  },
  logoutUser: (state) => {
    state.user = [];
    state.history = [];
    
  },
  addToHistory: (state, action) => {
    state.history.push(action.payload);
  },
}
});

export const { loginUser, logoutUser, addToHistory, setUser } =
  userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectUserHistory = (state) => state.user.history;

export default userSlice.reducer;
