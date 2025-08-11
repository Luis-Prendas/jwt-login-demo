import { useNavigate } from "react-router";
import { useAddPoints } from "../hooks/useAddPoints";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const navigate = useNavigate();

  // Zustand selectors
  const { logout, fetchUserData, userData, loading, fetchAllUsers } = useAuth();

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

  const handleAllUsersInfo = async () => {
    const users = await fetchAllUsers();
    console.log(users);
  };

  useEffect(() => {
    if (!userData) {
      fetchUserData();
    }
  }, []);

  return (
    <>Dashboard</>
  );
}
