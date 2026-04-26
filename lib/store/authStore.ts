'use client';

import { create } from 'zustand';
import { User } from '@/types/user';

export interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user: User | null) => {
    set({
      user,
      isAuthenticated: !!user,
    });
  },
  clearAuth: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },
}));
