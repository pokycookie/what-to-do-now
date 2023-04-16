import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

interface IProps {
  onChange?: (check: boolean) => void;
}

function CheckBtn(props: IProps) {
  const [toggle, setToggle] = useState(false);

  const clickHandler = () => {
    setToggle(!toggle);
    if (props.onChange) props.onChange(!toggle);
  };

  return (
    <div className="checkBtn" onClick={clickHandler}>
      <FontAwesomeIcon icon={toggle ? faCheckSquare : faSquare} />
    </div>
  );
}

export default CheckBtn;
