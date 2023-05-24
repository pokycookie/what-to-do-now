import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as fs from "fs";
import * as url from "url";

const fileDataPath = path.join(app.getPath("userData"), "./taskData");

const createWindow = () => {
  const window = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 850,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  window.loadURL("http://localhost:3000");

  // const startURL = url.format({
  //   pathname: path.join(__dirname, "/../build/index.html"),
  //   protocol: "file:",
  //   slashes: true,
  // });
  // window.loadURL(startURL);
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app
  .whenReady()
  .then(createWindow)
  .then(async () => {
    // Read fileData
    ipcMain.on("fsRead", (event, args) => {
      if (!fs.existsSync(fileDataPath)) {
        const initFile = {
          meta: null,
          data: {
            tasks: [],
            fixedTasks: [],
            pastTasks: [],
          },
        };
        fs.writeFileSync(fileDataPath, JSON.stringify(initFile), {
          flag: "wx",
        });
      }
      fs.readFile(fileDataPath, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          event.reply("fsRead", data.toString());
        }
      });
    });
    // Write fileData
    ipcMain.on("fsWrite", (event, args: string) => {
      fs.writeFileSync(fileDataPath, args);
    });
  });
