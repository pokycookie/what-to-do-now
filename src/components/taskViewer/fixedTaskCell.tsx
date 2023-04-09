import dayjs from "dayjs";
import { shallowEqual, useSelector } from "react-redux";
import { IDBFixedTask } from "../../db";
import { IReduxStore } from "../../redux";
import isBetween from "dayjs/plugin/isBetween";
import { useMemo } from "react";

dayjs.extend(isBetween);

interface IFixedTaskCell {
  left: number;
  width: number;
  data: IDBFixedTask;
}

interface IProps {
  date: Date;
  onHover?: (fixedTask: IDBFixedTask) => void;
  onLeave?: () => void;
}

function FixedTaskCell(props: IProps) {
  const fixedTask = useSelector<IReduxStore, IDBFixedTask[]>((state) => {
    return state.fixedTask;
  }, shallowEqual);

  const fixedTasks = useMemo(() => {
    return fixedTask
      .filter((task) => dayjs(props.date).isBetween(task.startTime, task.endTime, "day", "[]"))
      .map<IFixedTaskCell>((task) => {
        const start = Math.max(
          (dayjs(task.startTime).diff(dayjs(props.date).startOf("day"), "minute") / 1440) * 100,
          0
        );
        const end = Math.min(
          (dayjs(task.endTime).diff(dayjs(props.date).startOf("day"), "minute") / 1440) * 100,
          100
        );
        return {
          left: start,
          width: end - start,
          data: task,
        };
      });
  }, [fixedTask, props.date]);

  const hoverHandler = async (task: IFixedTaskCell) => {
    if (props.onHover) props.onHover(task.data);
  };

  return (
    <div className="fixedTaskCell">
      {fixedTasks.map((task, i) => {
        return (
          <div
            className="task"
            key={i}
            style={{ width: `${task.width}%`, left: `${task.left}%` }}
            onMouseEnter={() => hoverHandler(task)}
            onMouseLeave={props.onLeave}
          ></div>
        );
      })}
    </div>
  );
}

export default FixedTaskCell;
