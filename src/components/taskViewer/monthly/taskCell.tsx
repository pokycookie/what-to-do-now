import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useMemo } from "react";
import { css } from "@emotion/react";
import { ITaskOrder } from "@/utils";
import db, { IDBTask } from "@/db";
import { useDataStore } from "@/store";
import { bgDark, textBlue } from "@/styles/color";

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
    <div css={taskCellCSS}>
      {taskOrders.map((task, i) => {
        return (
          <div
            css={taskCSS}
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

const taskCellCSS = css({
  width: "100%",
});

const taskCSS = css({
  height: "20px",
  position: "absolute",

  boxSizing: "border-box",
  border: `1px solid ${bgDark}`,
  padding: "0px",
  backgroundColor: textBlue,
});

export default TaskCell;
