import { useCallback, useEffect, useState } from "react";
import IndexedDB from "./lib/indexedDB";
import { IFixedTask, ITask, TModal, TStore } from "./lib/type";
import ModalSwitch from "./modalSwitch";
import TaskPage from "./pages/taskPage";

export default function App() {
  const [DB, setDB] = useState<IDBDatabase>();
  const [modal, setModal] = useState<TModal | null>(null);
  const [taskDB, setTaskDB] = useState<ITask[]>([]);
  const [fixedTaskDB, setFixedTaskDB] = useState<IFixedTask[]>([]);

  const refreshTask = useCallback(async () => {
    if (DB) {
      const taskArr = await IndexedDB.readAll<ITask>(DB, "task");
      console.log(taskArr);
      setTaskDB(taskArr);
    }
  }, [DB]);

  const refreshFixedTask = useCallback(async () => {
    if (DB) {
      const taskArr = await IndexedDB.readAll<IFixedTask>(DB, "fixedTask");
      console.log(taskArr);
      setFixedTaskDB(taskArr);
    }
  }, [DB]);

  const refresh = (store: TStore) => {
    switch (store) {
      case "task":
        refreshTask();
        break;
      case "fixedTask":
        refreshFixedTask();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    refreshTask();
    refreshFixedTask();
  }, [refreshFixedTask, refreshTask]);

  useEffect(() => {
    const startDB = async () => {
      const tempDB = await IndexedDB.open("whatToDoNow", 1);
      setDB(tempDB);
    };
    startDB();
  }, []);

  return (
    <div className="App">
      <div className="nonModal" style={modal ? { filter: "blur(3px)" } : undefined}>
        <TaskPage setModal={setModal} DB={DB} taskDB={taskDB} fixedTaskDB={fixedTaskDB} />
      </div>

      <ModalSwitch modal={modal} setModal={setModal} DB={DB} refresh={refresh} />
    </div>
  );
}
