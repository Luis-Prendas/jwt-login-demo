import { sessionLogin, type LoginForm } from "@/services/Login";
import { useAuthStore } from "../store/cstorage";
import { useState } from "react";
import { decodeToken } from "@/utils/jwt";
import { gerAllUsersService, getUserService, updateUserService, type UpdateUserDto } from "@/services/UserInformatio";

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
    if (response) {
      setToken(response);
      setIsAuthenticated(!!response);
      cookieStore.set({ name: 'token', value: response || '', path: '/' });
      setUserData(decodeToken(response!).user);
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

  const updateUser = async (userData: UpdateUserDto, id: string) => {
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
