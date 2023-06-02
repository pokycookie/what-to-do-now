import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { useAppDataStore, useDataStore, useToastStore } from "@/store";
import { css } from "@emotion/react";
import { bgDark, bgWhite, textBlue, textRed } from "@/styles/color";
import SvgDonut from "@/components/svg/donut";
import SvgArc from "@/components/svg/arc";
import { IDailyArc } from "@/types";
import { getDailyArc, makeUUID } from "@/utils";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleMinus, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import IndexIndicator from "./indexIndicator";
import { Marquee } from "@/components/marquee";

dayjs.extend(isBetween);
dayjs.extend(relativeTime);

function DailyViewer() {
  const [selected, setSelected] = useState<IDailyArc | null>(null);
  const [taskIndex, setTaskIndex] = useState(0);
  const [isHover, setIsHover] = useState(false);

  const { currentTime } = useAppDataStore();
  const { tasks, taskOrders, fixedTasks, delTask, addPastTask } = useDataStore();
  const addMessage = useToastStore((state) => state.addMessage);

  const dateMemo = useRef(currentTime);
  const cooltime = useRef(false);

  const dailyArc = useMemo(() => {
    const taskOrderArc = getDailyArc(taskOrders, "task");
    const fixedTaskArc = getDailyArc(fixedTasks, "fixedTask");

    return [...taskOrderArc, ...fixedTaskArc];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateMemo, taskOrders, fixedTasks]);

  const currentTimeDegree =
    (dayjs(currentTime).diff(dayjs(currentTime).startOf("day"), "minute") / 1440) * 360;

  const dailyTasks = useMemo(() => {
    return [...taskOrders]
      .reverse()
      .filter((e, i, arr) => arr.findIndex((x) => x.id === e.id) === i);
  }, [taskOrders]);

  const doneHandler = () => {
    const selectedTask = dailyTasks[taskIndex];
    const task = tasks.find((e) => e.id === selectedTask.id);
    if (task) {
      delTask(selectedTask.id);
      addPastTask({ ...task, id: makeUUID(), success: true });
      addMessage(`${selectedTask.taskName}일정을 완료처리 했습니다`, "success");
    } else {
      addMessage("알 수 없는 오류로 일정 완료에 실패했습니다", "danger");
    }
  };

  const giveupHandler = () => {
    const selectedTask = dailyTasks[taskIndex];
    const task = tasks.find((e) => e.id === selectedTask.id);
    if (task) {
      delTask(selectedTask.id);
      addPastTask({ ...task, id: makeUUID(), success: false });
      addMessage(`${selectedTask.taskName}일정을 실패처리 했습니다`, "success");
    } else {
      addMessage("알 수 없는 오류로 일정 완료에 실패했습니다", "danger");
    }
  };

  const clickHandler = (task: IDailyArc) => {
    console.log(task);
  };

  const wheelHandler = (e: React.WheelEvent<HTMLDivElement>) => {
    if (cooltime.current) return;
    if (e.deltaY > 0) {
      // wheel down
      const tmpIndex = Math.min(dailyTasks.length - 1, taskIndex + 1);
      setTaskIndex(tmpIndex);
    } else {
      // wheel up
      const tmpIndex = Math.max(0, taskIndex - 1);
      setTaskIndex(tmpIndex);
    }
    cooltime.current = true;
    setTimeout(() => (cooltime.current = false), 400);
  };

  useEffect(() => {
    if (taskIndex > taskOrders.length - 1) {
      setTaskIndex(Math.max(taskOrders.length - 1, 0));
    }
  }, [taskIndex, taskOrders]);

  useEffect(() => {
    if (!dayjs(currentTime).isSame(dateMemo.current, "day")) {
      dateMemo.current = currentTime;
    }
  }, [currentTime]);

  return (
    <div css={dailyViewerCSS} onWheel={wheelHandler}>
      <SvgDonut color="#2c3333" holeSize={85} overlay />
      <svg viewBox="0 0 200 200" css={{ position: "absolute" }}>
        <SvgArc startDeg={0} endDeg={currentTimeDegree} size={89} holeSize={87} color="#FF6000" />
        {dailyArc.map((task, i) => {
          return (
            <SvgArc
              key={i}
              startDeg={task.startDeg}
              endDeg={task.endDeg}
              color={task.type === "task" ? "#0096ff" : "#eb1d36"}
              hoverColor={task.type === "task" ? "#4CB4FF" : "#F05A6C"}
              strokeWidth={1}
              holeSize={90}
              onMouseEnter={() => setSelected(task)}
              onMouseLeave={() => setSelected(null)}
              onClick={() => clickHandler(task)}
            />
          );
        })}
      </svg>
      <div css={indexIndicatorAreaCSS}>
        <IndexIndicator index={taskIndex} length={dailyTasks.length} setIndex={setTaskIndex} />
      </div>
      <div css={indicatorCSS}>
        {dailyTasks.length > 0 ? (
          <motion.ul css={taskAreaCSS} animate={{ top: -67 * taskIndex }}>
            {dailyTasks.map((task, i) => {
              return (
                <li
                  key={i}
                  css={selectedTaskCSS}
                  onMouseEnter={() => setIsHover(true)}
                  onMouseLeave={() => setIsHover(false)}
                >
                  <Marquee emotion={taskNameCSS} animate={isHover && i === taskIndex}>
                    {task.taskName}
                  </Marquee>
                  <p css={taskTimeCSS}>{`${dayjs(task.endTime).locale("ko").fromNow()} 마감`}</p>
                </li>
              );
            })}
          </motion.ul>
        ) : (
          <p css={noTaskCSS}>할 일이 없어요!</p>
        )}
        {taskOrders.length > 0 ? (
          <>
            <button
              css={[taskBtnCSS, successBtnCSS, { left: 0 }]}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
              onClick={doneHandler}
            >
              <FontAwesomeIcon icon={faCircleCheck} />
            </button>
            <button
              css={[taskBtnCSS, failBtnCSS, { right: 0 }]}
              onMouseEnter={() => setIsHover(true)}
              onMouseLeave={() => setIsHover(false)}
              onClick={giveupHandler}
            >
              <FontAwesomeIcon icon={faCircleMinus} />
            </button>
          </>
        ) : null}
      </div>
      {selected ? (
        <div css={selectedTaskAreaCSS}>
          <Marquee
            emotion={[taskNameCSS, { color: selected.type === "task" ? textBlue : textRed }]}
            animate
          >
            {selected.taskName}
          </Marquee>
          <p css={taskTimeCSS}>{`${dayjs(selected.endTime).locale("ko").fromNow()} 마감`}</p>
        </div>
      ) : null}
    </div>
  );
}

