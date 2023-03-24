import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getDoubleDigit } from "../../lib/string";
import { dailyArr, ICalendar } from "./core";
import "./calendar.scss";

const dayArr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface IProps {
  default?: Date;
  onChange?: (date: Date) => void;
}

export default function Calendar(props: IProps) {
  const now = props.default ?? new Date();

  const [date, setDate] = useState(now);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [calendar, setCalendar] = useState<ICalendar[]>([]);

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
    if (dayjs(cell.date).isSame(date, "day")) {
      classList.push("selected");
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

  const cellHandler = (cell: ICalendar) => {
    setDate(cell.date);
    if (props.onChange) props.onChange(cell.date);
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
              onClick={() => cellHandler(cell)}
            >
              <p className="value">{cell.value}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
