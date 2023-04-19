import AddBtn from "../components/button/addBtn";
import Modal from "../modal";
import "../scss/pages/mainPage.scss";
import AddTask from "./addTask";
import { useEffect, useState } from "react";
import db from "../db";
import { getTaskOrder } from "../lib/task";
import MonthlyViewer from "../components/taskViewer/monthlyViewer";
import DailyViewer from "../components/taskViewer/dailyViewer";
import { useInterval } from "../lib/hooks";
import dayjs from "dayjs";
import { useDataStore, useModalStore, useViewerStore } from "../zustand";

function MainPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const isDaily = useViewerStore((state) => state.isDaily);
  const openModal = useModalStore((state) => state.openModal);
  const setTaskOrder = useDataStore((state) => state.setTaskOrder);
  const setFixedTask = useDataStore((state) => state.setFixedTask);

  const addModalHandler = () => {
    openModal("addTask");
  };

  useEffect(() => {
    const init = async () => {
      const tmpTaskOrder = await getTaskOrder();
      const tmpFixedTask = await db.fixedTask.toArray();

      setTaskOrder(tmpTaskOrder);
      setFixedTask(tmpFixedTask);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInterval(async () => {
    const now = new Date();
    const tasks = await db.task.orderBy("deadline").toArray();

    for (let i = 0; i < tasks.length; i++) {
      if (dayjs(tasks[i].deadline).isBefore(now, "minute")) {
        await db.task.delete(tasks[i].id!);
        await db.pastTask.add({
          taskName: tasks[i].taskName,
          timeTaken: tasks[i].timeTaken,
          deadline: tasks[i].deadline,
          success: false,
        });
      } else {
        break;
      }
    }
    // getTaskOrder가 1분마다 반복되는 부분 개선 필요
    setTaskOrder(await getTaskOrder());
    setCurrentTime(now);
    console.log(now);
  }, 60000);

  return (
    <div className="mainPage">
      {isDaily ? <DailyViewer date={currentTime} /> : <MonthlyViewer />}
      <div className="btnArea">
        <AddBtn onClick={addModalHandler} />
      </div>
      <Modal modalID="addTask" width="70%" minWidth="370px" maxWidth="700px" height="600px">
        <AddTask />
      </Modal>
    </div>
  );
}

export default MainPage;
