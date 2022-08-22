import Slider from "./slider";
import "../scss/components/clock.scss";
import { useEffect, useState } from "react";
import { ITime } from "../lib/type";

interface IProps {
  onChange?: (timeObj: ITime) => void;
}

export default function Clock(props: IProps) {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);

  useEffect(() => {
    const timeObj: ITime = { hour, minute };
    if (props.onChange) props.onChange(timeObj);
  }, [hour, minute, props]);

  return (
    <div className="clock">
      <Slider min={0} max={23} onChange={(value) => setHour(value)} />
      <Slider min={0} max={59} onChange={(value) => setMinute(value)} />
    </div>
  );
}
