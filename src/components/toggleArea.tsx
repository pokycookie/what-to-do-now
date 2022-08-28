import { useEffect, useState } from "react";
import "../scss/components/toggleArea.scss";
import Toggle from "./toggle";

interface IProps {
  title: string;
  children?: JSX.Element | JSX.Element[];
  onChange?: (toggle: boolean) => void;
  alwaysOpen?: boolean;
}

export default function ToggleArea(props: IProps) {
  const [toggle, setToggle] = useState(props.alwaysOpen ? true : false);

  useEffect(() => {}, [toggle, props]);

  const toggleHandler = (value: boolean) => {
    setToggle(value);
    if (props.onChange) props.onChange(value);
  };

  return (
    <div className="toggleArea">
      <div className="btnArea">
        <p className="title">{props.title}</p>
        {props.alwaysOpen ? null : <Toggle onChange={(value) => toggleHandler(value)} />}
      </div>
      {toggle ? <div className="contentArea">{props.children}</div> : null}
    </div>
  );
}
