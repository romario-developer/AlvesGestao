import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  companyId: string | null;
  userName: string | null;
  setAuth: (data: Partial<AuthState>) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      companyId: null,
      userName: null,
      setAuth: (data) => set((state) => ({ ...state, ...data })),
      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          companyId: null,
          userName: null,
        }),
    }),
    { name: 'alves-auth' },
  ),
);
