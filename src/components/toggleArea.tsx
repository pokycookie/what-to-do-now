import { useState } from "react";
import "../scss/components/toggleArea.scss";
import Toggle from "./toggle";

interface IProps {
  title: string;
  children?: JSX.Element | JSX.Element[];
}

export default function ToggleArea(props: IProps) {
  const [toggle, setToggle] = useState(false);

  return (
    <div className="toggleArea">
      <div className="btnArea">
        <p className="title">{props.title}</p>
        <Toggle onChange={(value) => setToggle(value)} />
      </div>
      {toggle ? <div className="contentArea">{props.children}</div> : null}
    </div>
  );
}
