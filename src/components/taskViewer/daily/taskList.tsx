import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState, useEffect } from "react";
import { getTaskOrder, makeUUID } from "@/utils";
import { useDataStore } from "@/store";
import { css } from "@emotion/react";
import { textOverflowCSS } from "@/styles/component";
import { bgGrey } from "@/styles/color";
import { ITaskOrder } from "@/types";

dayjs.extend(relativeTime);

interface IProps {}

function TaskList(props: IProps) {
  const [index, setIndex] = useState(0);
  const [task, setTask] = useState<ITaskOrder[]>([]);

  const { tasks, fixedTasks, taskOrders, setTaskOrder, delTask, addPastTask } =
    useDataStore();

  const checkHandler = (check: boolean, task: ITaskOrder) => {
    const selectedTask = tasks.find((e) => e.id === task.id);
    if (check && selectedTask) {
      delTask(task.id);
      addPastTask({
        id: makeUUID(),
        taskName: selectedTask.taskName,
        deadline: selectedTask.deadline,
        timeTaken: selectedTask.timeTaken,
        success: true,
      });
      const tmpTaskOrder = getTaskOrder(tasks, fixedTasks);
      setTimeout(() => {
        setTaskOrder(tmpTaskOrder);
      }, 500);
    }
  };

  const wheelHandler = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY > 0) {
      // wheel down
      const tmpIndex = Math.min(task.length - 1, index + 1);
      setIndex(tmpIndex);
    } else {
      // wheel up
      const tmpIndex = Math.max(0, index - 1);
      setIndex(tmpIndex);
    }
  };

  useEffect(() => {
    setTask([...taskOrders].reverse());
    setIndex((prev) => Math.min(prev, taskOrders.length - 1));
  }, [taskOrders]);

  return (
    <div onWheel={wheelHandler}>
      {task.length > 0 && task[index] ? (
        <span css={taskItemCSS} key={task[index]?.id}>
          {/* <button onClick={() => setIndex(Math.max(0, index - 1))}>
            <FontAwesomeIcon icon={faAngleUp} />
          </button> */}
          {/* <div className="taskIndex">
            [{index + 1}/{task.length}]
          </div> */}

          <p css={[taskNameCSS, textOverflowCSS]}>{task[index]?.taskName}</p>
          <p css={fromNowCSS}>
            {dayjs(task[index]?.endTime).locale("ko").fromNow()} 마감
          </p>

          {/* <button onClick={() => setIndex(Math.min(task.length - 1, index + 1))}>
            <FontAwesomeIcon icon={faAngleDown} />
          </button> */}
        </span>
      ) : (
        <span css={taskItemCSS}>
          <p className="taskName">할 일이 없어요!</p>
        </span>
      )}
    </div>
  );
}

const taskItemCSS = css({
  width: "350px",
  boxSizing: "border-box",
  padding: "10px",
  borderRadius: "5px",

  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",

  transition: "background-color 0.3s, box-shadow 0.3s",
  userSelect: "none",

  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",

  ":hover": {
    boxShadow:
      "0px 6px 10px 0px rgba(0, 0, 0, 0.15), 0px 0px 15px 0px rgba(0, 0, 0, 0.1), 0px 3px 5px -1px rgba(0, 0, 0, 0.25)",
  },
});

const taskNameCSS = css({
  fontSize: "24px",
  fontWeight: 600,
  textAlign: "center",
});

const fromNowCSS = css({
  width: "100%",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  fontSize: "13px",
  color: bgGrey,
});

export default TaskList;
