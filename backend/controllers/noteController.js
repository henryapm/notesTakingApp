// backend/controllers/noteController.js
import Note from '../models/Note.js';
import mongoose from 'mongoose'; // Needed for ObjectId validation

// --- Controller Functions ---

/**
 * @desc    Get all notes for the logged-in user, with search and sort
 * @route   GET /api/notes
 * @access  Private
 */
export const getNotes = async (req, res) => {
  try {
    // Basic query object, ensures notes belong to the logged-in user
    const query = { user: req.user._id };

    // Search functionality
    // If 'search' query param exists, add regex for title and content
    if (req.query.search) {
      const searchTerm = req.query.search;
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } }, // 'i' for case-insensitive
        { content: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    // Sorting functionality
    // Default sort: newest created first
    let sortOptions = { createdAt: -1 }; // -1 for descending, 1 for ascending

    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':'); // e.g., 'createdAt:desc' or 'updatedAt:asc'
      const sortField = parts[0];
      const sortOrder = parts[1] === 'asc' ? 1 : -1;

      if (['createdAt', 'updatedAt', 'title'].includes(sortField)) { // Whitelist sortable fields
        sortOptions = { [sortField]: sortOrder };
      }
    }
    
    const notes = await Note.find(query).sort(sortOptions);

    res.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ message: 'Server error while fetching notes' });
  }
};

/**
 * @desc    Get a single note by ID
 * @route   GET /api/notes/:id
 * @access  Private
 */
export const getNoteById = async (req, res) => {
  try {
    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid note ID format' });
    }

    const note = await Note.findById(req.params.id);

    if (note) {
      // Check if the note belongs to the logged-in user
      if (note.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to access this note' });
      }
      res.json(note);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    console.error('Error fetching single note:', error);
    // Handle CastError specifically if ID format is valid but not found or other issues
    if (error.name === 'CastError') {
        return res.status(404).json({ message: 'Note not found with provided ID' });
    }
    res.status(500).json({ message: 'Server error while fetching note' });
  }
};

/**
 * @desc    Create a new note
 * @route   POST /api/notes
 * @access  Private
 */
export const createNote = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Please provide title and content for the note' });
  }

  try {
    const note = new Note({
      title,
      content,
      user: req.user._id, // Associate note with the logged-in user
    });

    const createdNote = await note.save();
    res.status(201).json(createdNote);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ message: 'Server error while creating note' });
  }
};

/**
 * @desc    Update an existing note
 * @route   PUT /api/notes/:id
 * @access  Private
 */
export const updateNote = async (req, res) => {
  const { title, content } = req.body;

  try {
    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid note ID format' });
    }

    const note = await Note.findById(req.params.id);

    if (note) {
      // Check if the note belongs to the logged-in user
      if (note.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this note' });
      }

      // Update fields if provided
      note.title = title || note.title;
      note.content = content || note.content;
      // Mongoose 'timestamps: true' will automatically update 'updatedAt'

      const updatedNote = await note.save();
      res.json(updatedNote);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    console.error('Error updating note:', error);
    if (error.name === 'CastError') {
        return res.status(404).json({ message: 'Note not found with provided ID' });
    }
    res.status(500).json({ message: 'Server error while updating note' });
  }
};

/**
 * @desc    Delete a note
 * @route   DELETE /api/notes/:id
 * @access  Private
 */
export const deleteNote = async (req, res) => {
  try {
    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid note ID format' });
    }

    const note = await Note.findById(req.params.id);

    if (note) {
      // Check if the note belongs to the logged-in user
      if (note.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to delete this note' });
      }

      await note.deleteOne(); // or note.remove() for older Mongoose versions
      res.json({ message: 'Note removed successfully' });
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    if (error.name === 'CastError') {
        return res.status(404).json({ message: 'Note not found with provided ID' });
    }
    res.status(500).json({ message: 'Server error while deleting note' });
  }
};
