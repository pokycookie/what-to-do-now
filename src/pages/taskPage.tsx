import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TaskList from "../components/taskList";
import { IFixedTask, ITask, TModal } from "../lib/type";
import "../scss/pages/taskPage.scss";

interface IProps {
  DB?: IDBDatabase;
  setModal: React.Dispatch<React.SetStateAction<TModal | null>>;
  taskDB: ITask[];
  fixedTaskDB: IFixedTask[];
}

export default function TaskPage(props: IProps) {
  const addTaskHandler = () => {
    props.setModal("editTask");
  };

  const addFixedTaskHandler = () => {
    props.setModal("editFixedTask");
  };

  // const clickHandler = (data: ITask) => {
  //   const urgency = data.timeTaken / getAT(props.fixedTaskDB, new Date(), data.deadLine);
  //   console.log(urgency);
  // };

  return (
    <div className="taskPage">
      <div className="taskListArea">
        {/* {props.taskDB.map((element, index) => {
          return <TaskList data={element} key={index} onClick={(data) => clickHandler(data)} />;
        })} */}
      </div>
      <div className="addArea">
        <button className="addTaskBtn" onClick={addTaskHandler}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <button className="addTaskBtn" onClick={addFixedTaskHandler}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    </div>
  );
}
