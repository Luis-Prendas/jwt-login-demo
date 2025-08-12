import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userLogin } from '../services/Login';
import { isTokenValid, decodeToken } from '../utils/jwt';
import { userInfo } from '../services/UserInformatio';
import type { UserBasicData } from '../types/UserManagement';

interface AuthState {
  token: string | null;
  userData: UserBasicData | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  setLoading: (loading: boolean) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchUserData: () => Promise<void>;
  setToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      userData: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      setLoading: (loading) => {
        set({ loading });
      },

      setToken: (token) => {
        if (token && isTokenValid(token)) {
          const decoded = decodeToken(token);
          set({
            token,
            isAuthenticated: true,
            userData: {
              uuid: decoded.user.uuid,
              mail: decoded.user.mail,
              username: decoded.user.username,
              nickname: decoded.user.nickname,
              role: decoded.user.role,
            },
          });
        } else {
          set({
            token: null,
            isAuthenticated: false,
            userData: null,
          });
        }
      },

      login: async (username, password) => {
        set({ loading: true, error: null });
        try {
          const receivedToken = await userLogin({ username, password });
          if (!receivedToken) {
            set({ error: 'Login failed', loading: false });
            return false;
          }
          get().setToken(receivedToken);
          set({ loading: false });
          return true;
        } catch (error) {
          set({ error: 'Login error', loading: false });
          return false;
        }
      },

      logout: () => {
        set({
          token: null,
          isAuthenticated: false,
          userData: null,
          error: null,
        });
      },

      fetchUserData: async () => {
        const token = get().token;
        if (!token) return;
        set({ loading: true, error: null });
        try {
          const user = await userInfo(token);
          set({ userData: user, loading: false });
        } catch (error) {
          set({ error: 'Error fetching user data', loading: false });
        }
      }
    }),
    {
      name: 'auth-storage', // clave en sessionStorage
      storage: {
        getItem: (key) => {
          const value = sessionStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (key, value) => sessionStorage.setItem(key, JSON.stringify(value)),
        removeItem: (key) => sessionStorage.removeItem(key),
      },
      partialize: (state) => ({
        token: state.token,
        userData: state.userData,
        isAuthenticated: state.isAuthenticated,
        loading: false,
        error: null,
        setLoading: state.setLoading,
        login: state.login,
        logout: state.logout,
        fetchUserData: state.fetchUserData,
        setToken: state.setToken,
      }),
    }
  )
);
