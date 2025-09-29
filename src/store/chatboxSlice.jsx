import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: false,
};

const chatboxSlice = createSlice({
  name: "chatbox",
  initialState,
  reducers: {
    openChatbox: (state) => {
      state.isOpen = true;
    },
    closeChatbox: (state) => {
      state.isOpen = false;
    },
    toggleChatbox: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openChatbox, closeChatbox, toggleChatbox } = chatboxSlice.actions;
export const selectChatbox = (state) => state.chatbox.isOpen;
export default chatboxSlice.reducer;
