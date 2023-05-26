import { Interpolation, Theme, css } from "@emotion/react";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface IProps {
  children?: string;
  moving?: boolean;
  CSS?: Interpolation<Theme>;
}

export function MovingText(props: IProps) {
  const containerREF = useRef<HTMLDivElement>(null);
  const textREF = useRef<HTMLParagraphElement>(null);

  const [move, setMove] = useState(0);

  useEffect(() => {
    const containerWidth = containerREF.current?.clientWidth ?? 0;
    const width = textREF.current?.clientWidth ?? 0;
    setMove(Math.min(containerWidth - width, 0));
  }, [props.children]);

  return (
    <div css={textContainerCSS} ref={containerREF}>
      <motion.p
        ref={textREF}
        css={[textCSS, props.CSS]}
        animate={props.moving ? { x: [0, move] } : undefined}
        transition={
          props.moving
            ? { repeat: Infinity, duration: -move * 0.04, delay: 0.3, ease: "easeOut" }
            : undefined
        }
      >
        {props.children}
      </motion.p>
    </div>
  );
}

const textContainerCSS = css({
  maxWidth: "100%",
  overflow: "hidden",

  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
});

const textCSS = css({
  whiteSpace: "nowrap",
});
