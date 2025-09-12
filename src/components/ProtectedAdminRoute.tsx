import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { USER_ROLES } from "@/types/UserManagement";

const PROTECTED_ACCESS = [USER_ROLES.DEVELOPER]

export default function ProtectedAdminRoute() {
  const { userData } = useAuth();

  if (!userData || !PROTECTED_ACCESS.includes(userData.role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
