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
  editTask: (id: string, task: Partial<Omit<ITask, "id">>) => void;

  setFixedTask: (fixedTasks: IFixedTask[]) => void;
  addFixedTask: (fixedTask: IFixedTask) => void;
  delFixedTask: (id: string) => void;
  editFixedTask: (
    id: string,
    fixedTask: Partial<Omit<IFixedTask, "id">>
  ) => void;

  setTaskOrder: (tasks: ITaskOrder[]) => void;

  setPastTask: (tasks: IPastTask[]) => void;
  addPastTask: (task: IPastTask) => void;
  delPastTask: (id: string) => void;
  editPastTask: (id: string, task: Partial<Omit<IPastTask, "id">>) => void;
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
  editTask: (id, task) =>
    set((state) => ({
      tasks: state.tasks.map((e) => {
        if (e.id === id) {
          const tmp = { ...e };
          for (const key in task) {
            if (tmp.hasOwnProperty(key)) {
              try {
                tmp[key] = task[key];
              } catch (err) {
                console.error(err);
              }
            }
          }
          return tmp;
        } else {
          return e;
        }
      }),
    })),

  setFixedTask: (fixedTasks) => set(() => ({ fixedTasks: fixedTasks })),
  addFixedTask: (fixedTask) =>
    set((state) => ({ fixedTasks: [...state.fixedTasks, fixedTask] })),
  delFixedTask: (id) =>
    set((state) => ({
      fixedTasks: state.fixedTasks.filter((e) => e.id !== id),
    })),
  editFixedTask: (id, fixedTask) =>
    set((state) => ({
      fixedTasks: state.fixedTasks.map((e) => {
        if (e.id === id) {
          const tmp = { ...e };
          for (const key in fixedTask) {
            if (tmp.hasOwnProperty(key)) {
              try {
                tmp[key] = fixedTask[key];
              } catch (err) {
                console.error(err);
              }
            }
          }
          return tmp;
        } else {
          return e;
        }
      }),
    })),

  setTaskOrder: (tasks) => set(() => ({ taskOrders: tasks })),

  setPastTask: (tasks) => set(() => ({ pastTasks: tasks })),
  addPastTask: (task) =>
    set((state) => ({ pastTasks: [...state.pastTasks, task] })),
  delPastTask: (id) =>
    set((state) => ({ pastTasks: state.pastTasks.filter((e) => e.id !== id) })),
  editPastTask: (id, task) =>
    set((state) => ({
      pastTasks: state.pastTasks.map((e) => {
        if (e.id === id) {
          const tmp = { ...e };
          for (const key in task) {
            if (tmp.hasOwnProperty(key)) {
              try {
                tmp[key] = task[key];
              } catch (err) {
                console.error(err);
              }
            }
          }
          return tmp;
        } else {
          return e;
        }
      }),
    })),
}));
