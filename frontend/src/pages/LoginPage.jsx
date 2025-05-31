// frontend/src/pages/LoginPage.jsx
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
// We no longer need shallow with this new approach

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  
  // --- New State Selection Method ---
  // Select each piece of state individually. This is more resilient to re-render loops.
  const loginUser = useAuthStore((state) => state.loginUser);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearAuthError = useAuthStore((state) => state.clearAuthError);

  // Effect to clear authentication errors when the component mounts
  useEffect(() => {
    // Only clear the error if one exists
    if (error && clearAuthError) {
        clearAuthError();
    }
  }, [clearAuthError]); // Re-run if clearAuthError changes (it shouldn't)

  // Effect to redirect if the user is successfully logged in
  useEffect(() => {
    if (user) {
      navigate('/notes');
    }
  }, [user, navigate]); // Runs when user or navigate changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      // For now, we rely on the backend to return an error for missing fields
      // and the loginUser action will handle setting the error state.
      return; 
    }
    try {
      await loginUser(username, password);
    } catch (err) {
      console.error("Login failed (caught in LoginPage component):", err.message);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col xs={12} md={6} lg={4}>
          <h2 className="mb-4 text-center">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  <span className="ms-2">Logging in...</span>
                </>
              ) : (
                'Login'
              )}
            </Button>
          </Form>
          <div className="mt-3 text-center">
            Don't have an account? <Link to="/register">Register here</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
