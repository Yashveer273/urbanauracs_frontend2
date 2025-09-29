import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import cartReducer from "./CartSlice";
import orderReducer from "./orderSlices";
import socialLinksReducer from "./socialLinks";
import chatboxReducer from "./chatboxSlice"; 
// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("reduxState");
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state", err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("reduxState", serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    order:orderReducer,
    socialLinks: socialLinksReducer,
    chatbox: chatboxReducer,
  },
  preloadedState,
});

// Persist store to localStorage whenever state changes
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
