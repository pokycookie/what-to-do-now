import { useState } from "react";
import EditTaskModal from "./components/editTaskModal";
import { TModal } from "./lib/type";
import TaskPage from "./pages/taskPage";

export default function App() {
  const [modal, setModal] = useState<TModal | null>(null);

  return (
    <div className="App">
      <div
        className="nonModal"
        style={modal ? { filter: "blur(3px)" } : undefined}
      >
        <TaskPage setModal={setModal} />
      </div>
      {modal ? (
        <div className="modalArea">
          <EditTaskModal setModal={setModal} />
        </div>
      ) : null}
    </div>
  );
}
