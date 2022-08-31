import moment from "moment";
import { useEffect, useRef, useState } from "react";
import IndexedDB from "../lib/indexedDB";
import { IFixedTask, ITime, TModal, TStore } from "../lib/type";
import { checkFixedTask } from "../lib/urgency";
import "../scss/components/editTaskModal.scss";
import Calendar from "./calendar";
import Clock from "./clock";
import ToggleArea from "./toggleArea";

interface IProps {
  DB?: IDBDatabase;
  setModal: React.Dispatch<React.SetStateAction<TModal | null>>;
  refresh: (store: TStore) => void;
}

export default function EditFixedTaskModal(props: IProps) {
  const current = new Date();
  const scrlkRef = useRef<HTMLDivElement>(null);

  const [SCRLK, setSCRLK] = useState(false);
  const [startTimeOption, setStartTimeOption] = useState(false);
  const [endTimeOption, setEndTimeOption] = useState(false);
  const [startCalendar, setStartCalendar] = useState(current);
  const [endCalendar, setEndCalendar] = useState(current);
  const [startClock, setStartClock] = useState<ITime>({ hour: 0, minute: 0 });
  const [endClock, setEndClock] = useState<ITime>({ hour: 23, minute: 59 });
  const [content, setContent] = useState("");

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const submitHandler = () => {
    let tempStartTime = changeDateTime(startCalendar, 0, 0, 0);
    let tempEndTime = changeDateTime(endCalendar, 23, 59, 0);

    if (startTimeOption) {
      tempStartTime = changeDateTime(tempStartTime, startClock.hour, startClock.minute, 0);
    }
    if (endTimeOption) {
      tempEndTime = changeDateTime(tempEndTime, endClock.hour, endClock.minute, 0);
    }

    if (content.trim() !== "" && props.DB) {
      const data: IFixedTask = {
        content,
        startTime: tempStartTime,
        endTime: tempEndTime,
        updated: new Date(),
      };
      IndexedDB.create<IFixedTask>(props.DB, "fixedTask", data);
      props.setModal(null);
    }
  };

  const cancelHandler = () => {
    props.setModal(null);
    if (props.DB) checkFixedTask(props.DB);
  };

  useEffect(() => {
    if (scrlkRef.current !== null) {
      if (SCRLK) {
        scrlkRef.current.style.overflowY = "hidden";
      } else {
        scrlkRef.current.style.overflowY = "auto";
      }
    }
  }, [SCRLK]);

  return (
    <div className="editTaskModal">
      <div className="top">
        <input autoFocus value={content} onChange={inputHandler} />
        <div className="optionArea" ref={scrlkRef}>
          <ToggleArea title="Start time" alwaysOpen>
            <Calendar onChange={(date) => setStartCalendar(date)} />
            <ToggleArea title="Time" onChange={(toggle) => setStartTimeOption(toggle)}>
              <Clock
                onChange={(timeObj) => setStartClock(timeObj)}
                hour={0}
                minute={0}
                scrlk={(scrlk) => setSCRLK(scrlk)}
              />
            </ToggleArea>
          </ToggleArea>
          <ToggleArea title="End time" alwaysOpen>
            <Calendar onChange={(date) => setEndCalendar(date)} />
            <ToggleArea title="Time" onChange={(toggle) => setEndTimeOption(toggle)}>
              <Clock
                onChange={(timeObj) => setEndClock(timeObj)}
                hour={23}
                minute={59}
                scrlk={(scrlk) => setSCRLK(scrlk)}
              />
            </ToggleArea>
          </ToggleArea>
        </div>
      </div>
      <div className="bottom">
        <button onClick={submitHandler}>OK</button>
        <button onClick={cancelHandler}>CANCEL</button>
      </div>
    </div>
  );
}

const changeDateTime = (date: Date, hour: number, minute: number, second: number) => {
  return new Date(moment(date).hour(hour).minute(minute).second(second).toISOString());
};
