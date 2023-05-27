import { create } from "zustand";

interface IAppDataState {
  currentTime: Date;
  updateCurrentTime: () => void;

  page: string;
  setPage: (page: string) => void;
}

export const useAppDataStore = create<IAppDataState>((set) => ({
  currentTime: new Date(),
  updateCurrentTime: () => set(() => ({ currentTime: new Date() })),

  page: "main",
  setPage: (page) => set(() => ({ page })),
}));
