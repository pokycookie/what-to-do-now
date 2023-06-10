import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useMemo } from "react";
import { css } from "@emotion/react";
import { useDataStore, useModalStore } from "@/store";
import { bgDark, textBlue } from "@/styles/color";
import { ITask, ITaskOrder } from "@/types";

dayjs.extend(isBetween);

interface ITaskCell {
  left: number;
  width: number;
  data: ITaskOrder;
}

interface IProps {
  date: Date;
  onHover?: (origin: ITask, taskOrder: ITaskOrder) => void;
  onLeave?: () => void;
}

function TaskCell(props: IProps) {
  const { taskOrders, tasks } = useDataStore();
  const openModal = useModalStore((state) => state.openModal);

  const taskCells = useMemo(() => {
    return taskOrders
      .filter((task) =>
        dayjs(props.date).isBetween(task.startTime, task.endTime, "day", "[]")
      )
      .map<ITaskCell>((task) => {
        const start = Math.max(
          (dayjs(task.startTime).diff(
            dayjs(props.date).startOf("day"),
            "minute"
          ) /
            1440) *
            100,
          0
        );
        const end = Math.min(
          (dayjs(task.endTime).diff(
            dayjs(props.date).startOf("day"),
            "minute"
          ) /
            1440) *
            100,
          100
        );
        return {
          left: start,
          width: end - start,
          data: task,
        };
      });
  }, [props.date, taskOrders]);

  const hoverHandler = async (task: ITaskCell) => {
    if (props.onHover) {
      const origin = tasks.find((e) => e.id === task.data.id);
      if (origin) props.onHover(origin, task.data);
    }
  };

  const clickHandler = (task: ITaskCell) => {
    const data = tasks.find((e) => e.id === task.data.id);
    if (data) {
      openModal("editTask", { type: "task", data });
    }
  };

  return (
    <div css={taskCellCSS}>
      {taskCells.map((task, i) => {
        return (
          <div
            css={taskCSS}
            key={i}
            style={{ width: `${task.width}%`, left: `${task.left}%` }}
            onMouseEnter={() => hoverHandler(task)}
            onMouseLeave={props.onLeave}
            onClick={() => clickHandler(task)}
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
