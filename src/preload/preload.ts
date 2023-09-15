import { contextBridge, ipcRenderer } from "electron";
import { CommonHandler } from "../../emr-web/src/types/common";
import { ElectronHandlerChannel } from "../constants";

const electronHandler: CommonHandler = {
  saveFile: (fileName: string, fileContent: string) => {
    ipcRenderer.send(ElectronHandlerChannel.SaveFile, {
      fileName,
      fileContent,
    });
  },
};

contextBridge.exposeInMainWorld("common", electronHandler);
