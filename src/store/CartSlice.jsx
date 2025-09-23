import { createSlice } from '@reduxjs/toolkit';

// Function to load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('cart');
    const authState = localStorage.getItem('auth');
    return {
      items: serializedState ? JSON.parse(serializedState) : [],
      isAuthenticated: authState === 'true'
    };
  } catch (error) {
    console.error("Failed to load state from localStorage:", error);
    return {
      items: [],
      isAuthenticated: false
    };
  }
};

// Function to save state to localStorage
const saveState = (state) => {
  try {
    localStorage.setItem('cart', JSON.stringify(state.items));
    localStorage.setItem('auth', state.isAuthenticated);
  } catch (error) {
    console.error("Failed to save state to localStorage:", error);
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    ...loadState(), // Load cart items and auth status
    isOpen: false,
    authPopupOpen: false
  },
  reducers: {
    addItem: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
          state.items.push({
          ...action.payload,
          quantity: 1,
          bookingAddress:action.payload.bookingAddress??null,
          deviceLocation:action.payload.deviceLocation??null,
          SelectedServiceTime:action.payload.SelectedServiceTime??null,
          
          productId:action.payload.id,
          vendorId: action.payload.vendorId ?? null,
          vendorName: action.payload.vendorName ?? null,
          vendorLocation: action.payload.vendorLocation ?? action.payload.location ?? null,
          vendorImage: action.payload.vendorImage ?? null,
        });
      }
      saveState(state);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveState(state);
    },
    clearCart: (state) => {
      state.items = [];
      saveState(state);
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    // New reducers for authentication and popup management
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
      saveState(state);
    },
    setAuthPopupOpen: (state, action) => {
      state.authPopupOpen = action.payload;
    }
  },
});

// Export all actions and new selectors
export const { addItem, removeItem, clearCart, toggleCart, closeCart, setAuthenticated, setAuthPopupOpen } = cartSlice.actions;

export const selectCartItemCount = (state) => state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotal = (state) => state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectIsAuthenticated = (state) => state.cart.isAuthenticated;
export const selectIsAuthPopupOpen = (state) => state.cart.authPopupOpen;

export default cartSlice.reducer;