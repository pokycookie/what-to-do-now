import EditFixedTaskModal from "./components/editFixedTaskModal";
import EditTaskModal from "./components/editTaskModal";
import { TModal, TStore } from "./lib/type";

interface IProps {
  modal: TModal | null;
  setModal: React.Dispatch<React.SetStateAction<TModal | null>>;
  DB?: IDBDatabase;
  refresh: (store: TStore) => void;
}

export default function ModalSwitch(props: IProps) {
  switch (props.modal) {
    case null:
      return null;
    case "editTask":
      return (
        <div className="modalArea">
          <EditTaskModal setModal={props.setModal} DB={props.DB} refresh={props.refresh} />
        </div>
      );
    case "editFixedTask":
      return (
        <div className="modalArea">
          <EditFixedTaskModal setModal={props.setModal} DB={props.DB} refresh={props.refresh} />
        </div>
      );
  }
}
