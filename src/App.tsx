import { useEffect, useRef } from "react";
import Nav from "./components/navigator/nav";
import ModalIndex from "./pages/modal";
import "./styles/globals.scss";
import { useAppDataStore, useDataStore } from "./store";
import { IFile } from "./types";
import { getTaskOrder, makeUUID } from "./utils";
import { useInterval } from "./hooks";
import dayjs from "dayjs";
import Toast from "./components/toast";
import Page from "./components/page";

export default function App() {
  const initLoaded = useRef(false);

  const { updateCurrentTime } = useAppDataStore();
  const dataStore = useDataStore();
  const { tasks, fixedTasks, pastTasks } = useDataStore();

  // Update tasks and pastTasks with deadline
  const updateDeadline = () => {
    const now = new Date();

    const sortedTasks = [...tasks];
    sortedTasks.sort((a, b) => dayjs(a.deadline).diff(b.deadline));

    for (let i = 0; i < tasks.length; i++) {
      if (dayjs(sortedTasks[i].deadline).isBefore(now, "minute")) {
        dataStore.delTask(sortedTasks[i].id);
        dataStore.addPastTask({ ...sortedTasks[i], id: makeUUID(), success: false });
      } else {
        break;
      }
    }

    updateCurrentTime();
    console.log(now);
  };

  // Load fileData
  useEffect(() => {
    const init = async () => {
      const electron = window.require("electron");

      electron.ipcRenderer.send("fsRead");
      electron.ipcRenderer.on("fsRead", (event: any, args: string) => {
        const fileData = JSON.parse(args, (key, value) => {
          if (typeof value === "string") {
            const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
            if (dateRegex.test(value)) return new Date(value);
          }
          return value;
        }) as IFile;

        dataStore.setTask(fileData.data.tasks);
        dataStore.setFixedTask(fileData.data.fixedTasks);
        dataStore.setPastTask(fileData.data.pastTasks);

        initLoaded.current = true;
      });
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update fileData
  useEffect(() => {
    if (initLoaded.current) {
      const electron = window.require("electron");
      const fileData: IFile = {
        meta: null,
        data: { tasks, fixedTasks, pastTasks },
      };
      console.log("write file");
      console.log(fileData.data);

      electron.ipcRenderer.send("fsWrite", JSON.stringify(fileData));
    }
  }, [tasks, fixedTasks, pastTasks]);

  // Update taskOrders
  useEffect(() => {
    dataStore.setTaskOrder(getTaskOrder(tasks, fixedTasks));
    updateDeadline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedTasks, tasks]);

  // Time interval
  useInterval(updateDeadline, 30000);

  return (
    <div className="App">
      <Nav />
      <Page />
      <ModalIndex />
      <Toast />
    </div>
  );
}
