import moment from "moment";

export function getAT(current: Date, deadline?: Date) {
  const prev = moment(current);

  if (deadline) {
    const next = moment(deadline);
    return next.diff(prev, "minutes");
  } else {
    return Infinity;
  }
}
