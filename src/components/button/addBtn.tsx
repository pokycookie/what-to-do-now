import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./button.scss";

interface IProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

function AddBtn(props: IProps) {
  return (
    <button className="circleBtn" onClick={props.onClick}>
      <FontAwesomeIcon icon={faAdd} />
    </button>
  );
}

export default AddBtn;
