import { configureStore, createAction, createReducer } from "@reduxjs/toolkit";
import { IDBFixedTask } from "./db";
import { ITaskOrder } from "./lib/task";

export type TModal = "add";
export type TViewerType = "daily" | "monthly";

export interface IReduxStore {
  modal: TModal | null;
  taskOrder: ITaskOrder[];
  fixedTask: IDBFixedTask[];
  viewerType: TViewerType;
}

const initState: IReduxStore = {
  modal: null,
  taskOrder: [],
  fixedTask: [],
  viewerType: "daily",
};

export const RSetModal = createAction<TModal | null>("MODAL");
export const RSetTaskOrder = createAction<ITaskOrder[]>("TASKORDER");
export const RSetFixedTask = createAction<IDBFixedTask[]>("FIXEDTASK");
export const RSetViewerType = createAction<TViewerType>("VIEWERTYPE");

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
    })
    .addCase(RSetViewerType, (state, action) => {
      state.viewerType = action.payload;
    });
});

export default configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
