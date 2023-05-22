import { create } from "zustand";

interface IModalState {
  modalID: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useModalStore = create<IModalState>((set) => ({
  modalID: null,
  openModal: (id) => set(() => ({ modalID: id })),
  closeModal: () => set(() => ({ modalID: null })),
}));
