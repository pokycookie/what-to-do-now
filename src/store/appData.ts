import { create } from "zustand";

interface IAppDataState {
  currentTime: Date;
  updateCurrentTime: () => void;
}

export const useAppDataStore = create<IAppDataState>((set) => ({
  currentTime: new Date(),
  updateCurrentTime: () => set(() => ({ currentTime: new Date() })),
}));
