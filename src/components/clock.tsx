import "../scss/components/clock.scss";
import { useEffect, useState } from "react";
import { ITime } from "../lib/type";
import Slider from "./slider";

interface IProps {
  hour?: number;
  minute?: number;
  onChange?: (timeObj: ITime) => void;
  scrlk?: (scrlk: boolean) => void;
}

export default function Clock(props: IProps) {
  const [hour, setHour] = useState(props.hour || 0);
  const [minute, setMinute] = useState(props.minute || 0);

  useEffect(() => {
    const timeObj: ITime = { hour, minute };
    if (props.onChange) props.onChange(timeObj);
  }, [hour, minute]);

  // Scroll lock
  const scrlk = (bool: boolean) => {
    if (props.scrlk) props.scrlk(bool);
  };

  return (
    <div className="clock">
      <div className="indicators">
        <p>{getIndicators(hour, minute)}</p>
      </div>
      <div className="sliderArea">
        <Slider
          min={0}
          max={23}
          onChange={(value) => setHour(value)}
          default={hour}
          scrlk={(bool) => scrlk(bool)}
        />
        <Slider
          min={0}
          max={59}
          onChange={(value) => setMinute(value)}
          default={minute}
          scrlk={(bool) => scrlk(bool)}
        />
      </div>
    </div>
  );
}

const getDoubleDigit = (value: number) => {
  if (value < 10) return `0${value}`;
  return `${value}`;
};

const getIndicators = (hour: number, minute: number) => {
  const AMPM = hour < 12 ? "AM" : "PM";
  let tempHour = hour;

  if (AMPM === "PM") {
    tempHour = hour - 12;
  }

  return `${getDoubleDigit(tempHour)}:${getDoubleDigit(minute)} ${AMPM}`;
};
