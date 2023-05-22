import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import TaskList from "./taskList";
import { useAppDataStore, useDataStore } from "@/store";
import { css } from "@emotion/react";
import { bgDark, textBlue, textRed } from "@/styles/color";
import SvgDonut from "@/components/svg/donut";
import SvgArc from "@/components/svg/arc";
import { motion, useMotionValue, useTransform } from "framer-motion";

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

function DailyViewer() {
  const [selected, setSelected] = useState<IArc | null>(null);

  const { currentTime } = useAppDataStore();
  const { taskOrders, fixedTasks } = useDataStore();

  const motionX = useMotionValue(0);
  const motionColor = useTransform(
    motionX,
    [-100, 0, 100],
    [textBlue, bgDark, textRed]
  );

  const dateMemo = useRef(currentTime);

  const taskArc = useMemo(() => {
    return taskOrders
      .filter((task) =>
        dayjs(currentTime).isBetween(task.startTime, task.endTime, "day", "[]")
      )
      .map<IArc>((task) => {
        const startOfDate = dayjs(currentTime).startOf("day").toDate();
        const endOfDate = dayjs(currentTime).endOf("day").toDate();
        const startTime = dayjs(task.startTime).isBefore(startOfDate)
          ? startOfDate
          : task.startTime;
        const endTime = dayjs(task.endTime).isAfter(endOfDate)
          ? endOfDate
          : task.endTime;
        const startDeg =
          (dayjs(startTime).diff(startOfDate, "minute") / 1440) * 360;
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
  }, [dateMemo, taskOrders]);

  const fixedTaskArc = useMemo(() => {
    return fixedTasks
      .filter((task) =>
        dayjs(currentTime).isBetween(task.startTime, task.endTime, "day", "[]")
      )
      .map<IArc>((task) => {
        const startOfDate = dayjs(currentTime).startOf("day").toDate();
        const endOfDate = dayjs(currentTime).endOf("day").toDate();
        const startTime = dayjs(task.startTime).isBefore(startOfDate)
          ? startOfDate
          : task.startTime;
        const endTime = dayjs(task.endTime).isAfter(endOfDate)
          ? endOfDate
          : task.endTime;
        const startDeg =
          (dayjs(startTime).diff(startOfDate, "minute") / 1440) * 360;
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
  }, [dateMemo.current, fixedTasks]);

  const arcArr = [...taskArc, ...fixedTaskArc];
  const currentTimeDegree =
    (dayjs(currentTime).diff(dayjs(currentTime).startOf("day"), "minute") /
      1440) *
    360;

  useEffect(() => {
    if (!dayjs(currentTime).isSame(dateMemo.current, "day")) {
      dateMemo.current = currentTime;
    }
  }, [currentTime]);

  return (
    <div css={dailyViewerCSS}>
      <SvgDonut color="#2c3333" holeSize={85} overlay />
      <svg viewBox="0 0 200 200" css={{ position: "absolute" }}>
        <SvgArc
          startDeg={0}
          endDeg={currentTimeDegree}
          size={89}
          holeSize={87}
          color="#FF6000"
        />
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
      <div css={indicatorCSS}>
        {selected ? (
          <div
            css={[
              selectedTaskCSS,
              { color: selected.type === "task" ? textBlue : textRed },
            ]}
          >
            <p css={taskNameCSS}>{selected.taskName}</p>
            <p css={taskTimeCSS}>
              {selected.startTime.toLocaleTimeString()} ~{" "}
              {selected.endTime.toLocaleTimeString()}
            </p>
          </div>
        ) : (
          <TaskList />
        )}
      </div>
      <div css={controllerAreaCSS}>
        <motion.div
          css={successControllerCSS}
          style={{ x: motionX, borderColor: motionColor }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
        ></motion.div>
      </div>
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

const controllerAreaCSS = css({
  width: "400px",
  height: "400px",
  position: "absolute",
  borderRadius: "100%",
  overflow: "hidden",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const successControllerCSS = css({
  width: "30px",
  height: "30px",

  position: "absolute",
  bottom: "50px",

  border: "2px solid",
  borderRadius: "100%",
  cursor: "pointer",
});

export default DailyViewer;
