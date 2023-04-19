import { ITaskOrder } from "../../lib/task";
import "./taskViewer.scss";
import CheckBtn from "../button/checkBtn";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import db from "../../db";
import { getTaskOrder } from "../../lib/task";
import { useDataStore } from "../../zustand";

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
    <ul className="taskList" onWheel={wheelHandler}>
      {task.length > 0 ? (
        <li className="task" key={task[index].id}>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => setIndex(Math.max(0, index - 1))}
          >
            <FontAwesomeIcon icon={faAngleUp} />
          </motion.button>
          <div className="taskIndex">
            [{index + 1}/{task.length}]
          </div>
          <div className="mainInfo">
            <CheckBtn onChange={(check) => checkHandler(check, task[index])} />
            <p className="taskName">{task[index]?.taskName}</p>
          </div>
          <div className="subInfo">
            <p className="fromNow">{dayjs(task[index].endTime).locale("ko").fromNow()} 마감</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.8 }}
            onClick={() => setIndex(Math.min(task.length - 1, index + 1))}
          >
            <FontAwesomeIcon icon={faAngleDown} />
          </motion.button>
        </li>
      ) : (
        <li className="task">
          <p className="taskName">할 일이 없어요!</p>
        </li>
      )}
    </ul>
  );
}

export default TaskList;
