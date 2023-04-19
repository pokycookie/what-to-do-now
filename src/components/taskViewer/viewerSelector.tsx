import { Fragment } from "react";
import { motion } from "framer-motion";
import "./taskViewer.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";
import { useViewerStore } from "../../zustand";

interface IProps {
  miniSize?: boolean;
}

function ViewerSelector(props: IProps) {
  const isDaily = useViewerStore((store) => store.isDaily);
  const toggleViewer = useViewerStore((store) => store.toggle);
  const setViewer = useViewerStore((state) => state.setViewer);

  return (
    <div className="viewerSelector">
      {props.miniSize ? (
        <div className="miniSelector" onClick={toggleViewer}>
          <FontAwesomeIcon icon={isDaily ? faClock : faCalendar} />
        </div>
      ) : (
        <Fragment>
          <div className="viewerType" onClick={() => setViewer(true)}>
            Daily
          </div>
          <div className="viewerType" onClick={() => setViewer(false)}>
            Monthly
          </div>
          <div
            className="selectorArea"
            style={{ justifyContent: isDaily ? "flex-start" : "flex-end" }}
          >
            <motion.div className="selector" layout />
          </div>
        </Fragment>
      )}
    </div>
  );
}

export default ViewerSelector;
