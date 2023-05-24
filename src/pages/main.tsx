import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { css } from "@emotion/react";
import { useModalStore, useViewerStore } from "@/store";
import DailyViewer from "@/components/taskViewer/daily/dailyViewer";
import MonthlyViewer from "@/components/taskViewer/monthly/monthlyViewer";
import { addBtnCSS } from "@/styles/component";

function Main() {
  const isDaily = useViewerStore((state) => state.isDaily);
  const openModal = useModalStore((state) => state.openModal);

  return (
    <section css={[mainCSS, { alignItems: isDaily ? "center" : "flex-start" }]}>
      {isDaily ? <DailyViewer /> : <MonthlyViewer />}
      <div css={btnAreaCSS}>
        <button css={addBtnCSS} onClick={() => openModal("addTask")}>
          <FontAwesomeIcon icon={faAdd} />
        </button>
      </div>
    </section>
  );
}

const mainCSS = css({
  flex: 1,
  height: "100%",
  position: "relative",

  boxSizing: "border-box",
  padding: "20px",

  display: "flex",
  justifyContent: "center",
});

const btnAreaCSS = css({
  position: "absolute",
  right: "20px",
  bottom: "20px",
});

export default Main;
