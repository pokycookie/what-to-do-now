import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { IFixedTask, ITask, ITaskOrder } from "@/types";

dayjs.extend(isBetween);

export function getTaskOrder(taskArr: ITask[], fixedTaskArr: IFixedTask[]) {
  const result: ITaskOrder[] = [];

  const tasks = [...taskArr];
  const fixedTasks = [...fixedTaskArr];

  if (tasks.length < 1) return result;

  tasks.sort((a, b) => dayjs(a.deadline).diff(b.deadline));
  fixedTasks.sort((a, b) => dayjs(a.startTime).diff(b.startTime));

  let task = tasks.pop();
  let fixedTask = fixedTasks.pop();
  let HEAD = task?.deadline!;

  while (true) {
    // Break point
    if (!task) break;

    let endTime: Date;
    if (dayjs(HEAD).isBefore(task.deadline)) {
      endTime = HEAD;
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
      HEAD = startTime;
      continue;
    }

    // Overlap flag
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
    const allOverlap =
      dayjs(startTime).isBefore(fixedTask.startTime) && dayjs(endTime).isAfter(fixedTask.endTime);

    // Others
    if (!dayjs(startTime).isBefore(fixedTask.endTime)) {
      // not overlap
      result.push({ id, taskName, startTime, endTime });
      task = tasks.pop();
      HEAD = startTime;
    } else if (backOverlap) {
      // overlap back
      task = {
        id,
        taskName,
        timeTaken: task.timeTaken,
        deadline: fixedTask.startTime,
      };
      fixedTask = fixedTasks.pop();
    } else if (frontOverlap) {
      // overlap front
      const timeTaken = dayjs(fixedTask.endTime).diff(startTime, "minute");
      result.push({ id, taskName, startTime: fixedTask.endTime, endTime });
      task = { id, taskName, timeTaken, deadline: fixedTask.startTime };
      HEAD = fixedTask.endTime;
    } else if (allOverlap) {
      // overlap all
      const timeTaken = dayjs(fixedTask.endTime).diff(startTime, "minute");
      result.push({ id, taskName, startTime: fixedTask.endTime, endTime });
      task = { id, taskName, timeTaken, deadline: fixedTask.startTime };
      HEAD = fixedTask.endTime;
    } else {
      // check other fixedTask
      fixedTask = fixedTasks.pop();
    }
  }

  return result;
}
