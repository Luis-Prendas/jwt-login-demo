import { userRegister, type RegisterData } from "../services/Register";
import { allUsersInfo } from "../services/UserInformatio";
import { useAuthStore } from "../storage/cstorage";

export function useAuth() {
  const {
    token,
    isAuthenticated,
    loading,
    error,
    userData,
    setLoading,
    login,
    logout,
    fetchUserData,
    setToken,
  } = useAuthStore();

  const fetchAllUsers = async () => {
    setLoading(true);
    if (!token) return;

    const users = await allUsersInfo(token);
    setLoading(false);
    return users;
  };

  const createUser = async (userData: RegisterData) => {
    setLoading(true);
    if (!token) return;

    const newUser = await userRegister(userData);
    setLoading(false);
    return newUser;
  };

  // Podrías agregar lógica adicional aquí si hace falta

  return {
    token,
    isAuthenticated,
    loading,
    error,
    userData,
    createUser,
    login,
    logout,
    fetchUserData,
    setToken,
    fetchAllUsers
  };
}
