import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useState } from "react";
import { getDoubleDigit } from "../../lib/string";
import { dailyArr, ICalendar } from "../calendar/core";
import TaskCell from "./taskCell";
import { ITaskOrder } from "../../lib/task";
import "./taskViewer.scss";
import { IDBFixedTask, IDBTask } from "../../db";
import FixedTaskCell from "./fixedTaskCell";
import { motion } from "framer-motion";

dayjs.extend(isBetween);

const dayArr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface IProps {
  onTask?: (origin: IDBTask, taskOrder: ITaskOrder) => void;
  onFixedTask?: (fixedTask: IDBFixedTask) => void;
  onLeave?: () => void;
}

type TTaskType = "task" | "fixedTask";

interface ISelected {
  index: number;
  taskName: string;
  type: TTaskType;
  startTime: Date;
  endTime: Date;
}

function MonthlyViewer(props: IProps) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [calendar, setCalendar] = useState<ICalendar[]>([]);
  const [selected, setSelected] = useState<ISelected | null>(null);

  const getClassName = (cell: ICalendar, index: number) => {
    const classList: string[] = [];
    // status
    classList.push(cell.status);
    // weekday
    switch ((index + 1) % 7) {
      case 0:
        classList.push("saturday");
        break;
      case 1:
        classList.push("sunday");
        break;
    }
    // today
    if (dayjs(cell.date).isSame(new Date(), "day")) {
      classList.push("today");
    }
    return classList.join(" ");
  };

  const setToday = () => {
    const today = new Date();
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  const monthHadler = (delta: number) => {
    let tmpMonth = month + (delta % 12);
    let tmpYear = year;
    if (tmpMonth > 11) {
      tmpMonth = tmpMonth - 12;
      tmpYear += 1;
    } else if (tmpMonth < 0) {
      tmpMonth = 12 + tmpMonth;
      tmpYear -= 1;
    }
    setYear(tmpYear);
    setMonth(tmpMonth);
  };

  const onTask = (origin: IDBTask, taskOrder: ITaskOrder, index: number) => {
    if (props.onTask) props.onTask(origin, taskOrder);
    setSelected({
      type: "task",
      taskName: taskOrder.taskName,
      startTime: taskOrder.startTime,
      endTime: taskOrder.endTime,
      index,
    });
  };

  const onFixedTask = (fixedTask: IDBFixedTask, index: number) => {
    if (props.onFixedTask) props.onFixedTask(fixedTask);
    setSelected({
      type: "fixedTask",
      taskName: fixedTask.taskName,
      startTime: fixedTask.startTime,
      endTime: fixedTask.endTime,
      index,
    });
  };

  const onLeave = () => {
    if (props.onLeave) props.onLeave();
    setSelected(null);
  };

  useEffect(() => {
    setCalendar(dailyArr(year, month));
  }, [year, month]);

  return (
    <div className="monthlyViewer">
      <div className="navigation">
        <button onClick={() => setYear((prev) => prev - 1)}>
          <FontAwesomeIcon icon={faAnglesLeft} />
        </button>
        <button onClick={() => monthHadler(-1)}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <button onClick={setToday}>
          {year}.{getDoubleDigit(month + 1)}
        </button>
        <button onClick={() => monthHadler(1)}>
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
        <button onClick={() => setYear((prev) => prev + 1)}>
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </div>
      <div className="day">
        {dayArr.map((day, i) => {
          return <p key={i}>{day}</p>;
        })}
      </div>
      <div className="table">
        {calendar.map((cell, i) => {
          return (
            <button key={i} className={getClassName(cell, i)}>
              <p className="value">{cell.value}</p>
              <TaskCell
                date={cell.date}
                onHover={(origin, taskOrder) => onTask(origin, taskOrder, i)}
                onLeave={onLeave}
              />
              <FixedTaskCell
                date={cell.date}
                onHover={(fixedTask) => onFixedTask(fixedTask, i)}
                onLeave={onLeave}
              />
              {selected && selected.index === i ? (
                <div className="tooltipArea">
                  <motion.div
                    className="tooltip"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <p className={`taskName ${selected.type}`}>{selected.taskName}</p>
                    <p className="taskTime">
                      {selected.startTime.toLocaleTimeString()} ~{" "}
                      {selected.endTime.toLocaleTimeString()}
                    </p>
                  </motion.div>
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MonthlyViewer;
