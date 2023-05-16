import { faArrowLeft, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Variants, motion } from "framer-motion";
import { useState } from "react";
import { css } from "@emotion/react";
import ViewerSelector from "../taskViewer/viewerSelector";
import { bgDark } from "@/styles/color";

const variants: Variants = {
  open: { width: 270 },
  close: { width: 60 },
};

function Nav() {
  const [isExtend, setIsExtend] = useState(false);

  return (
    <motion.nav css={navCSS} animate={isExtend ? "open" : "close"} variants={variants}>
      <div css={{ width: "100%" }}>
        <button css={extendBtnCSS} onClick={() => setIsExtend(!isExtend)}>
          <FontAwesomeIcon icon={isExtend ? faArrowLeft : faBars} />
        </button>
        <div css={dividerCSS} />
        <ViewerSelector miniSize />
        <div css={dividerCSS} />
      </div>
      <div css={{ width: "100%" }}>
        {/* <button className="addBtn">
          <FontAwesomeIcon icon={faAdd} />
        </button> */}
      </div>
    </motion.nav>
  );
}

const navCSS = css({
  height: "100%",
  padding: "10px",

  boxSizing: "border-box",
  boxShadow: "0px 0px 20px 5px rgba(0, 0, 0, 0.1)",

  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
});

const dividerCSS = css({
  borderBottom: `1px solid ${bgDark}`,
  margin: "5px 0px",
});

const extendBtnCSS = css({
  width: "40px",
  height: "40px",

  borderRadius: "100%",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  fontSize: "16px",
  backgroundColor: "transparent",

  transition: "all 0.3s",
  zIndex: 10,

  ":hover": {
    backgroundColor: "hsl(0, 0%, 95%)",
  },
});

export default Nav;
