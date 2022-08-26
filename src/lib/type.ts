export type TModal = "editTask";

export interface ITask {
  content: string;
  importance: number;
  updated: Date;
  deadLine?: Date;
  timeTaken?: number;
  urgency?: number;
  weight?: number;
}

export interface IFixedTask {
  content: string;
  startTime: Date;
  endTime: Date;
  updated: Date;
}

export interface ITime {
  hour?: number;
  minute?: number;
  second?: number;
}
