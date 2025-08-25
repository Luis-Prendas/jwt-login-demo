import { sessionLogin } from "@/services/Login";
import { useAuthStore } from "../store/cstorage";
import type { LoginForm } from "@/types/UserManagement";
import { useState } from "react";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const {
    token,
    isAuthenticated,
    setToken,
    setIsAuthenticated,
  } = useAuthStore();

  const login = async (loginForm: LoginForm) => {
    setLoading(true);
    const response = await sessionLogin(loginForm);
    setToken(response.token);
    setIsAuthenticated(!!response.token);
    setLoading(false);
    return response;
  }

  return {
    token,
    isAuthenticated,
    loading,
    login,
    setToken,
  };
}
