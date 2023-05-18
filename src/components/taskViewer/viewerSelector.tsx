import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";
import { useViewerStore } from "@/store";
import { css } from "@emotion/react";
import { bgDark, textOrange } from "@/styles/color";

interface IProps {
  miniSize?: boolean;
}

function ViewerSelector(props: IProps) {
  const isDaily = useViewerStore((store) => store.isDaily);
  const toggleViewer = useViewerStore((store) => store.toggle);

  return (
    <div css={viewerSelectorCSS}>
      <div css={selectorCSS} onClick={toggleViewer}>
        <FontAwesomeIcon icon={isDaily ? faClock : faCalendar} />
      </div>
    </div>
  );
}

const viewerSelectorCSS = css({
  position: "relative",

  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",

  padding: "5px",
  border: `1px solid ${bgDark}`,
  borderRadius: "5px",
  color: bgDark,
});

const selectorCSS = css({
  flex: 1,
  height: "28px",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  cursor: "pointer",
  transition: "all 0.3s",

  ":hover": {
    color: textOrange,
  },
});

export default ViewerSelector;
