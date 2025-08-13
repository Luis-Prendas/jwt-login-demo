import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: ProtectedRouteProps) {
  const { isAuthenticated, logout, userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start">
      <nav className="w-screen bg-[#181818] border-b border-white/10 shadow-lg p-4 flex items-center gap-4 justify-between">
        <h1 className="text-2xl font-bold">
          <Link to="/">Luis.Dev</Link>
        </h1>
        {isAuthenticated ? (
          <>
            <ul className="flex justify-center items-center gap-4">
              <li><Link to="/" className="text-blue-300 hover:underline">Inicio</Link></li>
              <li><Link to="/dashboard" className="text-blue-300 hover:underline">Dashboard</Link></li>
              <li><Link to="/create-room" className="text-blue-300 hover:underline">Salas</Link></li>
              <li><Link to="/register" className="text-blue-300 hover:underline">Registro</Link></li>
              {userData?.role === 'admin' && (
                <>
                  <li><Link to="/dev-tools" className="text-blue-300 hover:underline">Herramientas</Link></li>
                  <li><Link to="/user-management" className="text-blue-300 hover:underline">Lista de usuarios</Link></li>
                </>
              )}
            </ul>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
              Cerrar sesión
            </button>
          </>
        ) : (
          <div className='flex gap-4'>
            <Link to="/register" className="secondary_btn">
              Registro
            </Link>
            <Link to="/login" className="main_btn">
              Iniciar sesión
            </Link>
          </div>
        )}
      </nav>
      <section className="w-3/4 p-4">
        {children}
      </section>
    </div>
  );
}

