import { Fragment } from "react";
import { motion } from "framer-motion";
import "./taskViewer.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";
import { IReduxStore, RSetViewerType, TViewerType } from "../../redux";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

interface IProps {
  miniSize?: boolean;
}

function ViewerSelector(props: IProps) {
  const viewerType = useSelector<IReduxStore, TViewerType>((state) => {
    return state.viewerType;
  }, shallowEqual);

  const dispatch = useDispatch();

  return (
    <div className="viewerSelector">
      {props.miniSize ? (
        <div
          className="miniSelector"
          onClick={() => dispatch(RSetViewerType(viewerType === "daily" ? "monthly" : "daily"))}
        >
          <FontAwesomeIcon icon={viewerType === "daily" ? faClock : faCalendar} />
        </div>
      ) : (
        <Fragment>
          <div className="viewerType" onClick={() => dispatch(RSetViewerType("daily"))}>
            Daily
          </div>
          <div className="viewerType" onClick={() => dispatch(RSetViewerType("monthly"))}>
            Monthly
          </div>
          <div
            className="selectorArea"
            style={{ justifyContent: viewerType === "daily" ? "flex-start" : "flex-end" }}
          >
            <motion.div className="selector" layout />
          </div>
        </Fragment>
      )}
    </div>
  );
}

export default ViewerSelector;
