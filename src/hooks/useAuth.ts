import { userRegister } from "../services/Register";
import { allUsersInfo, userInfoWithBadges } from "../services/UserInformatio";
import { useAuthStore } from "../store/cstorage";
import type { RegisterData, UserData, UserDataWithBadges } from "../types/UserManagement";

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

  const fetchUserInfoWithBadge = async (userUuid: string): Promise<UserDataWithBadges | null> => {
    setLoading(true);
    if (!userUuid || !token) return null;

    const user = await userInfoWithBadges(token, userUuid)
    setLoading(false);
    return user
  }

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
    fetchAllUsers,
    fetchUserInfoWithBadge
  };
}
