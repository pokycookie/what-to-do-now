import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import "../scss/components/calendar.scss";

type TStatus = "prev" | "current" | "next";

interface ICalendar {
  value: number;
  ISO: string;
  status: TStatus;
}

interface IProps {
  onChange?: (date: Date) => void;
}

const dayArr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function Calendar(props: IProps) {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [tableArr, setTableArr] = useState<ICalendar[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();

    const tempArr: ICalendar[] = [];
    for (let i = 0; i < 42; i++) {
      if (i < firstDay) {
        // prev month
        const value = prevLastDate - firstDay + 1 + i;
        const ISO = new Date(year, month - 1, value).toISOString();
        const status: TStatus = "prev";
        tempArr.push({ value, ISO, status });
      } else {
        if (i + 1 - firstDay <= lastDate) {
          // current month
          const value = i + 1 - firstDay;
          const ISO = new Date(year, month, value).toISOString();
          const status: TStatus = "current";
          tempArr.push({ value, ISO, status });
        } else {
          // next month
          const value = i - lastDate - firstDay + 1;
          const ISO = new Date(year, month + 1, value).toISOString();
          const status: TStatus = "next";
          tempArr.push({ value, ISO, status });
        }
      }
    }
    setTableArr(tempArr);
  }, [year, month]);

  const tableHandler = (data: ICalendar) => {
    const ISODate = new Date(data.ISO);
    setSelectedDate(ISODate);
    if (props.onChange) props.onChange(ISODate);
  };

  return (
    <div className="calendar">
      <div className="navigation">
        <button onClick={() => setYear((prev) => prev - 1)}>
          <FontAwesomeIcon icon={faAnglesLeft} />
        </button>
        <button onClick={() => setMonth((prev) => prev - 1)}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <button>
          {year}-{month + 1}
        </button>
        <button onClick={() => setMonth((prev) => prev + 1)}>
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
        <button onClick={() => setYear((prev) => prev + 1)}>
          <FontAwesomeIcon icon={faAnglesRight} />
        </button>
      </div>
      <div className="day">
        {dayArr.map((element, index) => {
          return <p key={index}>{element}</p>;
        })}
      </div>
      <div className="tableArea">
        {tableArr.map((element, index) => {
          return (
            <button
              key={index}
              className={`${element.status}${getWeekday(index)}${getSelected(
                element,
                selectedDate
              )}${getToday(element)}`}
              onClick={() => tableHandler(element)}
            >
              <p className="value">{element.value}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getWeekday(index: number) {
  const result = (index + 1) % 7;
  if (result === 1) {
    return " sunday";
  } else if (result === 0) {
    return " saturday";
  } else {
    return "";
  }
}

function getSelected(element: ICalendar, selectedDate: Date | null) {
  const ISODate = new Date(element.ISO);
  if (selectedDate === null) return "";
  if (
    ISODate.getFullYear() === selectedDate.getFullYear() &&
    ISODate.getMonth() === selectedDate.getMonth() &&
    ISODate.getDate() === selectedDate.getDate()
  ) {
    return " selected";
  } else {
    return "";
  }
}

function getToday(element: ICalendar) {
  const ISODate = new Date(element.ISO);
  const today = new Date();

  if (
    ISODate.getFullYear() === today.getFullYear() &&
    ISODate.getMonth() === today.getMonth() &&
    ISODate.getDate() === today.getDate()
  ) {
    return " today";
  } else {
    return "";
  }
}
