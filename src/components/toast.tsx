import { useToastStore } from "@/store";
import { textBlue, textOrange, textRed } from "@/styles/color";
import { TMessage } from "@/types";
import { css } from "@emotion/react";
import { AnimatePresence, motion } from "framer-motion";

export default function Toast() {
  const messages = useToastStore((state) => state.messages);

  const messageTypeCSS = (type: TMessage) => {
    switch (type) {
      case "success":
        return css({
          backgroundColor: textBlue,
        });
      case "warning":
        return css({
          backgroundColor: textOrange,
        });
      case "danger":
        return css({
          backgroundColor: textRed,
        });
      default:
        return css({
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        });
    }
  };

  return (
    <div css={toastCSS}>
      <AnimatePresence>
        {messages.map((message, i) => {
          return (
            <motion.div
              layout
              key={message.id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              css={[toastMessageCSS, messageTypeCSS(message.type)]}
            >
              {message.text}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

const toastCSS = css({
  width: "100%",
  boxSizing: "border-box",
  padding: "20px",

  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "10px",

  position: "absolute",
  left: 0,
  bottom: 0,

  pointerEvents: "none",
  zIndex: 25556,
  overflow: "hidden",
});

const toastMessageCSS = css({
  boxSizing: "border-box",
  padding: "15px",
  borderRadius: "5px",
  color: "white",
  pointerEvents: "none",
});
