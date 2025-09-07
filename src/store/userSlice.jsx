import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  history: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
  loginUser: (state, action) => {
    state.user = { username: action.payload.username };
  },
  setUser: (state, action) => {
    state.user = action.payload;  // direct overwrite
  },
  logoutUser: (state) => {
    state.user = null;
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
