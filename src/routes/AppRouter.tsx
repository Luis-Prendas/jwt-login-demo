import { BrowserRouter as Router, Route, Routes } from 'react-router';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import { ProtectedRoute } from '../components/ProtectedRoute';
import FutDraft from '../pages/FutDraft';
import Register from '../pages/Register';
import Room from '../pages/Room';
import DevTools from '../pages/DevTools';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/room"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room/:roomId"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fut-draft"
          element={
            <ProtectedRoute>
              <FutDraft />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dev-tools"
          element={
            <ProtectedRoute>
              <DevTools />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};
