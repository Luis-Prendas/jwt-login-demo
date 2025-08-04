import { useState, useEffect, useCallback } from 'react';
import { userLogin } from '../services/Login';
import { isTokenValid } from '../utils/jwt';
import { userInfo } from '../services/UserInformatio';

interface UserData {
  username: string;
  password: string;
  balance: {
    rafflePoints: number;
  };
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!isTokenValid(token));
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsAuthenticated(!!isTokenValid(token));
  }, [token]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const receivedToken = await userLogin({ username, password });

      if (!receivedToken) {
        throw new Error('Credenciales inválidas');
      }

      sessionStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      return true;
    } catch (err) {
      setError((err as Error).message || 'Error al iniciar sesión');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    sessionStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
    setUserData(null);
  };

  const fetchUserData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const user = await userInfo(token);
      setUserData(user);
    } catch (err) {
      setError('Error al obtener datos del usuario');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      void fetchUserData();
    }
  }, [isAuthenticated, fetchUserData]);

  return {
    token,
    isAuthenticated,
    loading,
    error,
    userData,
    login,
    logout,
    fetchUserData
  };
}
