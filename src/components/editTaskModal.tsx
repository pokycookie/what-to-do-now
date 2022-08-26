import moment from "moment";
import React, { useState } from "react";
import IndexedDB from "../lib/indexedDB";
import { ITask, ITime, TModal } from "../lib/type";
import "../scss/components/editTaskModal.scss";
import Calendar from "./calendar";
import Clock from "./clock";
import ToggleArea from "./toggleArea";

interface IProps {
  DB?: IDBDatabase;
  setModal: React.Dispatch<React.SetStateAction<TModal | null>>;
}

export default function EditTaskModal(props: IProps) {
  const current = new Date();

  const [deadLineOption, setDeadLineOption] = useState(false);
  const [content, setContent] = useState("");
  const [calendar, setCalendar] = useState(current);
  const [clock, setClock] = useState<ITime>({
    hour: current.getHours(),
    minute: current.getMinutes(),
  });

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const submitHandler = () => {
    const deadLineMoment = moment(calendar);
    if (clock.hour && clock.minute) {
      deadLineMoment.hour(clock.hour).minute(clock.minute);
    }
    const deadLine = new Date(deadLineMoment.toISOString());

    if (content.trim() !== "" && props.DB) {
      const data: ITask = {
        content,
        importance: 0,
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

  return (
    <div className="editTaskModal">
      <div className="top">
        <input autoFocus value={content} onChange={inputHandler} />
        <ToggleArea title="DeadLine" onChange={(toggle) => setDeadLineOption(toggle)}>
          <div className="expired">
            <Calendar onChange={(date) => setCalendar(date)} />
            <Clock
              onChange={(timeObj) => setClock(timeObj)}
              hour={current.getHours()}
              minute={current.getMinutes()}
            />
          </div>
        </ToggleArea>
      </div>
      <div className="bottom">
        <button onClick={submitHandler}>OK</button>
        <button onClick={cancelHandler}>CANCEL</button>
      </div>
    </div>
  );
}
