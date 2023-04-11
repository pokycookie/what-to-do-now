import SvgArc from "../svg/arc";
import { useEffect, useMemo, useState } from "react";
import SvgDonut from "../svg/donut";
import SvgOverlay from "../svg/overlay";
import { shallowEqual, useSelector } from "react-redux";
import { IReduxStore } from "../../redux";
import { ITaskOrder } from "../../lib/task";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { IDBFixedTask } from "../../db";
import "./taskViewer.scss";
import TaskList from "./taskList";

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

  const taskOrder = useSelector<IReduxStore, ITaskOrder[]>((state) => {
    return state.taskOrder;
  }, shallowEqual);
  const fixedTask = useSelector<IReduxStore, IDBFixedTask[]>((state) => {
    return state.fixedTask;
  }, shallowEqual);

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
    <div className="dailyViewer">
      <SvgOverlay>
        <SvgDonut color="#2c3333" holeSize={85} overlay />
        <svg viewBox="0 0 200 200" style={{ position: "absolute" }}>
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
      <div className="indicator">
        {selected ? (
          <div className={`selectedTask ${selected.type}`}>
            <p className="taskName">{selected.taskName}</p>
            <p className="taskTime">
              {selected.startTime.toLocaleTimeString()} ~ {selected.endTime.toLocaleTimeString()}
            </p>
          </div>
        ) : (
          <TaskList />
        )}
      </div>
    </div>
  );
}

export default DailyViewer;