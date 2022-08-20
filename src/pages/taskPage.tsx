import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calendar from "../components/calendar";
import { TModal } from "../lib/type";
import "../scss/pages/taskPage.scss";

interface IProps {
  setModal: React.Dispatch<React.SetStateAction<TModal | null>>;
}

export default function TaskPage(props: IProps) {
  const addTaskHandler = () => {
    props.setModal("editTask");
  };

  return (
    <div className="taskPage">
      <Calendar />
      <button className="addTaskBtn" onClick={addTaskHandler}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}
