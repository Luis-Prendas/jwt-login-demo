import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import { ProtectedRoute } from '../components/ProtectedRoute';
import Register from '../pages/Register';
import UserManagement from '../pages/UserManagement';
import { MainLayout } from '../components/MainLayout';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';
import Profile from '@/pages/profile/Profile';
import { Assistance } from '@/pages/Assistance/Assistance';

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
            <Route path="/profile/:userId" element={<Profile />} />

            {/* Administrativas (Requiere autenticación y rol de administrador) */}
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/assistance" element={<Assistance />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
