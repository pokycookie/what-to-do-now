import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Calendar from "../components/calendar";
import Clock from "../components/clock";
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
      <Calendar onChange={(date) => console.log(date.toString())} />
      <Clock onChange={(timeObj) => console.log(timeObj)} />
      <button className="addTaskBtn" onClick={addTaskHandler}>
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}
