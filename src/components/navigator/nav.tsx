import { faAdd, faArrowLeft, faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Variants, motion } from "framer-motion";
import "./nav.scss";
import { useState } from "react";
import ViewerSelector from "../taskViewer/viewerSelector";

const variants: Variants = {
  open: { width: 270 },
  close: { width: 60 },
};

function Nav() {
  const [isExtend, setIsExtend] = useState(false);

  return (
    <motion.nav className="nav" animate={isExtend ? "open" : "close"} variants={variants}>
      <div className="top">
        <button className="extendBtn" onClick={() => setIsExtend(!isExtend)}>
          <FontAwesomeIcon icon={isExtend ? faArrowLeft : faBars} />
        </button>
        <div className="divider" />
        <ViewerSelector miniSize />
        <div className="divider" />
      </div>
      <div className="bottom">
        {/* <button className="addBtn">
          <FontAwesomeIcon icon={faAdd} />
        </button> */}
      </div>
    </motion.nav>
  );
}

export default Nav;
