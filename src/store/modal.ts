import { create } from "zustand";

interface IModalState {
  modalID: string | null;
  payload: any;
  openModal: (id: string, payload?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<IModalState>((set) => ({
  modalID: null,
  payload: null,
  openModal: (id, payload = null) => set(() => ({ modalID: id, payload })),
  closeModal: () => set(() => ({ modalID: null })),
}));
