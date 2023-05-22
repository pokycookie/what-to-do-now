import { create } from "zustand";

interface IViewerState {
  isDaily: boolean;
  toggle: () => void;
  setViewer: (isDaily: boolean) => void;
}

export const useViewerStore = create<IViewerState>((set) => ({
  isDaily: true,
  toggle: () => set((state) => ({ isDaily: !state.isDaily })),
  setViewer: (isDaily) => set(() => ({ isDaily })),
}));
