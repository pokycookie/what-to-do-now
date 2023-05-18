import SvgArc from "@/components/svg/arc";
import { css } from "@emotion/react";
import { motion } from "framer-motion";

type TDirection = "left" | "right" | "top" | "bottom";

const dir = {
  left: [225, 315],
  right: [45, 135],
  top: [315, 45],
  bottom: [135, 225],
};

const color = {
  left: ["rgba(122, 168, 116, 0.9)", "rgba(122, 168, 116, 0)"],
  right: ["rgba(235, 29, 54, 0.9)", "rgba(235, 29, 54, 0)"],
  top: ["rgba(44, 51, 51, 0.3)", "rgba(44, 51, 51, 0)"],
  bottom: ["rgba(44, 51, 51, 0.3)", "rgba(44, 51, 51, 0)"],
};

function ListBtn({ direction, onClick }: { direction: TDirection; onClick?: () => void }) {
  const btnCSS = css({
    width: "400px",
    height: "400px",
    position: "absolute",
    clipPath: `url(#${direction})`,
    left: direction === "left" ? 40 : undefined,
    right: direction === "right" ? 40 : undefined,
    top: direction === "top" ? 40 : undefined,
    bottom: direction === "bottom" ? 40 : undefined,
  });

  return (
    <motion.button
      css={btnCSS}
      initial={{
        background: color[direction][1],
        // background: `radial-gradient(circle at ${direction}, ${color[direction][0]} 0%, ${color[direction][1]} 0%)`,
      }}
      whileHover={{
        background: color[direction][0],
        // background: `radial-gradient(circle at ${direction}, ${color[direction][0]} 0%, ${color[direction][1]} 32%)`,
      }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      <SvgArc
        startDeg={dir[direction][0]}
        endDeg={dir[direction][1]}
        holeSize={90}
        clipPath={direction}
        clipPathSize={400}
      />
    </motion.button>
  );
}

export default ListBtn;
