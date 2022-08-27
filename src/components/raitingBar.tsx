import { faStar as faStarR } from "@fortawesome/free-regular-svg-icons";
import { faStar as faStarS } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import "../scss/components/ratingBar.scss";

interface IProps {
  count?: number;
  onChange?: (rate: number) => void;
}

export default function RaitingBar(props: IProps) {
  const count = props.count || 5;

  const [ratingArr, setRatingArr] = useState<number[]>([]);
  const [rate, setRate] = useState(0);
  const [hoverRate, setHoverRate] = useState(0);

  useEffect(() => {
    const tempArr: number[] = [];
    for (let i = 0; i < count; i++) {
      tempArr.push(i + 1);
    }
    setRatingArr(tempArr);
  }, [count]);

  useEffect(() => {
    if (props.onChange) props.onChange(rate);
  }, [rate]);

  return (
    <div className="ratingBar">
      {ratingArr.map((element) => {
        return (
          <div
            className="element"
            key={element}
            onMouseEnter={() => setHoverRate(element)}
            onMouseLeave={() => setHoverRate(0)}
            onClick={() => setRate((prev) => (prev === element ? 0 : element))}
          >
            <FontAwesomeIcon icon={getIcon(element, hoverRate, rate)} />
          </div>
        );
      })}
    </div>
  );
}

const getIcon = (index: number, hoverRate: number, rate: number) => {
  if (hoverRate === 0) {
    return index > rate ? faStarR : faStarS;
  } else {
    return index > hoverRate ? faStarR : faStarS;
  }
};
