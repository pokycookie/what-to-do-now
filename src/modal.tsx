import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import "./scss/modal.scss";
import { useModalStore } from "./zustand";

interface IProps {
  modalID: string | null;
  autoClose?: boolean;
  children?: JSX.Element | JSX.Element[];
  position?: "top" | "center" | "bottom";
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
}

function Modal(props: IProps) {
  const modalID = useModalStore((state) => state.modalID);
  const closeModal = useModalStore((state) => state.closeModal);

  const clickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = (e.target as Element).className === "modal--background";
    if (props.autoClose && target) closeModal();
  };

  let alignItems: string;
  switch (props.position) {
    case "top":
      alignItems = "flex-start";
      break;
    case "center":
      alignItems = "center";
      break;
    case "bottom":
      alignItems = "flex-end";
      break;
    default:
      alignItems = "center";
  }

  const width = props.width;
  const height = props.height;
  const minWidth = props.minWidth;
  const maxWidth = props.maxWidth;
  const minHeight = props.minHeight;
  const maxHeight = props.maxHeight;

  const modalRoot = document.getElementById("modal--root");
  const modalArea = (
    <AnimatePresence>
      {props.modalID === modalID && (
        <motion.div
          key="modal"
          className="modal--background"
          onClick={clickHandler}
          style={{ alignItems }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal--container"
            style={{ width, height, minWidth, maxWidth, minHeight, maxHeight }}
            initial={{ y: 300 }}
            animate={{ y: 0 }}
          >
            {props.children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (modalRoot) {
    return ReactDOM.createPortal(modalArea, modalRoot);
  } else {
    return <></>;
  }
}

export default Modal;
