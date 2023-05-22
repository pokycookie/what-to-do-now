import { IFixedTask, IPastTask, ITask } from "./task";

interface IFile {
  meta?: any;
  data: {
    tasks: ITask[];
    fixedTasks: IFixedTask[];
    pastTasks: IPastTask[];
  };
}

export type { IFile };
