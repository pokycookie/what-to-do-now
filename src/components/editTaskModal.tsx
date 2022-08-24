import { TModal } from "../lib/type";
import "../scss/components/editTaskModal.scss";
import Calendar from "./calendar";
import Clock from "./clock";
import ToggleArea from "./toggleArea";

interface IProps {
  setModal: React.Dispatch<React.SetStateAction<TModal | null>>;
}

export default function EditTaskModal(props: IProps) {
  const cancelHandler = () => {
    props.setModal(null);
  };

  return (
    <div className="editTaskModal">
      <div className="top">
        <input autoFocus />
        <ToggleArea title="EXPIRED">
          <div className="expired">
            <Calendar onChange={(date) => console.log(date.toString())} />
            <Clock
              onChange={(timeObj) => console.log(timeObj)}
              hour={new Date().getHours()}
              minute={new Date().getMinutes()}
            />
          </div>
        </ToggleArea>
      </div>
      <div className="bottom">
        <button>OK</button>
        <button onClick={cancelHandler}>CANCEL</button>
      </div>
    </div>
  );
}
