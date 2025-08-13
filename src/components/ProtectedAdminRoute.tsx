import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedAdminRoute() {
  const { userData } = useAuth();

  if (!userData || !userData.role || userData.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
