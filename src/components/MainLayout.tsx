import { Link, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export function MainLayout() {
  const { isAuthenticated, logout, userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <nav className="w-full bg-[#181818] border-b border-white/10 shadow-lg p-4 flex justify-between">
        <h1 className="text-2xl font-bold">
          <Link to="/">Luis.Dev</Link>
        </h1>
        {isAuthenticated ? (
          <>
            <ul className="flex gap-4">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/create-room">Salas</Link></li>
              {userData?.role === 'admin' && (
                <>
                  <li><Link to="/dev-tools">Herramientas</Link></li>
                  <li><Link to="/user-management">Usuarios</Link></li>
                </>
              )}
            </ul>
            <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
              Cerrar sesión
            </button>
          </>
        ) : (
          <div className="flex gap-4">
            <Link to="/register" className="secondary_btn">Registro</Link>
            <Link to="/login" className="main_btn">Iniciar sesión</Link>
          </div>
        )}
      </nav>
      <section className="w-3/4 p-4 mx-auto">
        <Outlet />
      </section>
    </div>
  );
}
