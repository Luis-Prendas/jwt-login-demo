import { Link, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useTabsMenu } from '../hooks/useTabsMenu';

export function MainLayout() {
  const { isAuthenticated, logout, token } = useAuth();
  const { tabs, selectedTab, fetchTabs, setSelectedTab } = useTabsMenu()
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && token) {
        await fetchTabs(token);
      }
    };
    fetchData();
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (!tabs || tabs.length === 0) return;

    const currentTab = tabs.find(tab => tab.route === location.pathname);

    if (currentTab) {
      setSelectedTab(currentTab.uuid);
    }
  }, [location.pathname]);

  return (
    <div className="w-full min-h-screen flex flex-col">
      <nav className="w-full bg-[#181818] border-b border-white/10 shadow-lg p-4 flex justify-between">
        <h1 className="text-2xl font-bold">
          <Link to="/">Luis.Dev</Link>
        </h1>
        {isAuthenticated ? (
          <>
            <ul className="flex gap-4">
              {tabs && tabs.map(tab => (
                <li key={tab.uuid}>
                  <Link to={tab.route} className={tab.uuid === selectedTab?.uuid ? 'font-bold' : ''}>
                    {tab.label}
                  </Link>
                </li>
              ))}
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
