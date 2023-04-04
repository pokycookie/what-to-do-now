import ReactDOM from "react-dom";
import "./scss/overlay.scss";

interface IProps {
  className?: string;
  children?: JSX.Element | JSX.Element[] | string;
}

function Overlay(props: IProps) {
  const classList = ["overlay"];
  if (props.className) classList.push(props.className);

  const overlayRoot = document.getElementById("overlay");
  const overlay = <div className={classList.join(" ")}>{props.children}</div>;

  if (overlayRoot) {
    return ReactDOM.createPortal(overlay, overlayRoot);
  } else {
    return <></>;
  }
}

export default Overlay;
