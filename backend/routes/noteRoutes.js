// backend/routes/noteRoutes.js
import express from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js'; // Import the protect middleware

const router = express.Router();

// Apply the 'protect' middleware to all routes in this file.
// This means a user must be authenticated (provide a valid JWT)
// to access any of these note-related endpoints.
router.use(protect);

// @route   GET /api/notes
// @desc    Get all notes for the logged-in user (with search & sort)
// @access  Private
router.get('/', getNotes);

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', createNote);

// @route   GET /api/notes/:id
// @desc    Get a single note by ID
// @access  Private
router.get('/:id', getNoteById);

// @route   PUT /api/notes/:id
// @desc    Update an existing note
// @access  Private
router.put('/:id', updateNote);

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', deleteNote);

export default router;
