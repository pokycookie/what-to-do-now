import styled from "@emotion/styled";
import { Interpolation, Theme, css } from "@emotion/react";
import { Transition, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface IProps {
  children?: string;
  animate?: boolean;
  speed?: number;
  gap?: number;
  emotion?: Interpolation<Theme>;
}

export function Marquee(props: IProps) {
  const [overflow, setOverflow] = useState(false);
  const [didMount, setDidMount] = useState(false);
  const [duration, setDuration] = useState(5);

  const isActive = props.animate && overflow;

  const containerREF = useRef<HTMLDivElement>(null);
  const textREF = useRef<HTMLParagraphElement>(null);

  const transition: Transition = {
    duration: isActive ? duration : 0.2,
    ease: "linear",
    repeat: isActive ? Infinity : 0,
  };

  const marqueeTextCSS = css({
    width: !didMount ? "auto" : isActive ? "auto" : "100%",
    overflow: "hidden",
    display: "inline-block",
    textOverflow: "ellipsis",
    paddingRight: props.gap ?? "5px",
    textAlign: "center",
  });

  useEffect(() => {
    setDidMount(false);
  }, [props.children, props.speed]);

  useEffect(() => {
    if (didMount) return;

    const containerWidth = containerREF.current?.clientWidth ?? 0;
    const textWidth = textREF.current?.clientWidth ?? 0;
    setOverflow(containerWidth < textWidth);
    setDuration((textWidth / (props.speed ?? 1)) * 0.01);

    setDidMount(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [didMount]);

  useEffect(() => {
    setDidMount(true);
  }, []);

  return (
    <Container ref={containerREF}>
      <motion.span
        ref={textREF}
        css={[props.emotion, marqueeTextCSS]}
        animate={isActive ? { x: ["0%", "-100%"] } : { x: 0 }}
        transition={transition}
      >
        {props.children}
      </motion.span>
      <motion.span
        css={[props.emotion, marqueeTextCSS]}
        animate={isActive ? { x: ["0%", "-100%"] } : { x: 0 }}
        transition={transition}
      >
        {props.children}
      </motion.span>
    </Container>
  );
}

const Container = styled.div(() => ({
  width: "100%",
  overflow: "hidden",
  whiteSpace: "nowrap",
}));
