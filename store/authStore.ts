import { create } from "zustand";

type AuthStore = {
  isLogin: boolean;
  setLogin: (val: boolean) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isLogin: false,
  setLogin: (val) => set({ isLogin: val }),
}));
