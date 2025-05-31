// frontend/src/components/NoteForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import useNoteStore from '../store/noteStore.js';

// Props:
// - noteToEdit: (object) If provided, the form will be in "edit mode" for this note.
// - onFormSubmit: (function) Callback function executed after successful form submission (create/update).
// - onFormCancel: (function) Callback function executed when the cancel button is clicked.
function NoteForm({ noteToEdit, onFormSubmit, onFormCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [localError, setLocalError] = useState(''); // For client-side validation errors

  // Select actions and state from the note store
  const createNote = useNoteStore((state) => state.createNote);
  const updateNote = useNoteStore((state) => state.updateNote);
  const isLoading = useNoteStore((state) => state.isLoading);
  const serverError = useNoteStore((state) => state.error); // Errors from the store (backend)
  const clearNoteError = useNoteStore((state) => state.clearNoteError);

  const isEditing = Boolean(noteToEdit);

  useEffect(() => {
    // Populate form if noteToEdit is provided (edit mode)
    if (isEditing && noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
    } else {
      // Reset form for new note mode
      setTitle('');
      setContent('');
    }
    // Clear any previous errors when the form mode changes or noteToEdit changes
    setLocalError('');
    if (clearNoteError) clearNoteError();

  }, [noteToEdit, isEditing, clearNoteError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (clearNoteError) clearNoteError();

    if (!title.trim() || !content.trim()) {
      setLocalError('Title and content cannot be empty.');
      return;
    }

    try {
      if (isEditing && noteToEdit) {
        await updateNote(noteToEdit._id, { title, content });
      } else {
        await createNote({ title, content });
      }
      if (onFormSubmit) {
        onFormSubmit(); // Call the callback to handle UI changes (e.g., close form)
      }
      // Optionally reset form fields after successful submission for "new note" mode
      if (!isEditing) {
        setTitle('');
        setContent('');
      }
    } catch (err) {
      // Error is already set in the store by the actions,
      // but we can log it or handle component-specific feedback if needed.
      console.error(isEditing ? 'Update note error:' : 'Create note error:', err.message);
      // The serverError from the store will be displayed.
    }
  };

  return (
    <Card>
      <Card.Header as="h5">{isEditing ? 'Edit Note' : 'Create New Note'}</Card.Header>
      <Card.Body>
        {localError && <Alert variant="warning">{localError}</Alert>}
        {serverError && <Alert variant="danger">{serverError}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="noteFormTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="noteFormContent">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Enter note content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
              required
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            {onFormCancel && (
                 <Button variant="outline-secondary" onClick={onFormCancel} disabled={isLoading} className="me-2">
                    Cancel
                </Button>
            )}
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-1">{isEditing ? 'Saving...' : 'Creating...'}</span>
                </>
              ) : (
                isEditing ? 'Save Changes' : 'Create Note'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default NoteForm;
