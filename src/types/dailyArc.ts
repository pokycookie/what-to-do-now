import { TTask } from "./task";

interface IDailyArc {
  id: string;
  taskName: string;
  type: TTask;
  startTime: Date;
  endTime: Date;
  startDeg: number;
  endDeg: number;
}

export type { IDailyArc };
