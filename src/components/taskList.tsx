import { IFixedTask, ITask } from "../lib/type";
import "../scss/components/taskList.scss";

interface IProps {
  data: ITask | IFixedTask;
}

export default function TaskList(props: IProps) {
  return (
    <div className="taskList">
      <p>{props.data.content}</p>
    </div>
  );
}
