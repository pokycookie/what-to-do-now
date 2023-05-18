import { create } from "zustand";
import { ITaskOrder } from "../utils/task";
import { IDBFixedTask } from "../db";

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

interface IDataState {
  taskOrder: ITaskOrder[];
  fixedTask: IDBFixedTask[];
  setTaskOrder: (tasks: ITaskOrder[]) => void;
  setFixedTask: (fixedTasks: IDBFixedTask[]) => void;
}
export const useDataStore = create<IDataState>((set) => ({
  taskOrder: [],
  fixedTask: [],
  setTaskOrder: (tasks) => set(() => ({ taskOrder: tasks })),
  setFixedTask: (fixedTasks) => set(() => ({ fixedTask: fixedTasks })),
}));

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
