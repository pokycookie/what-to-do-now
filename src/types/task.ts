type TTask = "task" | "fixedTask";

interface ITask {
  [key: string]: any;
  id: string;
  taskName: string;
  timeTaken: number;
  deadline: Date;
}

interface IFixedTask {
  [key: string]: any;
  id: string;
  taskName: string;
  startTime: Date;
  endTime: Date;
}

interface ITaskOrder {
  id: string;
  taskName: string;
  startTime: Date;
  endTime: Date;
}

interface IPastTask extends ITask {
  success: boolean;
}

export type { ITask, IFixedTask, ITaskOrder, IPastTask, TTask };
