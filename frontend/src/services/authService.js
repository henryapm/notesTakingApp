// frontend/src/services/authService.js
import axios from 'axios';

// The base URL for our API.
// If you've set up a proxy in vite.config.js (e.g., for /api),
// you can just use relative paths like '/api/auth/login'.
// Otherwise, you'd use the full backend URL e.g., 'http://localhost:5001/api/auth'
const API_BASE_URL = '/api/auth'; // Assuming Vite proxy is set up for /api

/**
 * Registers a new user.
 * @param {string} username - The username.
 * @param {string} password - The password.
 * @returns {Promise<object>} The response data from the server (user object and token).
 * @throws {Error} If the request fails.
 */
export const apiRegisterUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      username,
      password,
    });
    // The backend should return data like { _id, username, token, message }
    return response.data;
  } catch (error) {
    // Axios wraps the error response in error.response
    // We throw a new error with a more specific message if available from backend
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw new Error(message);
  }
};

/**
 * Logs in an existing user.
 * @param {string} username - The username.
 * @param {string} password - The password.
 * @returns {Promise<object>} The response data from the server (user object and token).
 * @throws {Error} If the request fails.
 */
export const apiLoginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      username,
      password,
    });
    // The backend should return data like { _id, username, token, message }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw new Error(message);
  }
};

// You could also add a service for fetching the current user's profile if needed,
// though it's often handled directly where user data is displayed or in a protected route component.
// Example:
/*
export const apiGetMe = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${API_BASE_URL}/me`, config);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw new Error(message);
  }
};
*/
