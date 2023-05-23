import { TTask } from "./task";

interface IDailyArc {
  taskName: string;
  type: TTask;
  startTime: Date;
  endTime: Date;
  startDeg: number;
  endDeg: number;
}

export type { IDailyArc };
