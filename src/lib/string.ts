export function getDoubleDigit(value: number) {
  if (value < 10) {
    return `0${value}`;
  } else {
    return `${value}`;
  }
}
