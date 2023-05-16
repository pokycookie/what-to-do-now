import { css } from "@emotion/react";
import { useState } from "react";
import { bgDark, bgWhite } from "../../styles/color";

interface IProps {
  size?: number;
  ratio?: number;
  onChange?: (value: boolean) => void;
}

export default function Toggle(props: IProps) {
  const size = props.size || 20;
  const ratio = props.ratio || 2.1;

  const [value, setValue] = useState(false);

  const clickHandler = () => {
    setValue((prev) => !prev);
    if (props.onChange) props.onChange(!value);
  };

  return (
    <div
      css={[
        toggleCSS,
        {
          width: `${size * ratio}px`,
          height: `${size}px`,
          backgroundColor: value ? "#2c3333" : "#D7D7D7",
        },
      ]}
      onClick={clickHandler}
    >
      <div
        css={[
          toggleDotCSS,
          {
            width: `${size}px`,
            height: `${size}px`,
            left: value ? `${size * ratio - size}px` : `0px`,
          },
        ]}
      ></div>
    </div>
  );
}

const toggleCSS = css({
  width: "35px",
  height: "17px",
  position: "relative",

  borderRadius: "20px",
  border: `2px solid ${bgDark}`,
  backgroundColor: bgWhite,

  cursor: "pointer",
  transition: "background-color 0.2s",
});

const toggleDotCSS = css({
  width: "17px",
  height: "17px",
  position: "absolute",
  top: 0,

  borderRadius: "100%",
  backgroundColor: "white",
  transition: "left 0.2s",
});
