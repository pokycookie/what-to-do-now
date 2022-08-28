import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import IndexedDB from "../lib/indexedDB";
import { ITask, ITime, TModal } from "../lib/type";
import "../scss/components/editTaskModal.scss";
import Calendar from "./calendar";
import Clock from "./clock";
import RaitingBar from "./raitingBar";
import ToggleArea from "./toggleArea";

interface IProps {
  DB?: IDBDatabase;
  setModal: React.Dispatch<React.SetStateAction<TModal | null>>;
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

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const submitHandler = () => {
    const deadLineMoment = moment(calendar);
    if (clockOption && clock.hour && clock.minute) {
      deadLineMoment.hour(clock.hour).minute(clock.minute);
    }
    const deadLine = new Date(deadLineMoment.toISOString());

    if (content.trim() !== "" && props.DB) {
      const data: ITask = {
        content,
        importance: importanceOption ? importance : 0,
        updated: new Date(),
      };
      if (deadLineOption) data.deadLine = deadLine;
      IndexedDB.create<ITask>(props.DB, "task", data);
      props.setModal(null);
    }
  };

  const cancelHandler = () => {
    props.setModal(null);
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
          <ToggleArea title="DeadLine" onChange={(toggle) => setDeadLineOption(toggle)}>
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
