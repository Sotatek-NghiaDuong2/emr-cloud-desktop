import * as path from "path";
import { app, BrowserWindow } from "electron";
import serve from "electron-serve";
// Handle function preload
import { useFileHandler } from "./preload/handler";

const loadURL = serve({ directory: "emr-web/build" });

let mainWindow: BrowserWindow | null = null;

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "./preload/preload.js"),
    },
    autoHideMenuBar: true,
  });

  useFileHandler(mainWindow);

  if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT || 3000;
    const url = new URL(`http://localhost:${port}`);
    mainWindow.loadURL(url.href);
    mainWindow.webContents.openDevTools();
  } else {
    loadURL(mainWindow);
  }

  mainWindow.on("ready-to-show", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

/**
 * Add event listeners...
 */

app.on("window-all-closed", () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
