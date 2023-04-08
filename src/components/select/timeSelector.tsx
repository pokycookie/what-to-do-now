import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";
import { _range } from "../../lib/basic";
import { getDoubleDigit } from "../../lib/string";
import "./select.scss";

interface IProps {
  hour?: number;
  minute?: number;
  onChange?: (hour: number, minute: number) => void;
}

function TimeSelector(props: IProps) {
  const [hour, setHour] = useState(props.hour ?? 0);
  const [minute, setMinute] = useState(props.minute ?? 0);
  const [isOpen, setIsOpen] = useState(false);
  const ESelector = useRef(null);

  const openHandler = () => {
    if (!isOpen) setIsOpen(true);
  };

  useEffect(() => {
    if (props.onChange) props.onChange(hour, minute);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour, minute]);

  useEffect(() => {
    const closeHandler = (e: MouseEvent) => {
      if (
        ESelector.current &&
        !(ESelector.current as HTMLElement).contains(e.target as HTMLElement)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", closeHandler);
    return () => {
      document.removeEventListener("click", closeHandler);
    };
  }, [isOpen]);

  return (
    <div className="timeSelector selector" ref={ESelector} onClick={openHandler}>
      <div className="display">
        <div className="placeholder">
          {getDoubleDigit(hour)}:{getDoubleDigit(minute)}
        </div>
        <div className="divider" />
        <div className="icon">
          <FontAwesomeIcon icon={faAngleDown} />
        </div>
      </div>
      {isOpen ? (
        <div className="menu">
          <div className="hours">
            {_range(24).map((i) => {
              return (
                <p key={i} className={i === hour ? "selected" : ""} onClick={() => setHour(i)}>
                  {getDoubleDigit(i)}
                </p>
              );
            })}
          </div>
          <div className="minutes">
            {_range(60).map((i) => {
              return (
                <p key={i} className={i === minute ? "selected" : ""} onClick={() => setMinute(i)}>
                  {getDoubleDigit(i)}
                </p>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default TimeSelector;
