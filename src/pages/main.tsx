import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { css } from "@emotion/react";
import { useDataStore, useModalStore, useViewerStore } from "@/store";
import { getTaskOrder, useInterval } from "@/utils";
import db from "@/db";
import DailyViewer from "@/components/taskViewer/daily/dailyViewer";
import MonthlyViewer from "@/components/taskViewer/monthly/monthlyViewer";
import { addBtnCSS } from "@/styles/component";

function Main() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const isDaily = useViewerStore((state) => state.isDaily);
  const openModal = useModalStore((state) => state.openModal);
  const setTaskOrder = useDataStore((state) => state.setTaskOrder);
  const setFixedTask = useDataStore((state) => state.setFixedTask);

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
    <section css={[mainCSS, { alignItems: isDaily ? "center" : "flex-start" }]}>
      {isDaily ? <DailyViewer date={currentTime} /> : <MonthlyViewer />}
      <div css={btnAreaCSS}>
        <button css={addBtnCSS} onClick={() => openModal("addTask")}>
          <FontAwesomeIcon icon={faAdd} />
        </button>
      </div>
    </section>
  );
}

const mainCSS = css({
  flex: 1,
  height: "100%",
  position: "relative",

  boxSizing: "border-box",
  padding: "20px",

  display: "flex",
  justifyContent: "center",
});

const btnAreaCSS = css({
  position: "absolute",
  right: "20px",
  bottom: "20px",
});

export default Main;
