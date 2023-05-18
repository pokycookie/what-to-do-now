import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import TaskList from "./taskList";
import { useDataStore } from "@/store";
import SvgDonut from "../../svg/donut";
import SvgOverlay from "../../svg/overlay";
import SvgArc from "../../svg/arc";
import { css } from "@emotion/react";
import { textBlue, textRed } from "@/styles/color";
import { bgDark } from "@/styles/color";
import ListBtn from "./listBtn";

dayjs.extend(isBetween);
dayjs.extend(relativeTime);

type TTaskType = "task" | "fixedTask";

interface IArc {
  taskName: string;
  type: TTaskType;
  startTime: Date;
  endTime: Date;
  startDeg: number;
  endDeg: number;
}

interface IProps {
  date: Date;
}

function DailyViewer(props: IProps) {
  const [selected, setSelected] = useState<IArc | null>(null);
  const [dateMemo, setDateMemo] = useState(props.date);

  const taskOrder = useDataStore((state) => state.taskOrder);
  const fixedTask = useDataStore((state) => state.fixedTask);

  const taskArc = useMemo(() => {
    return taskOrder
      .filter((task) => dayjs(props.date).isBetween(task.startTime, task.endTime, "day", "[]"))
      .map<IArc>((task) => {
        const startOfDate = dayjs(props.date).startOf("day").toDate();
        const endOfDate = dayjs(props.date).endOf("day").toDate();
        const startTime = dayjs(task.startTime).isBefore(startOfDate)
          ? startOfDate
          : task.startTime;
        const endTime = dayjs(task.endTime).isAfter(endOfDate) ? endOfDate : task.endTime;
        const startDeg = (dayjs(startTime).diff(startOfDate, "minute") / 1440) * 360;
        const endDeg = (dayjs(endTime).diff(endOfDate, "minute") / 1440) * 360;

        return {
          taskName: task.taskName,
          type: "task",
          startTime,
          endTime,
          startDeg,
          endDeg,
        };
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateMemo, taskOrder]);

  const fixedTaskArc = useMemo(() => {
    return fixedTask
      .filter((task) => dayjs(props.date).isBetween(task.startTime, task.endTime, "day", "[]"))
      .map<IArc>((task) => {
        const startOfDate = dayjs(props.date).startOf("day").toDate();
        const endOfDate = dayjs(props.date).endOf("day").toDate();
        const startTime = dayjs(task.startTime).isBefore(startOfDate)
          ? startOfDate
          : task.startTime;
        const endTime = dayjs(task.endTime).isAfter(endOfDate) ? endOfDate : task.endTime;
        const startDeg = (dayjs(startTime).diff(startOfDate, "minute") / 1440) * 360;
        const endDeg = (dayjs(endTime).diff(endOfDate, "minute") / 1440) * 360;

        return {
          taskName: task.taskName,
          type: "fixedTask",
          startTime,
          endTime,
          startDeg,
          endDeg,
        };
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateMemo, fixedTask]);

  const arcArr = [...taskArc, ...fixedTaskArc];
  const currentTime =
    (dayjs(props.date).diff(dayjs(props.date).startOf("day"), "minute") / 1440) * 360;

  useEffect(() => {
    if (!dayjs(props.date).isSame(dateMemo, "day")) {
      setDateMemo(props.date);
    }
  }, [dateMemo, props.date]);

  return (
    <div css={dailyViewerCSS}>
      <SvgOverlay>
        <SvgDonut color="#2c3333" holeSize={85} overlay />
        <svg viewBox="0 0 200 200" css={{ position: "absolute" }}>
          <SvgArc startDeg={0} endDeg={currentTime} size={89} holeSize={87} color="#FF6000" />
          {arcArr.map((task, i) => {
            return (
              <SvgArc
                key={i}
                startDeg={task.startDeg}
                endDeg={task.endDeg}
                color={task.type === "task" ? "#0096ff" : "#eb1d36"}
                strokeWidth={1}
                holeSize={90}
                onMouseEnter={() => setSelected(task)}
                onMouseLeave={() => setSelected(null)}
                overlay
              />
            );
          })}
        </svg>
      </SvgOverlay>
      <div css={indicatorCSS}>
        {selected ? (
          <div css={[selectedTaskCSS, { color: selected.type === "task" ? textBlue : textRed }]}>
            <p css={taskNameCSS}>{selected.taskName}</p>
            <p css={taskTimeCSS}>
              {selected.startTime.toLocaleTimeString()} ~ {selected.endTime.toLocaleTimeString()}
            </p>
          </div>
        ) : (
          <TaskList />
        )}
      </div>
      <ListBtn direction="left" />
      <ListBtn direction="right" />
      <ListBtn direction="top" />
      <ListBtn direction="bottom" />
    </div>
  );
}

const dailyViewerCSS = css({
  width: "500px",
  height: "500px",
  position: "relative",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const indicatorCSS = css({
  position: "absolute",
});

const selectedTaskCSS = css({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

const taskNameCSS = css({
  fontSize: "24px",
  fontWeight: 600,
  marginBottom: "15px",
});

const taskTimeCSS = css({
  fontSize: "16px",
  fontWeight: 400,
  color: bgDark,
});

export default DailyViewer;
