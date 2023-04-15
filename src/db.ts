import Dexie, { Table } from "dexie";

export interface IDBTask {
  id?: number;
  taskName: string;
  timeTaken: number;
  deadline: Date;
}

export interface IDBFixedTask {
  id?: number;
  taskName: string;
  startTime: Date;
  endTime: Date;
}

export interface IDBPastTask extends IDBTask {
  success: boolean;
}

export class WTDN extends Dexie {
  task!: Table<IDBTask>;
  fixedTask!: Table<IDBFixedTask>;
  pastTask!: Table<IDBPastTask>;

  constructor() {
    super("WTDN");
    this.version(1).stores({
      task: "++id, taskName, timeTaken, deadline",
      fixedTask: "++id, taskName, startTime, endTime",
      pastTask: "++id, taskName, timeTaken, deadline, success",
    });
  }
}

export default new WTDN();
