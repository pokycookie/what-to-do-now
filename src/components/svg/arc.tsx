import { css } from "@emotion/react";

interface IProps {
  startDeg: number;
  endDeg: number;
  size?: number;
  holeSize?: number;
  color?: string;
  hoverColor?: string;
  strokeWidth?: number;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
  clipPath?: string;
  clipPathSize?: number;
}

// Must use svg viewBox="0 0 200 200"
function SvgArc(props: IProps) {
  const clipPathSize = props.clipPathSize ?? 200;

  const strokeWidth = props.strokeWidth ?? 0;
  const outer = ((props.size ?? 100) - strokeWidth) * (clipPathSize / 200);
  const inner = ((props.holeSize ?? 80) + strokeWidth) * (clipPathSize / 200);

  const start = getPos(props.startDeg, outer, clipPathSize / 2, clipPathSize / 2);
  const end = getPos(props.endDeg, outer, clipPathSize / 2, clipPathSize / 2);

  const innerStart = getPos(props.startDeg, inner, clipPathSize / 2, clipPathSize / 2);
  const innerEnd = getPos(props.endDeg, inner, clipPathSize / 2, clipPathSize / 2);

  const startDeg = props.startDeg;
  const endDeg = props.endDeg < startDeg ? props.endDeg + 360 : props.endDeg;

  const largeArcFlag = endDeg - startDeg < 180 ? 0 : 1;

  const pathCSS = css({
    cursor: props.onClick ? "pointer" : "auto",
    ":hover": {
      fill: props.onClick ? props.hoverColor ?? props.color : props.color ?? "black",
    },
  });

  if (props.clipPath) {
    return (
      <svg>
        <defs>
          <clipPath id={props.clipPath}>
            <path
              d={`M ${start.x} ${start.y} A ${outer} ${outer} 0 ${largeArcFlag} 1 ${end.x} ${end.y} L ${innerEnd.x} ${innerEnd.y} A ${inner} ${inner} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y} Z`}
              stroke="#2c3333"
              strokeWidth={strokeWidth}
              fill={props.color ?? "black"}
              onMouseEnter={props.onMouseEnter}
              onMouseLeave={props.onMouseLeave}
            />
          </clipPath>
        </defs>
      </svg>
    );
  }

  return (
    <path
      d={`M ${start.x} ${start.y} A ${outer} ${outer} 0 ${largeArcFlag} 1 ${end.x} ${end.y} L ${innerEnd.x} ${innerEnd.y} A ${inner} ${inner} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y} Z`}
      stroke="#2c3333"
      strokeWidth={strokeWidth}
      fill={props.color ?? "black"}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onClick={props.onClick}
      css={pathCSS}
    />
  );
}

function getRadian(deg: number) {
  return deg * (Math.PI / 180);
}

function getPos(deg: number, r: number, cx: number = 100, cy: number = 100) {
  const radian = getRadian(deg);

  const x = cx + r * Math.sin(radian);
  const y = cy - r * Math.cos(radian);

  return { x, y };
}

export default SvgArc;
