import { IFixedTask, IPastTask, ITask, ITaskOrder } from "@/types";
import { create } from "zustand";

interface IDataState {
  tasks: ITask[];
  fixedTasks: IFixedTask[];
  taskOrders: ITaskOrder[];
  pastTasks: IPastTask[];

  setTask: (tasks: ITask[]) => void;
  addTask: (task: ITask) => void;
  delTask: (id: string) => void;

  setFixedTask: (fixedTasks: IFixedTask[]) => void;
  addFixedTask: (fixedTask: IFixedTask) => void;
  delFixedTask: (id: string) => void;

  setTaskOrder: (tasks: ITaskOrder[]) => void;

  setPastTask: (tasks: IPastTask[]) => void;
  addPastTask: (task: IPastTask) => void;
  delPastTask: (id: string) => void;
}

export const useDataStore = create<IDataState>((set) => ({
  tasks: [],
  fixedTasks: [],
  taskOrders: [],
  pastTasks: [],

  setTask: (tasks) => set(() => ({ tasks: tasks })),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  delTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((e) => e.id !== id) })),

  setFixedTask: (fixedTasks) => set(() => ({ fixedTasks: fixedTasks })),
  addFixedTask: (fixedTask) =>
    set((state) => ({ fixedTasks: [...state.fixedTasks, fixedTask] })),
  delFixedTask: (id) =>
    set((state) => ({
      fixedTasks: state.fixedTasks.filter((e) => e.id !== id),
    })),

  setTaskOrder: (tasks) => set(() => ({ taskOrders: tasks })),

  setPastTask: (tasks) => set(() => ({ pastTasks: tasks })),
  addPastTask: (task) =>
    set((state) => ({ pastTasks: [...state.pastTasks, task] })),
  delPastTask: (id) =>
    set((state) => ({ pastTasks: state.pastTasks.filter((e) => e.id !== id) })),
}));
