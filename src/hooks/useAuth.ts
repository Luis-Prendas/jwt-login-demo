import { sessionLogin } from "@/services/Login";
import { useAuthStore } from "../store/cstorage";
import type { LoginForm } from "@/types/UserManagement";
import { useState } from "react";
import { decodeToken } from "@/utils/jwt";
import { gerAllUsers, gerUser } from "@/services/UserInformatio";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const {
    token,
    isAuthenticated,
    userData,
    setToken,
    setIsAuthenticated,
    setUserData
  } = useAuthStore();

  const login = async (loginForm: LoginForm) => {
    setLoading(true);
    const response = await sessionLogin(loginForm);
    setToken(response.token);
    setIsAuthenticated(!!response.token);
    cookieStore.set({ name: 'token', value: response.token || '', path: '/' });
    setUserData(decodeToken(response.token!).user);
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

  const getAllUsers = async () => {
    setLoading(true)
    const response = await gerAllUsers(token!)
    setLoading(false)
    return response
  }

  const getUser = async (id: string) => {
    setLoading(true)
    const response = await gerUser(id, token!)
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
    getUser
  };
}
