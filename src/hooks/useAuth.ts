import { sessionLogin } from "@/services/Login";
import { useAuthStore } from "../store/cstorage";
import type { LoginForm, UserBasicData } from "@/types/UserManagement";
import { useState } from "react";
import { decodeToken } from "@/utils/jwt";
import { gerAllUsersService, getUserService, updateUserService } from "@/services/UserInformatio";

export function useAuth() {
  const {
    token,
    isAuthenticated,
    userData,
    setToken,
    setIsAuthenticated,
    setUserData
  } = useAuthStore();

  const [loading, setLoading] = useState(false);

  const login = async (loginForm: LoginForm) => {
    setLoading(true);
    const response = await sessionLogin(loginForm);
    if (response.token) {
      setToken(response.token);
      setIsAuthenticated(!!response.token);
      cookieStore.set({ name: 'token', value: response.token || '', path: '/' });
      setUserData(decodeToken(response.token!).user);
    }
    setLoading(false);
    return response;
  }

  const logout = () => {
    setLoading(true);
    cookieStore.delete('token');
    setToken(null);
    setIsAuthenticated(false);
    setLoading(false);
  }

  const getUser = async (id: string) => {
    setLoading(true)
    const response = await getUserService(id, token!)
    setLoading(false)
    return response
  }

  const getAllUsers = async () => {
    setLoading(true)
    const response = await gerAllUsersService(token!)
    setLoading(false)
    return response
  }

  const updateUser = async (userData: UserBasicData, id: string) => {
    setLoading(true)
    const response = await updateUserService(userData, token!, id)
    setLoading(false)
    return response
  }

  return {
    token,
    isAuthenticated,
    loading,
    userData,
    login,
    setToken,
    logout,
    getAllUsers,
    getUser,
    updateUser,
  };
}
