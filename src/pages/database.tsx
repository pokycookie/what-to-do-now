import { bgDark, bgWhite, textOrange } from "@/styles/color";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useState } from "react";
import { motion } from "framer-motion";
import { useDataStore, useModalStore } from "@/store";
import dayjs from "dayjs";
import { textOverflowCSS } from "@/styles/component";
import { IFixedTask, IPastTask, ITask } from "@/types";
import duration from "dayjs/plugin/duration";
import { getDuration } from "@/utils";

dayjs.extend(duration);

function Database() {
  const [taskType, setTaskType] = useState(0);

  return (
    <>
      <section css={sectionCSS}>
        <TaskTypeSelector>
          <TaskTypeLi onClick={() => setTaskType(0)}>일정</TaskTypeLi>
          <TaskTypeLi onClick={() => setTaskType(1)}>고정 일정</TaskTypeLi>
          <TaskTypeLi onClick={() => setTaskType(2)}>지난 일정</TaskTypeLi>
          <motion.div animate={{ x: taskType * 105 }} css={selectorCSS}></motion.div>
        </TaskTypeSelector>
        <div css={tableFieldCSS}>
          <p>일정</p>
          <p>{taskType === 1 ? "시작시간" : "종료시간"}</p>
          <p>{taskType === 1 ? "종료시간" : "소요시간"}</p>
        </div>
        <ul css={tableCSS}>
          <Table taskType={taskType} />
        </ul>
      </section>
    </>
  );
}

function Table({ taskType }: { taskType: number }) {
  const { tasks, fixedTasks, pastTasks } = useDataStore();
  const openModal = useModalStore((state) => state.openModal);

  const taskEditHandler = (task: ITask) => {
    openModal("editTask", { type: "task", data: task });
  };

  const fixedTaskEditHandler = (fixedTask: IFixedTask) => {
    openModal("editTask", { type: "fixedTask", data: fixedTask });
  };

  const pastTaskEditHandler = (pastTask: IPastTask) => {
    openModal("editTask", { type: "pastTask", data: pastTask });
  };

  switch (taskType) {
    case 0:
      return (
        <>
          {tasks.map((e) => {
            return (
              <li css={tableListCSS} key={e.id} onClick={() => taskEditHandler(e)}>
                <p css={textOverflowCSS}>{e.taskName}</p>
                <p>{dayjs(e.deadline).format("YYYY-MM-DD HH:mm:ss")}</p>
                <p>{getDuration(e.timeTaken)}</p>
              </li>
            );
          })}
        </>
      );
    case 1:
      return (
        <>
          {fixedTasks.map((e) => {
            return (
              <li css={tableListCSS} key={e.id} onClick={() => fixedTaskEditHandler(e)}>
                <p css={textOverflowCSS}>{e.taskName}</p>
                <p>{dayjs(e.startTime).format("YYYY-MM-DD HH:mm:ss")}</p>
                <p>{dayjs(e.endTime).format("YYYY-MM-DD HH:mm:ss")}</p>
              </li>
            );
          })}
        </>
      );
    case 2:
      return (
        <>
          {pastTasks.map((e) => {
            return (
              <li css={tableListCSS} key={e.id} onClick={() => pastTaskEditHandler(e)}>
                <p css={textOverflowCSS}>{e.taskName}</p>
                <p>{dayjs(e.deadline).format("YYYY-MM-DD HH:mm:ss")}</p>
                <p>{getDuration(e.timeTaken)}</p>
              </li>
            );
          })}
        </>
      );
    default:
      return <></>;
  }
}

const sectionCSS = css({
  flex: 1,
  height: "100%",

  boxSizing: "border-box",
  padding: "20px",

  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
});

const TaskTypeSelector = styled.ul(() => ({
  width: "auto",
  height: "22px",
  position: "relative",

  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "5px",

  borderRadius: "60px",
  padding: "5px",
  backgroundColor: bgDark,
  color: "white",

  overflow: "hidden",
  userSelect: "none",
}));

const TaskTypeLi = styled.li(() => ({
  width: "100px",
  height: "100%",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  fontSize: "14px",
  fontWeight: 500,

  cursor: "pointer",
  zIndex: 1,
}));

const selectorCSS = css({
  width: "110px",
  height: "100%",

  position: "absolute",
  left: 0,
  top: 0,

  backgroundColor: textOrange,
  borderRadius: "100px",
});

const tableFieldCSS = css({
  width: "100%",
  height: "42px",

  display: "grid",
  gridTemplateColumns: "1fr 200px 200px",
  justifyItems: "start",
  alignItems: "center",

  fontSize: "16px",
  fontWeight: 500,

  boxSizing: "border-box",
  marginTop: "15px",
  borderTop: `1px solid ${bgDark}`,
  borderBottom: `1px solid ${bgDark}`,
  padding: "0px 10px",
});

const tableCSS = css({
  flex: 1,
  width: "100%",

  overflowX: "hidden",
  overflowY: "auto",
});

const tableListCSS = css({
  width: "100%",
  height: "42px",

  display: "grid",
  gridTemplateColumns: "1fr 200px 200px",
  justifyItems: "start",
  alignItems: "center",

  boxSizing: "border-box",
  padding: "0px 10px",

  cursor: "pointer",

  ":hover": {
    backgroundColor: bgWhite,
  },
});

export default Database;
