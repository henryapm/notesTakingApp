// frontend/src/components/AppNavbar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'; // Optional: for a logout button
import useAuthStore from '../store/authStore.js';

function AppNavbar() {
  const navigate = useNavigate();

  // Select the user and logoutUser action from the auth store
  const user = useAuthStore((state) => state.user);
  const logoutUser = useAuthStore((state) => state.logoutUser);

  const logoutHandler = () => {
    logoutUser();
    // Redirect to the login page after logging out
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>MERN Notes</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto"> {/* ms-auto pushes nav items to the right */}
            {user ? (
              // --- Links to show when user IS logged in ---
              <>
                <Navbar.Text className="me-3">
                  Signed in as: <span className="fw-bold">{user.username}</span>
                </Navbar.Text>
                <LinkContainer to="/notes">
                  <Nav.Link>My Notes</Nav.Link>
                </LinkContainer>
                <Button variant="outline-light" size="sm" onClick={logoutHandler}>
                  Logout
                </Button>
              </>
            ) : (
              // --- Links to show when user is NOT logged in ---
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
