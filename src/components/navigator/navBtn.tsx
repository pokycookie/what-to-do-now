import { useAppDataStore } from "@/store";
import { bgDark, textOrange } from "@/styles/color";
import { css } from "@emotion/react";

interface IProps {
  children: React.ReactNode;
  page: string;
}

function NavBtn(props: IProps) {
  const { page, setPage } = useAppDataStore();

  const clickHandler = () => {
    setPage(props.page);
  };

  return (
    <button
      css={[navBtnCSS, { color: page === props.page ? textOrange : bgDark }]}
      onClick={clickHandler}
    >
      {props.children}
    </button>
  );
}

const navBtnCSS = css({
  width: "100%",
  height: "40px",

  backgroundColor: "white",

  padding: "5px",
  border: `1px solid ${bgDark}`,
  borderRadius: "5px",

  cursor: "pointer",
  transition: "all 0.3s",

  ":hover": {
    color: textOrange,
  },
});

export default NavBtn;
