import { ReactNode } from "react";

interface IProps {
  width?: number;
  height?: number;
  children?: ReactNode;
  className?: string;
}

function SvgOverlay(props: IProps) {
  const classList = ["svgOverlay"];
  if (props.className) classList.push(props.className);

  return (
    <div
      className={classList.join(" ")}
      style={{
        width: props.width ?? "100%",
        height: props.height ?? "100%",
        position: "relative",
      }}
    >
      {props.children}
    </div>
  );
}

export default SvgOverlay;
