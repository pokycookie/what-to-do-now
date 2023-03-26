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
import { dailyArr, ICalendar } from "./core";
import "./calendar.scss";

dayjs.extend(isBetween);

const dayArr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface IProps {
  default?: { start: Date; end: Date };
  onChange?: (start: Date, end: Date) => void;
  range?: boolean;
}

export default function Calendar(props: IProps) {
  const nowStart = props.default?.start ?? new Date();
  const nowEnd = props.default?.end ?? new Date();

  const [year, setYear] = useState(nowStart.getFullYear());
  const [month, setMonth] = useState(nowStart.getMonth());
  const [calendar, setCalendar] = useState<ICalendar[]>([]);

  // Select date with drag
  const [start, setStart] = useState<Date>(nowStart);
  const [end, setEnd] = useState<Date>(nowEnd);
  const [tmpStart, setTmpStart] = useState<Date | null>(null);
  const [tmpEnd, setTmpEnd] = useState<Date | null>(null);

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
    // selected
    if (!tmpStart && dayjs(cell.date).isBetween(start, end, "day", "[]")) {
      classList.push("selected");
    }
    // today
    if (dayjs(cell.date).isSame(new Date(), "day")) {
      classList.push("today");
    }
    // tmp selected
    if (tmpStart && dayjs(cell.date).isBetween(tmpStart, tmpEnd, "day", "[]")) {
      classList.push("drag");
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

  const cellMouseDown = (cell: ICalendar) => {
    if (!props.range) return;
    setTmpStart(cell.date);
    setTmpEnd(cell.date);
  };

  const cellMouseEnter = (cell: ICalendar) => {
    if (tmpStart) setTmpEnd(cell.date);
  };

  const cellMouseUp = (cell: ICalendar) => {
    if (!props.range) {
      setStart(cell.date);
      setEnd(cell.date);
    } else if (tmpStart) {
      if (dayjs(cell.date).isBefore(tmpStart, "day")) {
        setStart(cell.date);
        setEnd(tmpStart);
        if (props.onChange) props.onChange(cell.date, tmpStart);
      } else {
        setStart(tmpStart);
        setEnd(cell.date);
        if (props.onChange) props.onChange(tmpStart, cell.date);
      }
      setTmpStart(null);
      setTmpEnd(null);
    }
  };

  useEffect(() => {
    setCalendar(dailyArr(year, month));
  }, [year, month]);

  return (
    <div className="calendar">
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
            <button
              key={i}
              className={getClassName(cell, i)}
              onMouseDown={() => cellMouseDown(cell)}
              onMouseEnter={() => cellMouseEnter(cell)}
              onMouseUp={() => cellMouseUp(cell)}
            >
              <p className="value">{cell.value}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
