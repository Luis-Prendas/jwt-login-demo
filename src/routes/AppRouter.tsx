import { BrowserRouter as Router, Route, Routes } from 'react-router';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import { ProtectedRoute } from '../components/ProtectedRoute';
import FutDraft from '../pages/FutDraft';

export default function AppRouter() {
  return (
    <Router>
      <div className="w-full min-h-screen pb-40 flex items-center justify-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
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
        </Routes>
      </div>
    </Router>
  );
};
