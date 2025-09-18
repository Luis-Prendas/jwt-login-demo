// hooks/useAuth.ts
import { sessionLogin, type LoginForm } from "@/services/Login.service";
import { useAuthStore } from "../store/cstorage";
import { useState } from "react";
import { decodeToken } from "@/utils/jwt";

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
    try {
      const response = await sessionLogin(loginForm);
      if (response) {
        setToken(response);
        setIsAuthenticated(!!response);
        // ✨ MEJORADO: Usar localStorage en lugar de cookieStore para consistencia
        localStorage.setItem('token', response);
        setUserData(decodeToken(response).user);
        console.log('✅ Login exitoso');
      }
      return response;
    } catch (error) {
      console.error('❌ Error en login:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  const logout = () => {
    setLoading(true);
    try {
      // ✨ MEJORADO: Limpiar localStorage y store
      localStorage.removeItem('token');
      setToken(null);
      setIsAuthenticated(false);
      setUserData(null);
      console.log('✅ Logout exitoso');
    } catch (error) {
      console.error('❌ Error en logout:', error);
    } finally {
      setLoading(false);
    }
  }

  // ✨ NUEVO: Función para refrescar datos del usuario actual
  const refreshUserData = () => {
    if (token) {
      try {
        const decoded = decodeToken(token);
        setUserData(decoded.user);
      } catch (error) {
        console.error('❌ Error refrescando datos del usuario:', error);
        logout(); // Si el token es inválido, hacer logout
      }
    }
  }

  return {
    // Estados
    token,
    isAuthenticated,
    loading,
    userData,
    
    // Métodos de autenticación
    login,
    logout,
    refreshUserData,
    
    // ⚠️ DEPRECATED: Mantener setToken por compatibilidad, pero desalentar su uso
    setToken,
  };
}