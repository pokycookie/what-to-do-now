import Nav from "./components/navigator/nav";
import Main from "./pages/main";
import ModalIndex from "./pages/modal";
import "./styles/globals.scss";

export default function App() {
  return (
    <div className="App">
      <Nav />
      <Main />
      <ModalIndex />
    </div>
  );
}
