import { useNavigate } from "react-router";
import { useAddPoints } from "../hooks/useAddPoints";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute";

export default function DevTools() {
  const navigate = useNavigate();

  const { logout, fetchUserData, userData, fetchAllUsers } = useAuth();

  const { addPointsUser } = useAddPoints();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUserInfo = async () => {
    const res = await fetchUserData();
    console.log(res);
  };

  const handleAddPoints = async () => {
    const res = await addPointsUser(100);
    console.log(res);
  };

  const handleAllUsersInfo = async () => {
    const res = await fetchAllUsers();
    console.log(res);
  };

  useEffect(() => {
    if (!userData) {
      fetchUserData();
    }
  }, []);

  return (
    <ProtectedAdminRoute>
      <div className="flex flex-col justify-center items-center gap-4">
        <button onClick={handleLogout} className="main_btn">Logout</button>
        <button onClick={handleUserInfo} className="main_btn">Fetch User Info</button>
        <button onClick={handleAddPoints} className="main_btn">Add Points</button>
        <button onClick={handleAllUsersInfo} className="main_btn">Fetch All Users</button>
      </div>
    </ProtectedAdminRoute>
  )
}