import {
  configureStore,
  createAction,
  createReducer,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { IDBFixedTask } from "./db";
import { ITaskOrder } from "./lib/task";

export type TModal = "add";

export interface IReduxStore {
  modal: TModal | null;
  taskOrder: ITaskOrder[];
  fixedTask: IDBFixedTask[];
}

const initState: IReduxStore = {
  modal: null,
  taskOrder: [],
  fixedTask: [],
};

export const RSetModal = createAction<TModal | null>("MODAL");
export const RSetTaskOrder = createAction<ITaskOrder[]>("TASKORDER");
export const RSetFixedTask = createAction<IDBFixedTask[]>("FIXEDTASK");

const reducer = createReducer(initState, (builder) => {
  builder
    .addCase(RSetModal, (state, action) => {
      state.modal = action.payload;
    })
    .addCase(RSetTaskOrder, (state, action) => {
      state.taskOrder = action.payload;
    })
    .addCase(RSetFixedTask, (state, action) => {
      state.fixedTask = action.payload;
    });
});

export default configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
