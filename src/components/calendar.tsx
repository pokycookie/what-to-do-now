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

const dayArr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function Calendar() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [tableArr, setTableArr] = useState<ICalendar[]>([]);

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
    const date = new Date(data.ISO);
    console.log(
      `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    );
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
              className={`${element.status} ${getWeekday(index)}`}
              onClick={() => tableHandler(element)}
            >
              {element.value}
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
    return "sunday";
  } else if (result === 0) {
    return "saturday";
  } else {
    return "";
  }
}
