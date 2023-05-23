import { bgDark } from "@/styles/color";
import { _range } from "@/utils";
import { css } from "@emotion/react";
import { motion } from "framer-motion";

interface IProps {
  index: number;
  length: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  viewCount?: number;
}

const dotSize = 10;
const gapSize = 5;

export default function IndexIndicator(props: IProps) {
  const viewCount = props.viewCount ? Math.max(props.viewCount, 1) : 9;
  const maxWidth = (dotSize + gapSize) * viewCount - gapSize;
  const width = Math.min(
    (dotSize + gapSize) * props.length - gapSize,
    maxWidth
  );
  const half = Math.floor(viewCount / 2);
  const leftAnimate =
    props.index > half
      ? (Math.min(props.index, props.length - half - 1) - half) *
        (dotSize + gapSize)
      : 0;

  return (
    <div css={[indexIndicatorCSS, { width }]}>
      <motion.ul css={listAreaCSS} animate={{ left: -leftAnimate }}>
        {_range(props.length).map((i) => {
          return (
            <li
              key={i}
              css={[indexDotCSS, props.index === i ? selectedCSS : null]}
              onClick={() => props.setIndex(i)}
            ></li>
          );
        })}
      </motion.ul>
    </div>
  );
}

const indexIndicatorCSS = css({
  height: dotSize,
  margin: "5px",
  position: "absolute",
  bottom: "40px",
  overflow: "hidden",
});

const listAreaCSS = css({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: gapSize,

  position: "absolute",
});

const indexDotCSS = css({
  minWidth: dotSize,
  minHeight: dotSize,
  borderRadius: "100%",
  border: `1px solid ${bgDark}`,
  cursor: "pointer",
  boxSizing: "border-box",
});

const selectedCSS = css({
  backgroundColor: bgDark,
});
