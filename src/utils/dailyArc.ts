import { IDailyArc, TTask } from "@/types";
import dayjs from "dayjs";

interface IDailyArcTarget {
  taskName: string;
  startTime: Date;
  endTime: Date;
}

export function getDailyArc(target: IDailyArcTarget[], type: TTask) {
  const currentTime = new Date();

  return target
    .filter((task) =>
      dayjs(currentTime).isBetween(task.startTime, task.endTime, "day", "[]")
    )
    .map<IDailyArc>((task) => {
      const taskName = task.taskName;
      const startOfDate = dayjs(currentTime).startOf("day").toDate();
      const endOfDate = dayjs(currentTime).endOf("day").toDate();
      const startTime = dayjs(task.startTime).isBefore(startOfDate)
        ? startOfDate
        : task.startTime;
      const endTime = dayjs(task.endTime).isAfter(endOfDate)
        ? endOfDate
        : task.endTime;
      const startDeg =
        (dayjs(startTime).diff(startOfDate, "minute") / 1440) * 360;
      const endDeg = (dayjs(endTime).diff(endOfDate, "minute") / 1440) * 360;

      return { taskName, type, startTime, endTime, startDeg, endDeg };
    });
}
