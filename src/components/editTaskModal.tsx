import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import IndexedDB from "../lib/indexedDB";
import { ITask, ITime, TModal, TStore } from "../lib/type";
import { getAT } from "../lib/urgency";
import "../scss/components/editTaskModal.scss";
import Calendar from "./calendar";
import Clock from "./clock";
import RaitingBar from "./raitingBar";
import ToggleArea from "./toggleArea";

interface IProps {
  DB?: IDBDatabase;
  setModal: React.Dispatch<React.SetStateAction<TModal | null>>;
  refresh: (store: TStore) => void;
}

export default function EditTaskModal(props: IProps) {
  const current = new Date();

  const scrlkRef = useRef<HTMLDivElement>(null);

  const [SCRLK, setSCRLK] = useState(false); // scroll lock
  const [deadLineOption, setDeadLineOption] = useState(false);
  const [clockOption, setClockOption] = useState(false);
  const [importanceOption, setImportanceOption] = useState(false);
  const [content, setContent] = useState("");
  const [calendar, setCalendar] = useState(current);
  const [clock, setClock] = useState<ITime>({
    hour: current.getHours(),
    minute: current.getMinutes(),
  });
  const [importance, setImportance] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const submitHandler = () => {
    const deadLineMoment = moment(calendar);
    if (clockOption) {
      deadLineMoment.hour(clock.hour).minute(clock.minute);
    } else {
      deadLineMoment.hour(23).minute(59);
    }
    const deadLine = new Date(deadLineMoment.toISOString());

    if (content.trim() !== "" && props.DB) {
      const data: ITask = {
        content,
        timeTaken,
        importance: importanceOption ? importance : 0,
        updated: new Date(),
      };
      // deadline
      if (deadLineOption) data.deadLine = deadLine;
      // urgency
      data.urgency = timeTaken / getAT(new Date(), deadLine);

      IndexedDB.create<ITask>(props.DB, "task", data);
      props.setModal(null);
    }
  };

  const cancelHandler = () => {
    props.setModal(null);
  };

  const timeTakenHandler = (timeObj: ITime) => {
    const hourToMinute = timeObj.hour * 60;
    const tempValue = hourToMinute + timeObj.minute;
    setTimeTaken(tempValue);
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
          <ToggleArea title="Time taken" alwaysOpen>
            <Clock
              onChange={(timeObj) => timeTakenHandler(timeObj)}
              scrlk={(scrlk) => setSCRLK(scrlk)}
              hourMax={48}
              noneAMPM
            />
          </ToggleArea>
          <ToggleArea title="Deadline" onChange={(toggle) => setDeadLineOption(toggle)}>
            <Calendar onChange={(date) => setCalendar(date)} />
            <ToggleArea title="Time" onChange={(toggle) => setClockOption(toggle)}>
              <Clock
                onChange={(timeObj) => setClock(timeObj)}
                hour={current.getHours()}
                minute={current.getMinutes()}
                scrlk={(scrlk) => setSCRLK(scrlk)}
              />
            </ToggleArea>
          </ToggleArea>
          <ToggleArea title="Importance" onChange={(toggle) => setImportanceOption(toggle)}>
            <RaitingBar onChange={(rate) => setImportance(rate)} />
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
