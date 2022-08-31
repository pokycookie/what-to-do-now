export type TModal = "editTask" | "editFixedTask";
export type TStore = "task" | "fixedTask";
export type TRepeatType = "yearly" | "monthly" | "weekly" | "daily";

export interface ITask {
  content: string;
  importance: number;
  updated: Date;
  timeTaken: number;
  deadLine?: Date;
  urgency?: number;
  weight?: number;
}

export interface IFixedTask {
  content: string;
  startTime: Date;
  endTime: Date;
  updated: Date;
  repeatType?: TRepeatType;
  repeat?: Date;
}

export interface ITime {
  hour: number;
  minute: number;
}
