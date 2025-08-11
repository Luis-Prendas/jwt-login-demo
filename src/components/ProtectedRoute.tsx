// src/components/ProtectedRoute.tsx
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, logout, userData } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start">
      <nav className="w-screen bg-black p-4 flex items-center gap-4 justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <ul className="flex justify-center items-center gap-4">
          <li><a href="/dashboard" className="text-blue-300 hover:underline">Inicio</a></li>
          <li><a href="/create-room" className="text-blue-300 hover:underline">Salas</a></li>
          <li><a href="/register" className="text-blue-300 hover:underline">Registro</a></li>
          {userData?.role === 'admin' && (
            <li><a href="/dev-tools" className="text-blue-300 hover:underline">Dev Tools</a></li>
          )}
        </ul>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          Cerrar sesión
        </button>
      </nav>
      <section className="w-3/4 p-4">
        {children}
      </section>
    </div>
  );
}

