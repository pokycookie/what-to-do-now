import { getDoubleDigit } from "./string";

type TDayLanguage = "kor" | "eng";

interface IFormatOptions {
  date?: boolean;
  time?: boolean;
  second?: boolean;
  day?: boolean;
  dayLang?: TDayLanguage;
}

interface ITimeOptions {
  year?: number;
  month?: number;
  date?: number;
  hour?: number;
  minute?: number;
  second?: number;
}

export class Time {
  private time: Date;
  private year: number;
  private month: number;
  private date: number;
  private day: number;
  private hour: number;
  private minute: number;
  private second: number;

  constructor(time: Date = new Date()) {
    this.time = time;
    this.year = time.getFullYear();
    this.month = time.getMonth();
    this.date = time.getDate();
    this.day = time.getDay();
    this.hour = time.getHours();
    this.minute = time.getMinutes();
    this.second = time.getSeconds();
  }

  format(options?: IFormatOptions) {
    return `${
      options?.date ??
      `${this.year}-${getDoubleDigit(this.month)}-${getDoubleDigit(this.date)}`
    }${options?.day ?? `(${getDayString(this.day, options?.dayLang)})`} 
    ${
      options?.time ??
      `${getDoubleDigit(this.hour)}:${getDoubleDigit(this.minute)}${
        options?.second ?? `:${this.second}`
      }`
    }`;
  }

  toDate() {
    return this.time;
  }

  setTime(options: ITimeOptions) {
    if (options.year) this.year = options.year;
    if (options.month) this.month = options.month;
    if (options.date) this.date = options.date;
    if (options.hour) this.hour = options.hour;
    if (options.minute) this.minute = options.minute;
    if (options.second) this.second = options.second;

    this.time = new Date(
      this.year,
      this.month,
      this.date,
      this.hour,
      this.minute,
      this.second
    );

    return this;
  }

  getFirstDay() {
    return new Date(this.year, this.month, 1).getDay();
  }

  getLastDate() {
    return new Date(this.year, this.month + 1, 0).getDate();
  }
}

function getDayString(day: number, language: TDayLanguage = "kor") {
  const kor = ["일", "월", "화", "수", "목", "금", "토"];
  const eng = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  switch (language) {
    case "kor":
      return kor[day];
    case "eng":
      return eng[day];
  }
}
