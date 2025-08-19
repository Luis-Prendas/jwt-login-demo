import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

const PROTECTED_ACSSES = ['developer', 'admin']

export default function ProtectedAdminRoute() {
  const { userData } = useAuth();

  if (!userData || !PROTECTED_ACSSES.includes(userData.role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
