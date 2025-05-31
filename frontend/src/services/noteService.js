// frontend/src/services/noteService.js
import axios from 'axios';

// The base URL for our API.
// Assuming Vite proxy is set up for /api in vite.config.js
const API_BASE_URL = '/api/notes';

// Helper function to create the authorization header
const getConfig = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/**
 * Fetches all notes for the logged-in user.
 * @param {string} token - The JWT token for authentication.
 * @param {string} searchTerm - Optional search term.
 * @param {string} sortBy - Optional sort criteria (e.g., 'createdAt:desc').
 * @returns {Promise<Array>} An array of note objects.
 * @throws {Error} If the request fails.
 */
export const apiFetchNotes = async (token, searchTerm = '', sortBy = 'createdAt:desc') => {
  try {
    const params = {};
    if (searchTerm) {
      params.search = searchTerm;
    }
    if (sortBy) {
      params.sortBy = sortBy;
    }

    const response = await axios.get(API_BASE_URL, {
      ...getConfig(token),
      params, // Send search and sort criteria as query parameters
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw new Error(message);
  }
};

/**
 * Fetches a single note by its ID.
 * @param {string} token - The JWT token.
 * @param {string} noteId - The ID of the note to fetch.
 * @returns {Promise<object>} The note object.
 * @throws {Error} If the request fails.
 */
export const apiGetNoteById = async (token, noteId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${noteId}`, getConfig(token));
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw new Error(message);
  }
};

/**
 * Creates a new note.
 * @param {string} token - The JWT token.
 * @param {object} noteData - Object containing { title, content }.
 * @returns {Promise<object>} The newly created note object.
 * @throws {Error} If the request fails.
 */
export const apiCreateNote = async (token, noteData) => {
  try {
    const response = await axios.post(API_BASE_URL, noteData, getConfig(token));
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw new Error(message);
  }
};

/**
 * Updates an existing note.
 * @param {string} token - The JWT token.
 * @param {string} noteId - The ID of the note to update.
 * @param {object} noteData - Object containing { title, content }.
 * @returns {Promise<object>} The updated note object.
 * @throws {Error} If the request fails.
 */
export const apiUpdateNote = async (token, noteId, noteData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${noteId}`, noteData, getConfig(token));
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw new Error(message);
  }
};

/**
 * Deletes a note.
 * @param {string} token - The JWT token.
 * @param {string} noteId - The ID of the note to delete.
 * @returns {Promise<object>} Response data (usually a success message).
 * @throws {Error} If the request fails.
 */
export const apiDeleteNote = async (token, noteId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${noteId}`, getConfig(token));
    return response.data; // Backend should send { message: 'Note removed successfully' }
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw new Error(message);
  }
};
