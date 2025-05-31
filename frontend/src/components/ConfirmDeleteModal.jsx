// frontend/src/components/ConfirmDeleteModal.jsx
import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';

// Props:
// - show: (boolean) Controls the visibility of the modal.
// - onHide: (function) Called when the modal is requested to be hidden (e.g., close button, backdrop click).
// - onConfirm: (function) Called when the user clicks the "Confirm Delete" button.
// - noteTitle: (string) The title of the note to be deleted, for display in the modal.
// - isLoading: (boolean) If true, shows a loading state on the confirm button.
function ConfirmDeleteModal({ show, onHide, onConfirm, noteTitle, isLoading }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {noteTitle ? (
          <p>Are you sure you want to delete the note: <strong>"{noteTitle}"</strong>?</p>
        ) : (
          <p>Are you sure you want to delete this note?</p>
        )}
        <p>This action cannot be undone.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="ms-1">Deleting...</span>
            </>
          ) : (
            'Confirm Delete'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDeleteModal;
