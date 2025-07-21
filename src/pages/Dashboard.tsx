import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { logout, userData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <section>
        <h1 className="text-5xl font-bold">Dashboard Page : {userData ? <span>{userData.username}</span> : <span>Guest</span>}</h1>
      </section>

      <section className="text-lg font-bold">
        <ul className="flex flex-col items-center">
          <li>
            <a href="/" className="text-blue-300 hover:underline">Go to Home</a>
          </li>
          <li>
            <a href="/login" className="text-blue-300 hover:underline">Go to Login</a>
          </li>
        </ul>
      </section>

      <section>
        <button onClick={handleLogout} className="bg-[#f0f0f0] text-[#333] rounded-lg px-4 py-2 w-full cursor-pointer mt-2">Logout</button>
      </section>
    </div>
  );
}