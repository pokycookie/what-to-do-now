import { useDataStore } from "@/store";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useMemo } from "react";
import { css } from "@emotion/react";
import { bgDark, textRed } from "@/styles/color";
import { IFixedTask } from "@/types";

dayjs.extend(isBetween);

interface IFixedTaskCell {
  left: number;
  width: number;
  data: IFixedTask;
}

interface IProps {
  date: Date;
  onHover?: (fixedTask: IFixedTask) => void;
  onLeave?: () => void;
}

function FixedTaskCell(props: IProps) {
  const { fixedTasks } = useDataStore();

  const fixedTaskCells = useMemo(() => {
    return fixedTasks
      .filter((task) =>
        dayjs(props.date).isBetween(task.startTime, task.endTime, "day", "[]")
      )
      .map<IFixedTaskCell>((task) => {
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
  }, [fixedTasks, props.date]);

  const hoverHandler = async (task: IFixedTaskCell) => {
    if (props.onHover) props.onHover(task.data);
  };

  return (
    <div css={fixedTaskCellCSS}>
      {fixedTaskCells.map((task, i) => {
        return (
          <div
            css={fixedTaskCSS}
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

const fixedTaskCellCSS = css({
  width: "100%",
});

const fixedTaskCSS = css({
  height: "20px",
  position: "absolute",

  boxSizing: "border-box",
  border: `1px solid ${bgDark}`,
  padding: "0px",
  backgroundColor: textRed,
});

export default FixedTaskCell;
