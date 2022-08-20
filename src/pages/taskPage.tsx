import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../scss/pages/taskPage.scss";

export default function TaskPage() {
  return (
    <div className="taskPage">
      <button className="addTaskBtn">
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
}
