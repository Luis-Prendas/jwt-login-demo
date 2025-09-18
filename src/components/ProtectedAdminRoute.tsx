import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { UserRole } from "@/types/enums";

const PROTECTED_ACCESS = [UserRole.DEVELOPER.toString(), UserRole.SUPERADMIN.toString(), UserRole.MODERATOR.toString()]

export default function ProtectedAdminRoute() {
  const { userData } = useAuth();

  if (!userData || !PROTECTED_ACCESS.includes(userData.role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
