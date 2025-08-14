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
import TabsConfig from '../pages/TabsConfig';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Públicas (Sin autenticación) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<MainLayout />}>
          {/* Privadas (Requiere autenticación) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/room/:roomId" element={<Room />} />

            {/* Administrativas (Requiere autenticación y rol de administrador) */}
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/fut-draft" element={<FutDraft />} />
              <Route path="/dev-tools" element={<DevTools />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/tabs-config" element={<TabsConfig />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
