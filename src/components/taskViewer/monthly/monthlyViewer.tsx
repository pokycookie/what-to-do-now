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
import TaskCell from "./taskCell";
import FixedTaskCell from "./fixedTaskCell";
import { motion } from "framer-motion";
import { getDoubleDigit } from "@/utils";
import { ICalendar, dailyArr } from "../../calendar/core";
import { css, SerializedStyles } from "@emotion/react";
import { bgDark, textBlue, textRed } from "@/styles/color";
import { IFixedTask, ITask, ITaskOrder } from "@/types";
import { Marquee } from "@/components/marquee";

dayjs.extend(isBetween);

const dayArr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface IProps {
  onTask?: (origin: ITask, taskOrder: ITaskOrder) => void;
  onFixedTask?: (fixedTask: IFixedTask) => void;
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

  const getCSS = (cell: ICalendar, index: number) => {
    const cssList: SerializedStyles[] = [];
    // status
    switch (cell.status) {
      case "current":
        cssList.push(css({ color: bgDark }));
        break;
      case "next":
        cssList.push(css({ color: "hsl(0, 0%, 75%)" }));
        break;
      case "prev":
        cssList.push(css({ color: "hsl(0, 0%, 75%)" }));
        break;
    }
    if (cell.status !== "current") return cssList;

    // weekday
    switch ((index + 1) % 7) {
      case 0:
        cssList.push(css({ color: textBlue }));
        break;
      case 1:
        cssList.push(css({ color: textRed }));
        break;
    }
    // today
    if (dayjs(cell.date).isSame(new Date(), "day")) {
      cssList.push(css({ textDecoration: "underline" }));
    }
    return cssList;
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

  const onTask = (origin: ITask, taskOrder: ITaskOrder, index: number) => {
    if (props.onTask) props.onTask(origin, taskOrder);
    setSelected({
      type: "task",
      taskName: taskOrder.taskName,
      startTime: taskOrder.startTime,
      endTime: taskOrder.endTime,
      index,
    });
  };

  const onFixedTask = (fixedTask: IFixedTask, index: number) => {
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
    <div css={monthlyViewerCSS}>
      <div css={navigationCSS}>
        <button css={navBtnCSS} onClick={() => setYear((prev) => prev - 1)}>
          <FontAwesomeIcon icon={faAnglesLeft} />
        </button>
        <button css={navBtnCSS} onClick={() => monthHadler(-1)}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <button css={[navBtnCSS, { width: "100%", fontWeight: 600 }]} onClick={setToday}>
          {year}.{getDoubleDigit(month + 1)}
        </button>
        <button css={navBtnCSS} onClick={() => monthHadler(1)}>
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
        <button css={navBtnCSS} onClick={() => setYear((prev) => prev + 1)}>
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </div>
      <div css={dayAreaCSS}>
        {dayArr.map((day, i) => {
          return <p key={i}>{day}</p>;
        })}
      </div>
      <div css={tableCSS}>
        {calendar.map((cell, i) => {
          return (
            <button key={i} css={[tableCellCSS, ...getCSS(cell, i)]}>
              <p css={tableValueCSS}>{cell.value}</p>
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
                <div css={toolTipAreaCSS}>
                  <motion.div
                    css={toolTipCSS}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <Marquee
                      emotion={[
                        taskNameCSS,
                        { color: selected.type === "task" ? textBlue : textRed },
                      ]}
                      animate
                      speed={0.5}
                    >
                      {selected.taskName}
                    </Marquee>
                    <p css={taskTimeCSS}>
                      {dayjs(selected.startTime).format("HH:mm")} ~{" "}
                      {dayjs(selected.endTime).format("HH:mm")}
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

const monthlyViewerCSS = css({
  width: "100%",
  minWidth: "250px",
  height: "calc(100% - 76px)",
  position: "relative",

  color: bgDark,
  backgroundColor: "white",
  borderRadius: "5px",

  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",

  userSelect: "none",
  overflow: "hidden",
});

const navigationCSS = css({
  width: "100%",
  height: "30px",

  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
});

const navBtnCSS = css({
  width: "40px",
  height: "100%",
  border: "none",

  transition: "all 0.3s",
  backgroundColor: "white",
  color: bgDark,
  cursor: "default",

  ":hover": {
    backgroundColor: "hsl(0, 0%, 93%)",
  },
});

const dayAreaCSS = css({
  width: "100%",
  height: "30px",

  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  justifyItems: "center",
  alignItems: "center",

  fontSize: "11px",
  fontWeight: 600,
});

const tableCSS = css({
  flex: 1,
  width: "100%",

  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gridTemplateRows: "repeat(6, 1fr)",

  overflow: "visible",
});

const tableCellCSS = css({
  width: "100%",
  height: "100%",
  position: "relative",

  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",

  border: "none",
  padding: "0px",
  backgroundColor: "white",

  cursor: "default",
  transition: "all 0.3s",
});

const tableValueCSS = css({
  position: "absolute",
  top: "5px",
  left: "5px",
});

const toolTipAreaCSS = css({
  width: "100%",
  position: "absolute",
});

const toolTipCSS = css({
  width: "100%",
  height: "50px",

  position: "absolute",
  top: "-55px",
  left: 0,

  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",

  backgroundColor: bgDark,
  color: "white",

  boxSizing: "border-box",
  padding: "7px",
  borderRadius: "5px",

  pointerEvents: "none",
  zIndex: 99,
  overflow: "hidden",
});

const taskNameCSS = css({
  fontSize: "13px",
  fontWeight: 500,
});

const taskTimeCSS = css({
  width: "100%",
  fontSize: "11px",
  fontWeight: 300,
});

export default MonthlyViewer;
