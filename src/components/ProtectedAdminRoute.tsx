import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { userData } = useAuth();

  if (!userData || !userData.role || userData.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
