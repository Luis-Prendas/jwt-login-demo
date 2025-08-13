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
    <div className="w-full min-h-screen flex">
      <aside className="bg-[#181818] w-[300px] border-b border-white/10 shadow-lg flex flex-col justify-between">
        <div className='w-full px-4 py-2'>
          <h1 className="text-2xl font-bold">
            <Link to="/">Luis.Dev</Link>
          </h1>
        </div>
        {isAuthenticated ? (
          <>
            <div className='w-full h-full p-2'>
              <ul className="flex w-full flex-col justify-center items-start">
                {tabs && tabs.map(tab => (
                  <li key={tab.uuid} className='w-full'>
                    <Link to={tab.route} className={`flex gap-2 items-center hover:bg-[#2f2f2f] w-full p-2 justify-start rounded-lg ${tab.uuid === selectedTab?.uuid && 'bg-[#232323]'}`}>
                      {tab.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className='w-full p-2'>
              <button onClick={handleLogout} className="secondary_btn">
                Cerrar sesión
              </button>
            </div>
          </>
        ) : (
          <div className="flex gap-4">
            <Link to="/register" className="secondary_btn">Registro</Link>
            <Link to="/login" className="main_btn">Iniciar sesión</Link>
          </div>
        )}
      </aside>
      <section className="w-3/4 p-4 mx-auto">
        <Outlet />
      </section>
    </div>
  );
}
