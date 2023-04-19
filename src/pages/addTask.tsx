import BackBtn from "../components/button/backBtn";
import Calendar from "../components/calendar/calendar";
import "../scss/pages/addTask.scss";
import { useState, useEffect } from "react";
import TimeSelector from "../components/select/timeSelector";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Toggle from "../components/button/toggle";
import { motion } from "framer-motion";
import db from "../db";
import { getTaskOrder } from "../lib/task";
import { useDataStore, useModalStore } from "../zustand";

dayjs.extend(duration);

function AddTask() {
  const [start, setStart] = useState<Date>(new Date());
  const [end, setEnd] = useState<Date>(new Date());
  const [timeTaken, setTimeTaken] = useState(0);
  const [isFixed, setIsFixed] = useState(false);
  const [taskName, setTaskName] = useState("");

  const setTaskOrder = useDataStore((state) => state.setTaskOrder);
  const setFixedTask = useDataStore((state) => state.setFixedTask);
  const closeModal = useModalStore((state) => state.closeModal);

  const addHandler = async () => {
    if (isFixed) {
      // Add fixedTask
      if (taskName.trim() === "") {
        // taskName empty error
      } else if (!dayjs(end).isAfter(start, "minute")) {
        // start, end time error
      } else {
        await db.fixedTask.add({ taskName, startTime: start, endTime: end });
        closeModal();
        setTaskOrder(await getTaskOrder());
        setFixedTask(await db.fixedTask.toArray());
      }
    } else {
      // Add task
      if (taskName.trim() === "") {
        // taskName empty error
      } else if (timeTaken <= 0) {
        // timeTaken error
      } else {
        await db.task.add({ taskName, deadline: start, timeTaken });
        closeModal();
        setTaskOrder(await getTaskOrder());
      }
    }
  };

  const timeHandler = (hour: number, minute: number, type: "start" | "end") => {
    if (type === "start") {
      setStart(dayjs(start).hour(hour).minute(minute).second(0).toDate());
    } else {
      setEnd(dayjs(end).hour(hour).minute(minute).second(0).toDate());
    }
  };

  useEffect(() => {
    setEnd(start);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFixed]);

  return (
    <div className="addTask">
      <div className="top">
        <div className="title">
          <div className="text">
            <BackBtn onClick={closeModal} />
            <p>Add task</p>
          </div>
          <div className="option">
            <p>Fixed task</p>
            <Toggle onChange={(bool) => setIsFixed(bool)} />
          </div>
        </div>
        <div className="name">
          <input
            type="text"
            placeholder="💡 추가할 일정을 알려주세요"
            autoFocus
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
        </div>
        <Calendar
          default={{ start, end }}
          onChange={(start, end) => {
            setStart((prev) =>
              dayjs(prev)
                .year(start.getFullYear())
                .month(start.getMonth())
                .date(start.getDate())
                .toDate()
            );
            setEnd((prev) =>
              dayjs(prev)
                .year(end.getFullYear())
                .month(start.getMonth())
                .date(end.getDate())
                .toDate()
            );
          }}
          range={isFixed}
        />
        <div className="start">
          <p className="indicator">
            {start.toLocaleDateString()} {start.toLocaleTimeString()} {isFixed ? "부터" : "까지"}
          </p>
          <TimeSelector
            onChange={(hour, minute) => timeHandler(hour, minute, "start")}
            hour={start.getHours()}
            minute={start.getMinutes()}
          />
        </div>
        {isFixed ? (
          <motion.div
            className="end"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <p className="indicator">
              {end.toLocaleDateString()} {end.toLocaleTimeString()} 까지
            </p>
            <TimeSelector
              onChange={(hour, minute) => timeHandler(hour, minute, "end")}
              hour={end.getHours()}
              minute={end.getMinutes()}
            />
          </motion.div>
        ) : null}
        {!isFixed ? (
          <motion.div
            className="duration"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <p className="indicator">
              소요시간 {dayjs.duration(timeTaken, "minutes").hours()}시간{" "}
              {dayjs.duration(timeTaken, "minutes").minutes()}분 예상
            </p>
            <TimeSelector
              hour={dayjs.duration(timeTaken, "minutes").hours()}
              minute={dayjs.duration(timeTaken, "minutes").minutes()}
              onChange={(h, m) => {
                setTimeTaken(dayjs.duration(h, "hours").add(m, "minutes").asMinutes());
              }}
            />
          </motion.div>
        ) : null}
      </div>
      <div className="bottom">
        <button onClick={addHandler}>OK</button>
      </div>
    </div>
  );
}

export default AddTask;
