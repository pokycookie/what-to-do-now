import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./button.scss";

interface IProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function BackBtn(props: IProps) {
  return (
    <button className="backBtn" onClick={props.onClick}>
      <FontAwesomeIcon icon={faArrowLeft} />
    </button>
  );
}

export default BackBtn;
