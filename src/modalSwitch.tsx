import EditFixedTaskModal from "./components/editFixedTaskModal";
import EditTaskModal from "./components/editTaskModal";
import { TModal } from "./lib/type";

interface IProps {
  modal: TModal | null;
  setModal: React.Dispatch<React.SetStateAction<TModal | null>>;
  DB?: IDBDatabase;
}

export default function ModalSwitch(props: IProps) {
  switch (props.modal) {
    case null:
      return null;
    case "editTask":
      return (
        <div className="modalArea">
          <EditTaskModal setModal={props.setModal} DB={props.DB} />
        </div>
      );
    case "editFixedTask":
      return (
        <div className="modalArea">
          <EditFixedTaskModal setModal={props.setModal} DB={props.DB} />
        </div>
      );
  }
}
