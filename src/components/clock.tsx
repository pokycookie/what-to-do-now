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
  );
}
