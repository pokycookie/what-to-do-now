import Database from "@/pages/database";
import Main from "@/pages/main";
import { useAppDataStore } from "@/store";

function Page() {
  const page = useAppDataStore((state) => state.page);

  switch (page) {
    case "database":
      return <Database />;
    case "main":
    default:
      return <Main />;
  }
}

export default Page;
