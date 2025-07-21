import { useState, useEffect } from 'react';
import { userLogin } from '../services/Login';
import { isTokenValid } from '../utils/jwt';

interface UserData {
  username: string;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isTokenValid(token) ? true : false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Revalidar si el token cambia
  useEffect(() => {
    const decodedToken = isTokenValid(token);
    setIsAuthenticated(decodedToken ? true : false);
    setUserData(decodedToken ? { username: decodedToken.username } : null);
  }, [token]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const receivedToken = await userLogin({ username, password });

    if (!receivedToken) {
      setError('Login failed');
      setLoading(false);
      return false;
    }

    sessionStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    setLoading(false);
    return true;
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
  };

  return {
    token,
    isAuthenticated,
    loading,
    error,
    userData,
    login,
    logout
  };
}
