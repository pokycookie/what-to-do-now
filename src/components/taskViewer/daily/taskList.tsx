import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState, useEffect } from "react";
import { ITaskOrder, getTaskOrder } from "@/utils";
import { useDataStore } from "@/store";
import db from "@/db";
import { css } from "@emotion/react";
import { textOverflowCSS } from "@/styles/component";
import { bgGrey } from "@/styles/color";

dayjs.extend(relativeTime);

interface IProps {}

function TaskList(props: IProps) {
  const [index, setIndex] = useState(0);
  const [task, setTask] = useState<ITaskOrder[]>([]);

  const taskOrder = useDataStore((state) => state.taskOrder);
  const setTaskOrder = useDataStore((state) => state.setTaskOrder);

  const checkHandler = async (check: boolean, task: ITaskOrder) => {
    const tmpTask = await db.task.get(task.id);
    if (check && tmpTask) {
      await db.task.delete(task.id);
      await db.pastTask.add({
        taskName: tmpTask.taskName,
        deadline: tmpTask.deadline,
        timeTaken: tmpTask.timeTaken,
        success: true,
      });
      const tmpTaskOrder = await getTaskOrder();
      setTimeout(() => {
        setTaskOrder(tmpTaskOrder);
      }, 500);
    }
  };

  const wheelHandler = (e: React.WheelEvent<HTMLUListElement>) => {
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
    setTask([...taskOrder].reverse());
    setIndex((prev) => Math.min(prev, taskOrder.length - 1));
  }, [taskOrder]);

  return (
    <ul css={taskListCSS} onWheel={wheelHandler}>
      {task.length > 0 ? (
        <li css={taskItemCSS} key={task[index].id}>
          {/* <button onClick={() => setIndex(Math.max(0, index - 1))}>
            <FontAwesomeIcon icon={faAngleUp} />
          </button> */}
          {/* <div className="taskIndex">
            [{index + 1}/{task.length}]
          </div> */}

          <p css={[taskNameCSS, textOverflowCSS]}>{task[index]?.taskName}</p>
          <p css={fromNowCSS}>{dayjs(task[index].endTime).locale("ko").fromNow()} 마감</p>

          {/* <button onClick={() => setIndex(Math.min(task.length - 1, index + 1))}>
            <FontAwesomeIcon icon={faAngleDown} />
          </button> */}
        </li>
      ) : (
        <li css={taskItemCSS}>
          <p className="taskName">할 일이 없어요!</p>
        </li>
      )}
    </ul>
  );
}

const taskListCSS = css({
  userSelect: "none",
});

const taskItemCSS = css({
  boxSizing: "border-box",
  padding: "10px",

  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "5px",

  transition: "background-color 0.3s",
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
