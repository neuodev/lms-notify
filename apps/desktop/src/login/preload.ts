import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  login: (schoolId: string, password: string) =>
    ipcRenderer.invoke("login:submit", { schoolId, password }),
});
