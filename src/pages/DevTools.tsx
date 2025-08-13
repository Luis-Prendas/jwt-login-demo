import { useAddPoints } from "../hooks/useAddPoints";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export default function DevTools() {

  const { fetchUserData, userData, fetchAllUsers } = useAuth();

  const { addPointsUser } = useAddPoints();

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
    <div className="flex justify-center items-center gap-4 flex-col">
      <h1 className="text-5xl font-bold">Developer Tools</h1>
      <div className="flex flex-col justify-center items-center gap-4">
        <button onClick={handleUserInfo} className="main_btn">Fetch User Info</button>
        <button onClick={handleAddPoints} className="main_btn">Add Points</button>
        <button onClick={handleAllUsersInfo} className="main_btn">Fetch All Users</button>
      </div>
    </div>
  )
}