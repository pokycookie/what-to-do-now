import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import duration from "dayjs/plugin/duration";

import { css } from "@emotion/react";
import { useDataStore, useModalStore, useToastStore } from "@/store";
import { backBtnCSS } from "@/styles/component";
import Calendar from "@/components/calendar/calendar";
import TimeSelector from "@/components/selector/timeSelector";
import { bgDark, bgGrey, textRed } from "@/styles/color";
import { getDuration, makeUUID } from "@/utils";

dayjs.extend(duration);

function EditTask() {
  const data = useModalStore((state) => state.payload);

  const [start, setStart] = useState<Date>(
    data?.data?.startTime ?? data?.data?.deadline ?? new Date()
  );
  const [end, setEnd] = useState<Date>(data?.data?.endTime ?? new Date());
  const [timeTaken, setTimeTaken] = useState(data?.data?.timeTaken ?? 0);
  const [taskName, setTaskName] = useState(data?.data?.taskName ?? "");

  const { editFixedTask, editTask, delTask, delFixedTask, delPastTask, addTask } = useDataStore();
  const closeModal = useModalStore((state) => state.closeModal);
  const addMessage = useToastStore((state) => state.addMessage);

  const dataExist = useMemo(() => {
    if (!data) return false;
    if (!data.type) return false;
    if (!data.data?.id) return false;
    if (!data.data?.taskName) return false;
    return true;
  }, [data]);

  const deleteHandler = () => {
    if (!dataExist) {
      addMessage("알 수 없는 오류로 일정 삭제에 실패했습니다", "danger");
      closeModal();
      return;
    }
    switch (data.type) {
      case "task":
        delTask(data.data.id);
        break;
      case "fixedTask":
        delFixedTask(data.data.id);
        break;
      case "pastTask":
        delPastTask(data.data.id);
        break;
      default:
        break;
    }
    closeModal();
    addMessage(`'${data.data.taskName}' 일정이 삭제되었습니다`, "success");
  };

  const editHandler = () => {
    if (!dataExist) {
      addMessage("알 수 없는 오류로 일정 수정에 실패했습니다", "danger");
      closeModal();
      return;
    }
    switch (data.type) {
      case "fixedTask":
        if (taskName.trim() === "") {
          // taskName empty error
          addMessage("일정의 이름을 입력해주세요", "warning");
        } else if (!dayjs(end).isAfter(start, "minute")) {
          // start, end time error
          addMessage("시간을 다시 설정해주세요", "warning");
        } else {
          editFixedTask(data.data.id, {
            taskName,
            startTime: start,
            endTime: end,
          });
          addMessage("고정일정이 수정되었습니다.", "success");
          closeModal();
        }
        break;
      case "task":
        if (taskName.trim() === "") {
          // taskName empty error
          addMessage("일정의 이름을 입력해주세요", "warning");
        } else if (timeTaken <= 0) {
          // timeTaken error
          addMessage("소요시간은 1분 이상이어야 합니다", "warning");
        } else {
          editTask(data.data.id, { taskName, deadline: start, timeTaken });
          addMessage("일정이 수정되었습니다.", "success");
          closeModal();
        }
        break;
      case "pastTask":
        if (taskName.trim() === "") {
          // taskName empty error
          addMessage("일정의 이름을 입력해주세요", "warning");
        } else if (timeTaken <= 0) {
          // timeTaken error
          addMessage("소요시간은 1분 이상이어야 합니다", "warning");
        } else if (dayjs(start).diff(new Date()) < 0) {
          addMessage(
            "일정 복구를 위해서는 마감시간이 현재시간 이후로 설정되어야 합니다",
            "warning"
          );
        } else {
          addTask({ id: makeUUID(), taskName, deadline: start, timeTaken });
          delPastTask(data.data.id);
          addMessage("일정이 복구되었습니다.", "success");
          closeModal();
        }
        break;
      default:
        break;
    }
  };

  const timeHandler = (hour: number, minute: number, type: "start" | "end") => {
    if (type === "start") {
      setStart(dayjs(start).hour(hour).minute(minute).second(0).toDate());
    } else {
      setEnd(dayjs(end).hour(hour).minute(minute).second(0).toDate());
    }
  };

  return (
    <div css={addTaskCSS}>
      <div css={{ width: "100%" }}>
        <div css={titleAreaCSS}>
          <div css={titleCSS}>
            <button css={backBtnCSS} onClick={closeModal}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <p>일정 수정</p>
          </div>
        </div>
        <div css={inputAreaCSS}>
          <input
            css={inputCSS}
            type="text"
            placeholder="일정의 이름을 수정하세요"
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
          range={data?.type === "fixedTask"}
        />
        <div css={timeCSS}>
          <p className="indicator">
            {start.toLocaleDateString()} {start.toLocaleTimeString()}{" "}
            {data?.type === "fixedTask" ? "부터" : "까지"}
          </p>
          <TimeSelector
            onChange={(hour, minute) => timeHandler(hour, minute, "start")}
            hour={start.getHours()}
            minute={start.getMinutes()}
          />
        </div>
        {data?.type === "fixedTask" ? (
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
        {data?.type !== "fixedTask" ? (
          <motion.div css={timeCSS} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <p className="indicator">소요시간 {getDuration(timeTaken)} 예상</p>
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
        <button css={[submitBtnCSS, deleteBtnCSS]} onClick={deleteHandler}>
          삭제
        </button>
        <button css={submitBtnCSS} onClick={editHandler}>
          {data?.type === "pastTask" ? "복구" : "수정"}
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
  gap: "10px",

  marginTop: "10px",
});

const submitBtnCSS = css({
  width: "120px",
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

const deleteBtnCSS = css({
  ":hover": {
    backgroundColor: textRed,
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

export default EditTask;
