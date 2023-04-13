import AddBtn from "../components/button/addBtn";
import Modal from "../modal";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import "../scss/pages/mainPage.scss";
import AddTask from "./addTask";
import {
  IReduxStore,
  RSetFixedTask,
  RSetModal,
  RSetTaskOrder,
  TModal,
  TViewerType,
} from "../redux";
import { useEffect, useState } from "react";
import db from "../db";
import { getTaskOrder } from "../lib/task";
import MonthlyViewer from "../components/taskViewer/monthlyViewer";
import DailyViewer from "../components/taskViewer/dailyViewer";
import { useInterval } from "../lib/hooks";
import dayjs from "dayjs";

function MainPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const modal = useSelector<IReduxStore, TModal | null>((state) => {
    return state.modal;
  }, shallowEqual);

  const viewerType = useSelector<IReduxStore, TViewerType>((state) => {
    return state.viewerType;
  }, shallowEqual);

  const dispatch = useDispatch();

  const addModalHandler = () => {
    dispatch(RSetModal("add"));
  };

  useEffect(() => {
    const init = async () => {
      const tmpTaskOrder = await getTaskOrder();
      const tmpFixedTask = await db.fixedTask.toArray();

      dispatch(RSetTaskOrder(tmpTaskOrder));
      dispatch(RSetFixedTask(tmpFixedTask));
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
    dispatch(RSetTaskOrder(await getTaskOrder()));
    setCurrentTime(now);
    console.log(now);
  }, 60000);

  return (
    <div className="mainPage">
      {viewerType === "daily" ? <DailyViewer date={currentTime} /> : <MonthlyViewer />}
      <div className="btnArea">
        <AddBtn onClick={addModalHandler} />
      </div>
      <Modal open={modal !== null} width="70%" minWidth="370px" maxWidth="700px" height="600px">
        <AddTask />
      </Modal>
    </div>
  );
}

export default MainPage;
