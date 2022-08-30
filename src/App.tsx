import { useEffect, useState } from "react";
import IndexedDB from "./lib/indexedDB";
import { TModal } from "./lib/type";
import ModalSwitch from "./modalSwitch";
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

      <ModalSwitch modal={modal} setModal={setModal} DB={DB} />
    </div>
  );
}
