import type { UserBasicData } from '@/types/UserManagement';
import { decodeToken } from '@/utils/jwt';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userData: UserBasicData | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setUserData: (userData: UserBasicData | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      userData: null,
      isAuthenticated: false,

      setToken: (token) => {
        if (token) {
          cookieStore.set({ name: 'token', value: token || '', path: '/' });
          set({ token });
          const user = decodeToken(token);
          get().setUserData(user.user);
          get().setIsAuthenticated(true);
        }
      },
      setUserData: (userData) => {
        set({ userData });
      },
      setIsAuthenticated: (isAuthenticated) => {
        set({ isAuthenticated });
      },
    }),
    {
      name: 'auth-storage',
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
        setToken: state.setToken,
        setUserData: state.setUserData,
        setIsAuthenticated: state.setIsAuthenticated,
      }),
    }
  )
);
