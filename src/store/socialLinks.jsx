import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  links: [], // array of social link objects
};

const socialLinks = createSlice({
  name: "socialLinks",
  initialState,
  reducers: {
    // Set entire array
    setLinks: (state, action) => {
      state.links = action.payload;
    },
    // Add a single new link
    addLink: (state, action) => {
      state.links.push(action.payload);
    },
    // Update by id
    updateLink: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.links.findIndex((link) => link.id === id);
      if (index !== -1) {
        state.links[index] = { ...state.links[index], ...updates };
      }
    },
    // Delete by id
    deleteLink: (state, action) => {
      state.links = state.links.filter((link) => link.id !== action.payload);
    },
    // Clear all
    clearLinks: (state) => {
      state.links = [];
    },
  },
});

export const { setLinks, addLink, updateLink, deleteLink, clearLinks } =
  socialLinks.actions;

export const selectSocialLinks = (state) => state.socialLinks.links;

export default socialLinks.reducer;
