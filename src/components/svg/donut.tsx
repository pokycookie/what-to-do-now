interface IProps {
  color?: string;
  size?: number;
  holeSize?: number;
  overlay?: boolean;
}

function SvgDonut(props: IProps) {
  const outer = props.size ?? 100;
  const inner = props.holeSize ?? 80;
  const color = props.color ?? "grey";

  return (
    <svg viewBox="0 0 200 200" style={props.overlay ? { position: "absolute" } : undefined}>
      <path
        fill={color}
        d={`M 100 100 m -${outer} 0 a ${outer} ${outer} 0 1 0 ${
          2 * outer
        } 0 a ${outer} ${outer} 0 1 0 -${
          2 * outer
        } 0 Z M 100 100 m -${inner} 0 a ${inner} ${inner} 0 0 1 ${
          2 * inner
        } 0 a ${inner} ${inner} 0 0 1 -${2 * inner} 0 Z`}
      />
    </svg>
  );
}

export default SvgDonut;
