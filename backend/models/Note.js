// backend/models/Note.js
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    // Link to the User model - this is how we associate a note with a specific user.
    // 'ref: 'User'' tells Mongoose that this field will store an ObjectId referencing a document in the 'User' collection.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This should match the model name we used when defining the User model: mongoose.model('User', userSchema)
    },
    title: {
      type: String,
      required: [true, 'Please add a title for your note'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Please add content for your note'],
    },
    // We don't explicitly need creationDate and lastModifiedDate here
    // because the `timestamps: true` option below will automatically add
    // `createdAt` and `updatedAt` fields.
  },
  {
    // Automatically adds `createdAt` and `updatedAt` fields to the schema.
    // `createdAt` will serve as our creation date.
    // `updatedAt` will serve as our last modified date.
    timestamps: true,
  }
);

// Create and export the Note model
const Note = mongoose.model('Note', noteSchema);

export default Note;
