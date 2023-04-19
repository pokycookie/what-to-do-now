import dayjs from "dayjs";
import db, { IDBTask } from "../../db";
import { ITaskOrder } from "../../lib/task";
import isBetween from "dayjs/plugin/isBetween";
import "./taskViewer.scss";
import { useMemo } from "react";
import { useDataStore } from "../../zustand";

dayjs.extend(isBetween);

interface ITaskCell {
  left: number;
  width: number;
  data: ITaskOrder;
}

interface IProps {
  date: Date;
  onHover?: (origin: IDBTask, taskOrder: ITaskOrder) => void;
  onLeave?: () => void;
}

function TaskCell(props: IProps) {
  const taskOrder = useDataStore((state) => state.taskOrder);

  const taskOrders = useMemo(() => {
    return taskOrder
      .filter((task) => dayjs(props.date).isBetween(task.startTime, task.endTime, "day", "[]"))
      .map<ITaskCell>((task) => {
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
  }, [props.date, taskOrder]);

  const hoverHandler = async (task: ITaskCell) => {
    if (props.onHover) {
      const origin = await db.task.get(task.data.id);
      if (origin) props.onHover(origin, task.data);
    }
  };

  return (
    <div className="taskCell">
      {taskOrders.map((task, i) => {
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

export default TaskCell;
