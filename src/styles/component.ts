import { css } from "@emotion/react";

export const addBtnCSS = css({
  width: "56px",
  height: "56px",

  borderRadius: "100%",
  backgroundColor: "white",
  boxShadow:
    "0px 6px 10px 0px rgba(0, 0, 0, 0.15), 0px 0px 15px 0px rgba(0, 0, 0, 0.1), 0px 3px 5px -1px rgba(0, 0, 0, 0.25)",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  fontSize: "25px",
  transition: "all 0.3s",

  ":hover": {
    boxShadow:
      "0px 6px 15px 0px rgba(0, 0, 0, 0.2), 0px 0px 20px 3px rgba(0, 0, 0, 0.05), 0px 6px 10px -1px rgba(0, 0, 0, 0.1);",
  },
});

export const backBtnCSS = css({
  width: "40px",
  height: "40px",

  borderRadius: "100%",
  backgroundColor: "white",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  fontSize: "15px",
  transition: "all 0.3s",

  ":hover": {
    backgroundColor: "hsl(0, 0%, 95%)",
  },
});

export const textOverflowCSS = css({
  width: "100%",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});
