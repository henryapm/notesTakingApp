// frontend/src/store/authStore.js
import { create } from 'zustand';
import { apiLoginUser, apiRegisterUser } from '../services/authService.js';

const getInitialUser = () => {
  try {
    const item = localStorage.getItem('userInfo');
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Failed to parse user info from localStorage", error);
    return null;
  }
};

const getInitialToken = () => {
  try {
    return localStorage.getItem('userToken') || null;
  } catch (error) {
    console.error("Failed to get user token from localStorage", error);
    return null;
  }
};

const useAuthStore = create((set) => ({
  // --- State ---
  user: getInitialUser(),
  token: getInitialToken(),
  isLoading: false,
  error: null,
  
  // --- Actions ---
  loginUser: async (username, password) => {
    set({ isLoading: true, error: null }); // Clear previous errors
    try {
      const data = await apiLoginUser(username, password); 
      const userData = { _id: data._id, username: data.username };
      localStorage.setItem('userInfo', JSON.stringify(userData));
      localStorage.setItem('userToken', data.token);
      set({ 
        user: userData, 
        token: data.token, 
        isLoading: false, 
        error: null 
      });
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Login failed';
      set({ error: errorMessage, isLoading: false, user: null, token: null });
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userToken');
      throw new Error(errorMessage);
    }
  },

  registerUser: async (username, password) => {
    set({ isLoading: true, error: null }); // Clear previous errors
    try {
      const data = await apiRegisterUser(username, password);
      const userData = { _id: data._id, username: data.username };
      localStorage.setItem('userInfo', JSON.stringify(userData));
      localStorage.setItem('userToken', data.token);
      set({ 
        user: userData, 
        token: data.token, 
        isLoading: false, 
        error: null 
      });
      return data;
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      set({ error: errorMessage, isLoading: false, user: null, token: null });
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userToken');
      throw new Error(errorMessage);
    }
  },

  logoutUser: () => {
    set({ user: null, token: null, error: null, isLoading: false });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userToken');
    console.log("User logged out");
  },

  // New action to set authentication-related errors
  setAuthError: (errorMessage) => {
    set({ error: errorMessage });
  },

  // Optional: Action to clear errors, can be called on route changes or form interactions
  clearAuthError: () => {
    set({ error: null });
  }
}));

export default useAuthStore;
