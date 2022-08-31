import moment from "moment";
import IndexedDB from "./indexedDB";
import { IFixedTask } from "./type";

export function getAT(current: Date, deadline?: Date) {
  const prev = moment(current);

  if (deadline) {
    const next = moment(deadline);
    return next.diff(prev, "minutes");
  } else {
    return Infinity;
  }
}

export async function checkFixedTask(DB: IDBDatabase) {
  const fixedTaskArr = await IndexedDB.readAll<IFixedTask>(DB, "fixedTask");
  console.log(fixedTaskArr);
}
