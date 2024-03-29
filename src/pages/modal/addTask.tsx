import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import duration from "dayjs/plugin/duration";

import { css } from "@emotion/react";
import { useDataStore, useModalStore, useToastStore } from "@/store";
import { makeUUID } from "@/utils";
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

  const { addFixedTask, addTask } = useDataStore();
  const closeModal = useModalStore((state) => state.closeModal);
  const addMessage = useToastStore((state) => state.addMessage);

  const addHandler = () => {
    if (isFixed) {
      // Add fixedTask
      if (taskName.trim() === "") {
        // taskName empty error
        addMessage("일정의 이름을 입력해주세요", "warning");
      } else if (!dayjs(end).isAfter(start, "minute")) {
        // start, end time error
        addMessage("시간을 다시 설정해주세요", "warning");
      } else {
        addFixedTask({
          id: makeUUID(),
          taskName,
          startTime: start,
          endTime: end,
        });
        addMessage("고정일정이 추가되었습니다.", "success");
        closeModal();
      }
    } else {
      // Add task
      if (taskName.trim() === "") {
        // taskName empty error
        addMessage("일정의 이름을 입력해주세요", "warning");
      } else if (timeTaken <= 0) {
        // timeTaken error
        addMessage("소요시간은 1분 이상이어야 합니다", "warning");
      } else {
        addTask({ id: makeUUID(), taskName, deadline: start, timeTaken });
        addMessage("일정이 추가되었습니다.", "success");
        closeModal();
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
            <p>일정 추가</p>
          </div>
          <div css={optionAreaCSS}>
            <p>고정 일정</p>
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
          추가
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

  fontSize: "13px",
  fontWeight: 500,

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
  fontWeight: 500,
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
