import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import db from "../db";

dayjs.extend(isBetween);

export interface ITaskOrder {
  id: number;
  taskName: string;
  startTime: Date;
  endTime: Date;
}

export async function getTaskOrder() {
  const tasks = await db.task.orderBy("deadline").toArray();
  const fixedTasks = await db.fixedTask.orderBy("startTime").toArray();
  const result: ITaskOrder[] = [];

  let task = tasks.pop();
  let fixedTask = fixedTasks.pop();
  let currentTime = task?.deadline!;

  while (true) {
    // Break point
    if (!task) break;

    let endTime: Date;
    if (dayjs(currentTime).isBefore(task.deadline)) {
      endTime = currentTime;
    } else {
      endTime = task.deadline;
    }
    const startTime = dayjs(endTime).subtract(task.timeTaken, "minute").toDate();
    const id = task.id!;
    const taskName = task.taskName;

    // Empty fixedTasks
    if (!fixedTask) {
      result.push({ id, taskName, startTime, endTime });
      task = tasks.pop();
      currentTime = startTime;
      continue;
    }

    const frontOverlap = dayjs(startTime).isBetween(
      fixedTask.startTime,
      fixedTask.endTime,
      "minute",
      "[]"
    );
    const backOverlap = dayjs(endTime).isBetween(
      fixedTask.startTime,
      fixedTask.endTime,
      "minute",
      "[]"
    );

    // Others
    if (!dayjs(startTime).isBefore(fixedTask.endTime)) {
      // not overlap
      result.push({ id, taskName, startTime, endTime });
      task = tasks.pop();
      currentTime = startTime;
    } else if (backOverlap) {
      // overlap back
      task = { id, taskName, timeTaken: task.timeTaken, deadline: fixedTask.startTime };
      fixedTask = fixedTasks.pop();
    } else if (frontOverlap) {
      // overlap front
      const timeTaken = dayjs(fixedTask.endTime).diff(startTime, "minute");
      result.push({ id, taskName, startTime: fixedTask.endTime, endTime });
      task = { id, taskName, timeTaken, deadline: fixedTask.startTime };
      currentTime = fixedTask.endTime;
    } else {
      // check other fixedTask
      fixedTask = fixedTasks.pop();
    }
  }

  return result;
}
