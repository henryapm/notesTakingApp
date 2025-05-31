// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

// Import page components
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import NotesDashboardPage from './pages/NotesDashboardPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

// Import components (we'll create placeholder Navbar next)
import AppNavbar from './components/AppNavbar.jsx';
import ProtectedRoute from './components/protectedRoute.jsx';

function App() {
  return (
    <Router>
      <AppNavbar />
      <Container className="mt-3">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            {/* Any Route nested inside here will now be protected */}
            <Route path="/notes" element={<NotesDashboardPage />} />
            
            {/* Example: If you had a profile page to protect */}
            {/* <Route path="/profile" element={<ProfilePage />} /> */}

            {/* Example: If you had another protected section */}
            {/* <Route path="/settings" element={<SettingsPage />} /> */}
          </Route>

          {/* Catch-all for unmatched routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
