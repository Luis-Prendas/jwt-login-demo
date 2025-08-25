import type { UserBasicData } from '@/types/UserManagement';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      token: null,
      isAuthenticated: false,

      setToken: (token) => {
        set({ token });
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
        isAuthenticated: state.isAuthenticated,
        setToken: state.setToken,
        setIsAuthenticated: state.setIsAuthenticated,
      }),
    }
  )
);
