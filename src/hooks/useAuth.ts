import { userRegister } from "../services/Register";
import { allUsersInfo } from "../services/UserInformatio";
import { useAuthStore } from "../storage/cstorage";
import type { RegisterData, UserData } from "../types/UserManagement";

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

  const fetchAllUsers = async (): Promise<UserData[] | null> => {
    setLoading(true);
    if (!token) return null;

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
