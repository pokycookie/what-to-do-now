import { useEffect, useRef } from "react";
import Nav from "./components/navigator/nav";
import Main from "./pages/main";
import ModalIndex from "./pages/modal";
import "./styles/globals.scss";
import { useAppDataStore, useDataStore } from "./store";
import { IFile } from "./types";
import { getTaskOrder } from "./utils";
import { useInterval } from "./hooks";
import dayjs from "dayjs";

export default function App() {
  const initLoaded = useRef(false);

  const { updateCurrentTime } = useAppDataStore();
  const {
    setTask,
    setFixedTask,
    setPastTask,
    setTaskOrder,
    delTask,
    addPastTask,
    tasks,
    fixedTasks,
    pastTasks,
  } = useDataStore();

  useEffect(() => {
    const init = async () => {
      const electron = window.require("electron");

      electron.ipcRenderer.send("fsRead");
      electron.ipcRenderer.on("fsRead", (event: any, args: string) => {
        const fileData = JSON.parse(args, (key, value) => {
          if (typeof value === "string") {
            const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
            if (dateRegex.test(value)) {
              return new Date(value);
            }
          }
          return value;
        }) as IFile;

        setTask(fileData.data.tasks);
        setFixedTask(fileData.data.fixedTasks);
        setPastTask(fileData.data.pastTasks);

        initLoaded.current = true;
      });
    };
    init();
  }, [setFixedTask, setPastTask, setTask]);

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

  useEffect(() => {
    setTaskOrder(getTaskOrder(tasks, fixedTasks));
  }, [tasks, fixedTasks, setTaskOrder]);

  useInterval(() => {
    const now = new Date();

    for (let i = 0; i < tasks.length; i++) {
      if (dayjs(tasks[i].deadline).isBefore(now, "minute")) {
        delTask(tasks[i].id);
        addPastTask({ ...tasks[i], success: false });
      } else {
        break;
      }
    }

    // getTaskOrder가 1분마다 반복되는 부분 개선 필요
    setTaskOrder(getTaskOrder(tasks, fixedTasks));
    updateCurrentTime();
  }, 30000);

  return (
    <div className="App">
      <Nav />
      <Main />
      <ModalIndex />
    </div>
  );
}
