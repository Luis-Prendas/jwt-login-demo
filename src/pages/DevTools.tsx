import { useNavigate } from "react-router";
import { useAddPoints } from "../hooks/useAddPoints";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

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
    <div className="flex flex-col justify-center items-center gap-4">
      <button onClick={handleLogout} className="px-4 py-2 bg-sky-700 rounded-lg min-w-[100px] hover:bg-sky-600 transition-all ease-in-out cursor-pointer">Logout</button>
      <button onClick={handleUserInfo} className="px-4 py-2 bg-sky-700 rounded-lg min-w-[100px] hover:bg-sky-600 transition-all ease-in-out cursor-pointer">Fetch User Info</button>
      <button onClick={handleAddPoints} className="px-4 py-2 bg-sky-700 rounded-lg min-w-[100px] hover:bg-sky-600 transition-all ease-in-out cursor-pointer">Add Points</button>
      <button onClick={handleAllUsersInfo} className="px-4 py-2 bg-sky-700 rounded-lg min-w-[100px] hover:bg-sky-600 transition-all ease-in-out cursor-pointer">Fetch All Users</button>
    </div>
  )
}