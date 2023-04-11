import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";

const createWindow = () => {
  const window = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 850,
    minHeight: 700,
  });
  window.loadURL("http://localhost:3000");

  // const startURL = url.format({
  //   pathname: path.join(__dirname, "/../build/index.html"),
  //   protocol: "file:",
  //   slashes: true,
  // });
  // window.loadURL(startURL);
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
