"use strict";
exports.__esModule = true;
var electron_1 = require("electron");
var createWindow = function () {
    var window = new electron_1.BrowserWindow({
        width: 1200,
        height: 700
    });
    window.loadURL("http://localhost:3000");
};
electron_1.app.whenReady().then(createWindow);
electron_1.app.on("window-all-closed", function () {
    if (process.platform !== "darwin")
        electron_1.app.quit();
});
electron_1.app.on("activate", function () {
    if (electron_1.BrowserWindow.getAllWindows().length === 0)
        createWindow();
});
