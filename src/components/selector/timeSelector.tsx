import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";
import { css } from "@emotion/react";
import { _range, getDoubleDigit } from "@/utils";

interface IProps {
  hour?: number;
  minute?: number;
  onChange?: (hour: number, minute: number) => void;
}

function TimeSelector(props: IProps) {
  const [hour, setHour] = useState(props.hour ?? 0);
  const [minute, setMinute] = useState(props.minute ?? 0);
  const [isOpen, setIsOpen] = useState(false);

  const selectorREF = useRef(null);
  const displayREF = useRef(null);

  const openHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!isOpen) {
      setIsOpen(true);
    } else if (
      displayREF.current &&
      (displayREF.current as HTMLElement).contains(e.target as HTMLElement)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (props.onChange) props.onChange(hour, minute);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hour, minute]);

  useEffect(() => {
    const closeHandler = (e: MouseEvent) => {
      if (
        selectorREF.current &&
        !(selectorREF.current as HTMLElement).contains(e.target as HTMLElement)
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
    <div css={timeSelectorCSS} ref={selectorREF} onClick={openHandler}>
      <div css={displayCSS} ref={displayREF}>
        <p css={placeholderCSS}>
          {getDoubleDigit(hour)}:{getDoubleDigit(minute)}
        </p>
        <div css={dividerCSS} />
        <div css={iconCSS}>
          <FontAwesomeIcon icon={faAngleDown} />
        </div>
      </div>
      {isOpen ? (
        <div css={meunCSS}>
          <div css={menuColumnCSS}>
            {_range(24).map((i) => {
              return (
                <TimeSelectorList
                  key={i}
                  value={i}
                  selected={i === hour}
                  onClick={(value) => setHour(value)}
                />
              );
            })}
          </div>
          <div css={menuColumnCSS}>
            {_range(60).map((i) => {
              return (
                <TimeSelectorList
                  key={i}
                  value={i}
                  selected={i === minute}
                  onClick={(value) => setMinute(value)}
                />
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface ITimeSelectroList {
  value: number;
  selected: boolean;
  onClick?: (value: number) => void;
}

function TimeSelectorList(props: ITimeSelectroList) {
  const clickHandler = () => {
    if (props.onClick) props.onClick(props.value);
  };

  return (
    <p
      css={[menuItemCSS, props.selected ? { backgroundColor: "hsl(0, 0%, 90%)" } : null]}
      onClick={clickHandler}
    >
      {getDoubleDigit(props.value)}
    </p>
  );
}

const timeSelectorCSS = css({
  width: "150px",
  minWidth: "150px",
  position: "relative",

  userSelect: "none",
});

const displayCSS = css({
  width: "100%",
  minWidth: "100px",
  height: "38px",

  boxSizing: "border-box",
  border: "1px solid hsl(0, 0%, 80%)",
  borderRadius: "4px",

  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",

  ":hover": {
    borderColor: "hsl(0, 0%, 70%)",
  },
});

const placeholderCSS = css({
  flex: 1,
  height: "100%",

  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",

  boxSizing: "border-box",
  padding: "5px 10px",

  fontSize: "14px",
  color: "hsl(0, 0%, 50%)",
});

const dividerCSS = css({
  width: "0px",
  height: "20px",
  borderLeft: "1px solid hsl(0, 0%, 80%)",
});

const iconCSS = css({
  width: "38px",
  height: "100%",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  color: "hsl(0, 0%, 80%)",
});

const meunCSS = css({
  width: "100%",
  height: "130px",
  position: "absolute",

  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",

  margin: "7px 0px",
  border: "1px solid hsl(0, 0%, 80%)",
  borderRadius: "3px",
  boxSizing: "border-box",

  backgroundColor: "white",
  zIndex: 999,
});

const menuColumnCSS = css({
  flex: 1,
  height: "100%",

  overflow: "auto",
});

const menuItemCSS = css({
  width: "100%",
  height: "25px",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  fontSize: "14px",
  userSelect: "none",

  ":hover": {
    backgroundColor: "hsl(0, 0%, 90%)",
  },
});

export default TimeSelector;
