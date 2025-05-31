import { create } from "zustand";

type UserStore = {
  userId: string;
  setUserId: (val: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  userId: "",
  setUserId: (val) => set({ userId: val }),
}));
