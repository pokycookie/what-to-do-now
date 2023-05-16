import ReactDOM from "react-dom";
import { ReactNode, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useModalStore } from "@/store";
import { css, Interpolation, Theme } from "@emotion/react";

interface IProps {
  modalID: string | null;
  autoClose?: boolean;
  children?: ReactNode;
  CSS?: Interpolation<Theme>;
}

function Modal(props: IProps) {
  const [cantCloseAnimate, setCantCloseAnimate] = useState(false);

  const modalID = useModalStore((state) => state.modalID);
  const closeModal = useModalStore((state) => state.closeModal);

  const cantCloseHandler = () => {
    setCantCloseAnimate(true);
    setTimeout(() => {
      setCantCloseAnimate(false);
    }, 500);
  };

  const clickHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = (e.target as Element).id === "modal--background";
    if (target) {
      if (props.autoClose) {
        closeModal();
      } else {
        cantCloseHandler();
      }
    }
  };

  const modalRoot = document.getElementById("modal--root");
  const modalArea = (
    <AnimatePresence>
      {props.modalID === modalID && (
        <motion.div
          id="modal--background"
          css={modalBackgroundCSS}
          onClick={clickHandler}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            css={[modalContainerCSS, props.CSS]}
            initial={{ y: 300 }}
            animate={{ y: 0, x: cantCloseAnimate ? [-3, 3, -3, 3, -3, 3, 0] : 0 }}
            transition={{
              x: { duration: 0.5 },
              y: { type: "spring", damping: 20, stiffness: 300 },
            }}
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

const modalBackgroundCSS = css({
  width: "calc(100vw - (100vw - 100%))",
  height: "100vh",

  position: "absolute",
  top: 0,
  left: 0,

  backgroundColor: "rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(3px)",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  overflow: "hidden",
  zIndex: 25555,
});

const modalContainerCSS = css({
  width: "auto",
  height: "auto",
  zIndex: 25556,

  backgroundColor: "white",
  borderRadius: "10px",
  padding: "10px",
  boxSizing: "border-box",
});

export default Modal;
