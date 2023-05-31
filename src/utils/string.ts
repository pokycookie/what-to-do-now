import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export function getDoubleDigit(value: number) {
  if (value < 10) {
    return `0${value}`;
  } else {
    return `${value}`;
  }
}

export function _className(...className: string[]) {
  return className.join(" ");
}

export function getDuration(minute: number) {
  const hours = dayjs.duration(minute, "minutes").hours();
  const minutes = dayjs.duration(minute, "minutes").minutes();

  return `${hours > 0 ? `${hours}시간 ` : ""}${minutes > 0 ? `${minutes}분` : ""}`;
}
