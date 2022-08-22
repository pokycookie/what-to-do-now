import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import "../scss/components/slider.scss";

interface IProps {
  min: number;
  max: number;
  step?: number;
  default?: number;
  onChange?: (value: number) => void;
}

export default function Slider(props: IProps) {
  const step = props.step || 1;

  const [value, setValue] = useState(props.default || 0);
  const [prev, setPrev] = useState(value - step < props.min ? props.max : value - step);
  const [next, setNext] = useState(value + step > props.max ? props.min : value + step);

  useEffect(() => {
    if (props.onChange) props.onChange(value);
  }, [value, props]);

  const upValue = () => {
    let tempValue = value + step;
    if (tempValue > props.max) {
      tempValue = props.min + (tempValue - props.max) - 1;
    }
    setValue(tempValue);
  };

  const downValue = () => {
    let tempValue = value - step;
    if (tempValue < props.min) {
      tempValue = props.max + (tempValue - props.min) + 1;
    }
    setValue(tempValue);
  };

  const scrollHandler = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      upValue();
    } else {
      downValue();
    }
  };

  return (
    <div className="slider">
      <button onClick={upValue}>
        <FontAwesomeIcon icon={faAngleUp} />
      </button>
      <div className="indicators" onWheel={scrollHandler}>
        <p>{value}</p>
      </div>
      <button onClick={downValue}>
        <FontAwesomeIcon icon={faAngleDown} />
      </button>
    </div>
  );
}
