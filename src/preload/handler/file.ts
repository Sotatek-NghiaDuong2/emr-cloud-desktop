import { ipcMain, Notification, dialog, BrowserWindow } from "electron";
import { ElectronHandlerChannel } from "../../constants";
import fs from "fs";

export const useFileHandler = (mainWindow: BrowserWindow) => {
  ipcMain.on(ElectronHandlerChannel.SaveFile, async (event, params) => {
    const options = {
      title: "Save file",
      defaultPath: params.fileName,
      buttonLabel: "Save",

      filters: [
        { name: "txt", extensions: ["txt"] },
        { name: "All Files", extensions: ["*"] },
      ],
    };
    const res = await dialog.showSaveDialog(mainWindow, options);
    fs.writeFileSync(res.filePath ?? "", params.fileContent, "utf-8");
  });
};
