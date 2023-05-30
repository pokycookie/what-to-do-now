import { bgDark, textOrange } from "@/styles/color";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useState } from "react";
import { motion } from "framer-motion";
import { useDataStore } from "@/store";
import dayjs from "dayjs";
import { textOverflowCSS } from "@/styles/component";

function Database() {
  const [taskType, setTaskType] = useState(0);

  return (
    <section css={sectionCSS}>
      <TaskTypeSelector>
        <TaskTypeLi onClick={() => setTaskType(0)}>Tasks</TaskTypeLi>
        <TaskTypeLi onClick={() => setTaskType(1)}>Fixed tasks</TaskTypeLi>
        <TaskTypeLi onClick={() => setTaskType(2)}>Past tasks</TaskTypeLi>
        <motion.div animate={{ x: taskType * 105 }} css={selectorCSS}></motion.div>
      </TaskTypeSelector>
      <div css={tableFieldCSS}>
        <p>Taskname</p>
        <p>{taskType === 1 ? "startTime" : "deadline"}</p>
        <p>{taskType === 1 ? "endTime" : "timeTaken"}</p>
      </div>
      <ul css={tableCSS}>
        <Table taskType={taskType} />
      </ul>
    </section>
  );
}

function Table({ taskType }: { taskType: number }) {
  const { tasks, fixedTasks, pastTasks } = useDataStore();

  switch (taskType) {
    case 0:
      return (
        <>
          {tasks.map((e) => {
            return (
              <li css={tableListCSS}>
                <p css={textOverflowCSS}>{e.taskName}</p>
                <p>{dayjs(e.deadline).format("YYYY-MM-DD HH:mm:ss")}</p>
                <p>{e.timeTaken}</p>
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
              <li css={tableListCSS} key={e.id}>
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
              <li css={tableListCSS} key={e.id}>
                <p css={textOverflowCSS}>{e.taskName}</p>
                <p>{dayjs(e.deadline).format("YYYY-MM-DD HH:mm:ss")}</p>
                <p>{e.timeTaken}</p>
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
  height: "34px",

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
});

export default Database;
