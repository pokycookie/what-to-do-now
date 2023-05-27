import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";
import { useAppDataStore, useViewerStore } from "@/store";
import { css } from "@emotion/react";
import { bgDark, textOrange } from "@/styles/color";

interface IProps {
  miniSize?: boolean;
}

function ViewerSelector(props: IProps) {
  const isDaily = useViewerStore((store) => store.isDaily);
  const toggleViewer = useViewerStore((store) => store.toggle);
  const { page, setPage } = useAppDataStore();

  const clickHandler = () => {
    if (page === "main") {
      toggleViewer();
    } else {
      setPage("main");
    }
  };

  return (
    <div css={selectorCSS} onClick={clickHandler}>
      <FontAwesomeIcon icon={isDaily ? faClock : faCalendar} />
    </div>
  );
}

const selectorCSS = css({
  width: "100%",
  height: "40px",
  boxSizing: "border-box",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  padding: "5px",
  border: `1px solid ${bgDark}`,
  borderRadius: "5px",
  color: bgDark,

  cursor: "pointer",
  transition: "all 0.3s",

  ":hover": {
    color: textOrange,
  },
});

export default ViewerSelector;
