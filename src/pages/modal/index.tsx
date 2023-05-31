import Modal from "@/components/modal";
import { css } from "@emotion/react";
import AddTask from "./addTask";
import EditTask from "./editTask";

export default function ModalIndex() {
  return (
    <>
      <Modal modalID="addTask" CSS={addTaskCSS}>
        <AddTask />
      </Modal>
      <Modal modalID="editTask" CSS={addTaskCSS} autoClose>
        <EditTask />
      </Modal>
    </>
  );
}

const addTaskCSS = css({
  width: "70%",
  minWidth: "370px",
  maxWidth: "700px",
  height: "600px",

  padding: "20px",
});
