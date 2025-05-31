// frontend/src/pages/RegisterPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import useAuthStore from '../store/authStore.js';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Local state for client-side validation errors
  const [formError, setFormError] = useState('');
  
  const navigate = useNavigate();
  
  // Select state and actions individually from the store
  const registerUser = useAuthStore((state) => state.registerUser);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  // We'll use the store's error for backend errors, and local formError for client-side issues
  const serverError = useAuthStore((state) => state.error);
  const clearAuthError = useAuthStore((state) => state.clearAuthError);

  // Effect to clear authentication errors from the store when the component mounts
  useEffect(() => {
    if (clearAuthError) {
      clearAuthError();
    }
  }, [clearAuthError]);

  // Effect to redirect if the user is successfully registered and logged in
  useEffect(() => {
    if (user) {
      navigate('/notes');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(''); // Clear previous client-side errors
    if (clearAuthError) clearAuthError(); // Clear previous server-side errors

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await registerUser(username, password);
      // Navigation is handled by the useEffect hook above if registration is successful.
    } catch (err) {
      // The registerUser action in the store already sets the serverError state.
      // This catch block is for any additional component-specific error handling if needed.
      console.error("Registration failed (caught in RegisterPage component):", err.message);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6} lg={4}>
          <h2 className="mb-4 text-center">Register</h2>
          {/* Display either client-side form error or server-side error */}
          {formError && <Alert variant="danger">{formError}</Alert>}
          {serverError && <Alert variant="danger">{serverError}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="ms-2">Registering...</span>
                </>
              ) : (
                'Register'
              )}
            </Button>
          </Form>
          <div className="mt-3 text-center">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
