import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TModal } from "../lib/type";
import "../scss/pages/taskPage.scss";

interface IProps {
  setModal: React.Dispatch<React.SetStateAction<TModal | null>>;
}

export default function TaskPage(props: IProps) {
  const addTaskHandler = () => {
    props.setModal("editTask");
  };

  const addFixedTaskHandler = () => {
    props.setModal("editFixedTask");
  };

  return (
    <div className="taskPage">
      <button className="addTaskBtn" onClick={addTaskHandler}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
      <button className="addTaskBtn" onClick={addFixedTaskHandler}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}
