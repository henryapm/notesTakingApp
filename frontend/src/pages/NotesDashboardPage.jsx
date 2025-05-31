// frontend/src/pages/NotesDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';
import useNoteStore from '../store/noteStore.js';
import useAuthStore from '../store/authStore.js';

import NoteForm from '../components/NoteForm.jsx';
// Import the ConfirmDeleteModal component
import ConfirmDeleteModal from '../components/ConfirmDeleteModal.jsx';

function NotesDashboardPage() {
  const notes = useNoteStore((state) => state.notes);
  const currentNote = useNoteStore((state) => state.currentNote);
  // Use a more specific isLoading for delete if available, or general one
  const isLoading = useNoteStore((state) => state.isLoading); 
  const error = useNoteStore((state) => state.error);
  const searchTerm = useNoteStore((state) => state.searchTerm);
  const sortBy = useNoteStore((state) => state.sortBy);

  const fetchNotes = useNoteStore((state) => state.fetchNotes);
  const setCurrentNote = useNoteStore((state) => state.setCurrentNote);
  const clearCurrentNote = useNoteStore((state) => state.clearCurrentNote);
  const setSearchTerm = useNoteStore((state) => state.setSearchTerm);
  const setSortBy = useNoteStore((state) => state.setSortBy);
  const deleteNote = useNoteStore((state) => state.deleteNote); // Get deleteNote action
  const clearNoteError = useNoteStore((state) => state.clearNoteError);


  const token = useAuthStore((state) => state.token);

  const [showNoteForm, setShowNoteForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // State for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null); // Store the note object to be deleted

  useEffect(() => {
    if (token) {
      fetchNotes();
    }
    return () => {
      clearNoteError();
      clearCurrentNote();
    };
  }, [token, fetchNotes, searchTerm, sortBy, clearNoteError, clearCurrentNote]);

  const handleSelectNote = (note) => {
    setCurrentNote(note);
    setShowNoteForm(false);
    setIsEditing(false);
  };

  const handleAddNewNote = () => {
    clearCurrentNote();
    setIsEditing(false);
    setShowNoteForm(true);
  };
  
  const handleEditNote = () => {
    if (currentNote) {
      setIsEditing(true);
      setShowNoteForm(true);
    }
  };

  const handleFormSubmit = () => {
    setShowNoteForm(false);
    setIsEditing(false);
  };

  const handleFormCancel = () => {
    setShowNoteForm(false);
    setIsEditing(false);
    clearNoteError();
  };

  // Handler to open the delete confirmation modal
  const handleDeleteNoteClick = (note) => {
    if (note) {
      setNoteToDelete(note); // Set the note to be deleted
      setShowDeleteModal(true); // Show the modal
    }
  };

  // Handler for when deletion is confirmed in the modal
  const handleConfirmDelete = async () => {
    if (noteToDelete) {
      try {
        await deleteNote(noteToDelete._id);
        // If the deleted note was the currentNote, clear it
        if (currentNote && currentNote._id === noteToDelete._id) {
          clearCurrentNote();
        }
        // The noteStore's deleteNote action already updates the notes list.
        // No need to manually call fetchNotes() unless there's a specific reason.
      } catch (err) {
        // Error is already set in the store by the deleteNote action
        console.error("Delete note error (dashboard):", err.message);
      } finally {
        setShowDeleteModal(false); // Hide modal regardless of success/failure
        setNoteToDelete(null);     // Clear the note to delete
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col md={4} className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>My Notes</h3>
            <Button variant="primary" size="sm" onClick={handleAddNewNote}>
              + New Note
            </Button>
          </div>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Select 
              aria-label="Sort notes by" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt:desc">Sort by: Newest Created</option>
              <option value="createdAt:asc">Sort by: Oldest Created</option>
              <option value="updatedAt:desc">Sort by: Newest Updated</option>
              <option value="updatedAt:asc">Sort by: Oldest Updated</option>
              <option value="title:asc">Sort by: Title (A-Z)</option>
              <option value="title:desc">Sort by: Title (Z-A)</option>
            </Form.Select>
          </Form.Group>

          {isLoading && notes.length === 0 && (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading notes...</span>
              </Spinner>
            </div>
          )}
          {error && !showNoteForm && !showDeleteModal && <Alert variant="danger">{error}</Alert>}
          
          {!isLoading && notes.length === 0 && !error && (
            <p>No notes found. Click "+ New Note" to create one!</p>
          )}

          <ListGroup>
            {notes.map((note) => (
              <ListGroup.Item
                key={note._id}
                action
                active={currentNote?._id === note._id && !showNoteForm}
                onClick={() => handleSelectNote(note)}
                className="d-flex justify-content-between align-items-start"
              >
                <div className="ms-2 me-auto">
                  <div className="fw-bold">{note.title}</div>
                  <small className="text-muted">
                    Last updated: {formatDate(note.updatedAt)}
                  </small>
                </div>
                 {/* Optional: Add a small delete button directly in the list item */}
                 {/* <Button variant="outline-danger" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteNoteClick(note); }}>X</Button> */}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col md={8}>
          {showNoteForm ? (
            <NoteForm 
              noteToEdit={isEditing ? currentNote : null} 
              onFormSubmit={handleFormSubmit}
              onFormCancel={handleFormCancel}
            />
          ) : currentNote ? (
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span>{currentNote.title}</span>
                <div>
                  <Button variant="outline-secondary" size="sm" className="me-2" onClick={handleEditNote}>
                    Edit
                  </Button>
                  {/* Updated Delete Button */}
                  <Button variant="outline-danger" size="sm" onClick={() => handleDeleteNoteClick(currentNote)}>
                    Delete
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Card.Text style={{ whiteSpace: 'pre-wrap' }}>{currentNote.content}</Card.Text>
              </Card.Body>
              <Card.Footer className="text-muted">
                Created: {formatDate(currentNote.createdAt)} | Last Updated: {formatDate(currentNote.updatedAt)}
              </Card.Footer>
            </Card>
          ) : (
            <div className="text-center p-5 border rounded bg-light">
              <h4>Select a note to view its details, or create a new one.</h4>
            </div>
          )}
        </Col>
      </Row>

      {/* Render the ConfirmDeleteModal */}
      {noteToDelete && (
        <ConfirmDeleteModal
          show={showDeleteModal}
          onHide={() => {
            setShowDeleteModal(false);
            setNoteToDelete(null); // Clear note to delete when modal is hidden
          }}
          onConfirm={handleConfirmDelete}
          noteTitle={noteToDelete?.title}
          isLoading={isLoading} // You might want a specific isLoadingDelete state if delete is slow
        />
      )}
    </Container>
  );
}

export default NotesDashboardPage;
