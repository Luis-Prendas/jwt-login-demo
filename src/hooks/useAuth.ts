import { userRegister } from "../services/Register";
import { allUsersInfo } from "../services/UserInformatio";
import { useAuthStore } from "../store/cstorage";
import type { RegisterData, UserData } from "../types/UserManagement";

export function useAuth() {
  const {
    token,
    isAuthenticated,
    loading,
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
    const newUser = await userRegister(userData);
    setToken(newUser.token)
    setLoading(false);
    return newUser;
  };

  return {
    token,
    isAuthenticated,
    loading,
    userData,
    createUser,
    login,
    logout,
    fetchUserData,
    setToken,
    fetchAllUsers
  };
}
