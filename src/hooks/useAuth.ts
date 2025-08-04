import { useAuthStore } from "../storage/cstorage";

export function useAuth() {
  const {
    token,
    isAuthenticated,
    loading,
    error,
    userData,
    login,
    logout,
    fetchUserData,
    setToken,
  } = useAuthStore();

  // Podrías agregar lógica adicional aquí si hace falta

  return {
    token,
    isAuthenticated,
    loading,
    error,
    userData,
    login,
    logout,
    fetchUserData,
    setToken,
  };
}
