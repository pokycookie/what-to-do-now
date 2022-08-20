import { TModal } from "../lib/type";
import "../scss/components/editTaskModal.scss";

interface IProps {
  setModal: React.Dispatch<React.SetStateAction<TModal | null>>;
}

export default function EditTaskModal(props: IProps) {
  const cancelHandler = () => {
    props.setModal(null);
  };

  return (
    <div className="editTaskModal">
      <div className="top">
        <input />
      </div>
      <div className="bottom">
        <button>OK</button>
        <button onClick={cancelHandler}>CANCEL</button>
      </div>
    </div>
  );
}
