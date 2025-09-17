import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import { ProtectedRoute } from '../components/ProtectedRoute';
import Register from '../pages/Register';
import { MainLayout } from '../components/MainLayout';
import ProtectedAdminRoute from '../components/ProtectedAdminRoute';
import Profile from '@/pages/profile/Profile';
import DepartmentManagementPega from '@/pages/DeptManagement/Page';
import OrganizationManagementPega from '@/pages/OrgManagement/Page';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Públicas (Sin autenticación) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/:userId" element={<Profile />} />

            {/* Administrativas (Requiere autenticación y rol de administrador) */}
            <Route element={<ProtectedAdminRoute />}>
              <Route path="/organization-management" element={<OrganizationManagementPega />} />
              <Route path="/department-management" element={<DepartmentManagementPega />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
