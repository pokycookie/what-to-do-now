import { faAngleDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "../scss/components/select.scss";

interface IProps {
  options: string[];
  default?: string;
  multiSelect?: boolean;
  fixedOptions?: string[];
  onChange?: (selected: string | string[]) => void;
}

export default function Select(props: IProps) {
  const [selected, setSelected] = useState<string>(props.default || props.options[0]);
  const [selectedArr, setSelectedArr] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prev) => (prev ? false : true));
  };

  const deleteArr = (index: number) => {
    const tempArr = [...selectedArr];
    tempArr.splice(index, 1);
    setSelectedArr(tempArr);
    if (props.onChange) props.onChange(tempArr);
  };

  const optionSelect = (element: string) => {
    if (props.multiSelect && !selectedArr.includes(element)) {
      const tempArr = selectedArr;
      tempArr.push(element);
      setSelectedArr(tempArr);
      if (props.onChange) props.onChange(tempArr);
    } else {
      setSelected(element);
      if (props.onChange) props.onChange(element);
    }
    setIsOpen(false);
  };

  return (
    <div className="select">
      <div className="select__resultArea">
        {props.multiSelect ? (
          <div className="multiArea">
            {selectedArr.map((element, index) => {
              return (
                <div className="select__result--multi" key={index}>
                  <p>{element}</p>
                  <FontAwesomeIcon
                    className="select__icon"
                    icon={faXmark}
                    onClick={() => deleteArr(index)}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="select__result">{selected}</p>
        )}
        <FontAwesomeIcon className="select__icon" icon={faAngleDown} onClick={toggleOpen} />
      </div>

      {isOpen ? (
        <div className="select__optionArea">
          {props.options.map((element, index) => {
            return (
              <p
                className="select__optionElement"
                key={index}
                onClick={() => optionSelect(element)}
              >
                {element}
              </p>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