const dailyViewerCSS = css({
  width: "500px",
  height: "500px",
  position: "relative",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const indicatorCSS = css({
  width: "350px",
  height: "67px",
  position: "absolute",

  borderRadius: "5px",

  overflow: "hidden",
  userSelect: "none",
  transition: "background-color 0.3s",
  boxShadow:
    "0px 6px 10px 0px rgba(0, 0, 0, 0.15), 0px 0px 15px 0px rgba(0, 0, 0, 0.1), 0px 3px 5px -1px rgba(0, 0, 0, 0.25)",
});

const selectedTaskCSS = css({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",

  height: "47px",
  padding: "10px",
  position: "relative",
});

const taskNameCSS = css({
  fontSize: "24px",
  fontWeight: 600,
});

const taskTimeCSS = css({
  fontSize: "13px",
  fontWeight: 400,
  color: bgDark,
});

const taskAreaCSS = css({
  width: "100%",
  position: "absolute",
  left: 0,
});

const taskBtnCSS = css({
  position: "absolute",
  width: "35%",
  height: "67px",

  opacity: 0,
  transition: "opacity 0.4s",
  top: 0,

  color: "white",
  fontSize: "26px",

  display: "flex",
  alignItems: "center",
  padding: "0px 20px",
  boxSizing: "border-box",

  ":hover": {
    opacity: 1,
  },
});

const successBtnCSS = css({
  justifyContent: "flex-start",
  background: `linear-gradient(to right, ${bgWhite}, rgba(0, 0, 0, 0))`,
  color: textBlue,
});

const failBtnCSS = css({
  justifyContent: "flex-end",
  background: `linear-gradient(to left, ${bgWhite}, rgba(0, 0, 0, 0))`,
  color: textRed,
});

const indexIndicatorAreaCSS = css({
  position: "absolute",
  width: "100%",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const noTaskCSS = css({
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  fontSize: "18px",
  fontWeight: 500,
});

const selectedTaskAreaCSS = css({
  width: "350px",
  height: "67px",
  position: "absolute",

  padding: "10px",
  borderRadius: "5px",

  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",

  backgroundColor: "white",
  boxSizing: "border-box",
});

export default DailyViewer;
