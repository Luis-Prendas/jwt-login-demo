import { useNavigate } from "react-router";
import { useAddPoints } from "../hooks/useAddPoints";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const navigate = useNavigate();

  // Zustand selectors
  const { logout, fetchUserData, userData, loading } = useAuth();

  // Custom hook para agregar puntos
  const {
    addPointsUser,
    loading: addingPointsLoading,
    error: addingPointsError
  } = useAddPoints();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUserInfo = () => {
    fetchUserData();
  };

  const handleAddPoints = () => {
    addPointsUser(100);
  };

  useEffect(() => {
    if (!userData) {
      fetchUserData();
    }
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <section>
        <h1 className="text-5xl font-bold">
          Dashboard Page : {userData ? <span>{userData.username}</span> : <span>username</span>}
        </h1>
      </section>

      <section className="text-lg font-bold">
        <ul className="flex flex-col items-center">
          <li><a href="/" className="text-blue-300 hover:underline">Go to Home</a></li>
          <li><a href="/login" className="text-blue-300 hover:underline">Go to Login</a></li>
          <li><a href="/fut-draft" className="text-blue-300 hover:underline">Go to FUT Draft</a></li>
        </ul>
      </section>

      <section>
        <button onClick={handleLogout} className="bg-[#f0f0f0] text-[#333] rounded-lg px-4 py-2 w-full cursor-pointer mt-2">Logout</button>
        <button onClick={handleAddPoints} className="bg-[#f0f0f0] text-[#333] rounded-lg px-4 py-2 w-full cursor-pointer mt-2">
          {addingPointsLoading ? 'Adding Points...' : 'Add 100 Points'}
          {addingPointsError && <span className="text-red-500"> - {addingPointsError}</span>}
        </button>
        <button onClick={handleUserInfo} className="bg-[#f0f0f0] text-[#333] rounded-lg px-4 py-2 w-full cursor-pointer mt-2">User Info</button>
      </section>

      <section>
        {loading ? (
          <p className="text-gray-500 h-[132px]">Loading user data...</p>
        ) : (
          userData && (
            <div className="bg-gray-800 text-white p-4 rounded-lg h-[132px]">
              <h2 className="text-xl font-bold">User Data</h2>
              <p><strong>Username:</strong> {userData.username}</p>
              <p><strong>Balance:</strong> {userData.balance.rafflePoints} Points</p>
            </div>
          )
        )}
      </section>
    </div>
  );
}
