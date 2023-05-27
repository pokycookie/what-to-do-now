import { faArrowLeft, faBars, faDatabase } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Variants, motion } from "framer-motion";
import { useState } from "react";
import { css } from "@emotion/react";
import ViewerSelector from "../taskViewer/viewerSelector";
import { bgDark, textOrange } from "@/styles/color";
import styled from "@emotion/styled";
import NavBtn from "./navBtn";

const variants: Variants = {
  open: { width: 270 },
  close: { width: 60 },
};

function Nav() {
  const [isExtend, setIsExtend] = useState(false);

  return (
    <motion.nav css={navCSS} animate={isExtend ? "open" : "close"} variants={variants}>
      <NavArea>
        <button css={extendBtnCSS} onClick={() => setIsExtend(!isExtend)}>
          <FontAwesomeIcon icon={isExtend ? faArrowLeft : faBars} />
        </button>
        <Divider />
        <ViewerSelector miniSize />
        <Divider />
        <NavBtn page="database">
          <FontAwesomeIcon icon={faDatabase} />
        </NavBtn>
      </NavArea>
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

const Divider = styled.div(() => ({
  width: "100%",
  borderTop: `1px solid ${bgDark}`,
}));

const NavArea = styled.div(() => ({
  width: "100%",

  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "5px",
}));

export default Nav;
