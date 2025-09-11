import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { PROTECTED_ACCESS } from "@/utils/constants";

export default function ProtectedAdminRoute() {
  const { userData } = useAuth();

  if (!userData || !PROTECTED_ACCESS.includes(userData.role)) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
