import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

export function ProtectedRoute() {
  const { setToken, } = useAuth();
  const cookie = document.cookie.split('; ').find(row => row.startsWith('token='));

  if (!cookie) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    if (cookie) {
      const token = cookie.split('=')[1];
      setToken(token);
    }
  }, [])

  return <Outlet />;
}
