// frontend/src/store/noteStore.js
import { create } from 'zustand';
// Import the actual service functions
import {
  apiFetchNotes,
  apiGetNoteById,
  apiCreateNote,
  apiUpdateNote,
  apiDeleteNote
} from '../services/noteService.js';
import useAuthStore from './authStore.js'; // To get the token for API calls

const useNoteStore = create((set, get) => ({
  // --- State ---
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,
  searchTerm: '',
  sortBy: 'createdAt:desc', // Default sort: newest created first

  // --- Actions ---
  setSearchTerm: (term) => set({ searchTerm: term, error: null }),
  setSortBy: (criteria) => set({ sortBy: criteria, error: null }),

  fetchNotes: async () => {
    const { token } = useAuthStore.getState();
    if (!token) {
      console.warn('fetchNotes: No token found, user not authenticated.');
      return set({ error: 'Not authenticated to fetch notes', notes: [], isLoading: false });
    }

    set({ isLoading: true, error: null });
    const { searchTerm, sortBy } = get();

    try {
      const fetchedNotes = await apiFetchNotes(token, searchTerm, sortBy);
      set({ notes: fetchedNotes, isLoading: false });
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch notes';
      console.error('fetchNotes error:', errorMessage);
      set({ error: errorMessage, isLoading: false, notes: [] });
    }
  },

  getNoteById: async (noteId) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      console.warn('getNoteById: No token found, user not authenticated.');
      return set({ error: 'Not authenticated to fetch note', currentNote: null, isLoading: false });
    }

    set({ isLoading: true, error: null });
    try {
      const note = await apiGetNoteById(token, noteId);
      set({ currentNote: note, isLoading: false });
      return note;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch note';
      console.error('getNoteById error:', errorMessage);
      set({ error: errorMessage, isLoading: false, currentNote: null });
      throw err; // Re-throw for component to handle if needed
    }
  },
  
  setCurrentNote: (note) => set({ currentNote: note, error: null }),
  clearCurrentNote: () => set({ currentNote: null, error: null }),

  createNote: async (noteData) => { // noteData: { title, content }
    const { token } = useAuthStore.getState();
    if (!token) {
      console.warn('createNote: No token found, user not authenticated.');
      throw new Error('Not authenticated to create note');
    }

    set({ isLoading: true, error: null });
    try {
      const newNote = await apiCreateNote(token, noteData);
      set((state) => ({
        notes: [newNote, ...state.notes],
        isLoading: false,
        currentNote: newNote, // Optionally set as current
      }));
      return newNote;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create note';
      console.error('createNote error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      throw err; // Re-throw for component
    }
  },

  updateNote: async (noteId, noteData) => { // noteData: { title, content }
    const { token } = useAuthStore.getState();
    if (!token) {
      console.warn('updateNote: No token found, user not authenticated.');
      throw new Error('Not authenticated to update note');
    }

    set({ isLoading: true, error: null });
    try {
      const updatedNote = await apiUpdateNote(token, noteId, noteData);
      set((state) => ({
        notes: state.notes.map((note) =>
          note._id === noteId ? updatedNote : note
        ),
        isLoading: false,
        currentNote: state.currentNote?._id === noteId ? updatedNote : state.currentNote,
      }));
      return updatedNote;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update note';
      console.error('updateNote error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      throw err; // Re-throw for component
    }
  },

  deleteNote: async (noteId) => {
    const { token } = useAuthStore.getState();
    if (!token) {
      console.warn('deleteNote: No token found, user not authenticated.');
      throw new Error('Not authenticated to delete note');
    }

    set({ isLoading: true, error: null });
    try {
      await apiDeleteNote(token, noteId); // Backend sends a success message
      set((state) => ({
        notes: state.notes.filter((note) => note._id !== noteId),
        isLoading: false,
        currentNote: state.currentNote?._id === noteId ? null : state.currentNote,
      }));
      // No specific data to return, success is indicated by not throwing an error
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete note';
      console.error('deleteNote error:', errorMessage);
      set({ error: errorMessage, isLoading: false });
      throw err; // Re-throw for component
    }
  },
  
  clearNoteError: () => set({ error: null }),
}));

export default useNoteStore;
