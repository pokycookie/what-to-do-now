import moment from "moment";
import { ITask } from "../lib/type";
import "../scss/components/taskList.scss";

interface IProps {
  data: ITask;
  onClick?: (data: ITask) => void;
}

export default function TaskList(props: IProps) {
  const clickHandler = (data: ITask) => {
    if (props.onClick) props.onClick(data);
  };

  return (
    <div className="taskList" onClick={() => clickHandler(props.data)}>
      <p>{props.data.content}</p>
      {props.data.deadLine ? <p>{moment(props.data.deadLine).format("yyyy-MM-DD HH:mm")}</p> : null}
    </div>
  );
}
