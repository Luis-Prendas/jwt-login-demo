import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import { ProtectedRoute } from '../components/ProtectedRoute';
import FutDraft from '../pages/FutDraft';
import Register from '../pages/Register';
import DevTools from '../pages/DevTools';
import CreateRoom from '../pages/CreateRoom';
import Room from '../pages/Room';
import UserManagement from '../pages/UserManagement';
import { MainLayout } from '../components/MainLayout';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Públicas (Sin autenticación) */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Privadas (Requiere autenticación) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Administrativas (Requiere autenticación y rol de administrador) */}
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/fut-draft" element={<FutDraft />} />
              <Route path="/dev-tools" element={<DevTools />} />
              <Route path="/user-management" element={<UserManagement />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
