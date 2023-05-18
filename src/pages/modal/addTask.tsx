import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import duration from "dayjs/plugin/duration";

import { css } from "@emotion/react";
import { useDataStore, useModalStore } from "@/store";
import { getTaskOrder } from "@/utils";
import db from "@/db";
import { backBtnCSS } from "@/styles/component";
import Toggle from "@/components/button/toggle";
import Calendar from "@/components/calendar/calendar";
import TimeSelector from "@/components/selector/timeSelector";
import { bgDark, bgGrey } from "@/styles/color";

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
    <div css={addTaskCSS}>
      <div css={{ width: "100%" }}>
        <div css={titleAreaCSS}>
          <div css={titleCSS}>
            <button css={backBtnCSS} onClick={closeModal}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <p>Add task</p>
          </div>
          <div css={optionAreaCSS}>
            <p>Fixed task</p>
            <Toggle onChange={(bool) => setIsFixed(bool)} />
          </div>
        </div>
        <div css={inputAreaCSS}>
          <input
            css={inputCSS}
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
        <div css={timeCSS}>
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
          <motion.div css={timeCSS} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
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
          <motion.div css={timeCSS} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
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
      <div css={btnAreaCSS}>
        <button css={submitBtnCSS} onClick={addHandler}>
          OK
        </button>
      </div>
    </div>
  );
}

const addTaskCSS = css({
  width: "100%",
  height: "100%",

  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
});

const btnAreaCSS = css({
  width: "100%",

  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",

  marginTop: "10px",
});

const submitBtnCSS = css({
  width: "150px",
  height: "38px",

  borderRadius: "4px",
  backgroundColor: bgDark,
  color: "white",

  ":hover": {
    backgroundColor: bgGrey,
  },
});

const titleAreaCSS = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
});

const titleCSS = css({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "10px",

  fontSize: "16px",
  fontWeight: 500,
});

const optionAreaCSS = css({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "10px",

  fontSize: "12px",
  fontWeight: 400,
});

const inputAreaCSS = css({
  width: "100%",
  marginBottom: "10px",
});

const inputCSS = css({
  width: "100%",
  height: "38px",

  boxSizing: "border-box",
  borderRadius: "4px",
  border: "1px solid hsl(0, 0%, 80%)",
  padding: "5px 10px",

  fontSize: "16px",
  color: "hsl(0, 0%, 50%)",

  ":hover": {
    borderColor: "hsl(0, 0%, 70%)",
  },
  ":focus": {
    outline: "none",
    borderColor: "hsl(0, 0%, 50%)",
  },
});

const timeCSS = css({
  width: "100%",
  marginTop: "10px",

  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  fontSize: "15px",
  color: "hsl(0, 0%, 50%)",
});

export default AddTask;
