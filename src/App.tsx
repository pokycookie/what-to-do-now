import { useEffect, useState } from "react";
import EditTaskModal from "./components/editTaskModal";
import IndexedDB from "./lib/indexedDB";
import { TModal } from "./lib/type";
import TaskPage from "./pages/taskPage";

export default function App() {
  const [DB, setDB] = useState<IDBDatabase>();
  const [modal, setModal] = useState<TModal | null>(null);

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
        <TaskPage setModal={setModal} />
      </div>
      {modal ? (
        <div className="modalArea">
          <EditTaskModal setModal={setModal} DB={DB} />
        </div>
      ) : null}
    </div>
  );
}
