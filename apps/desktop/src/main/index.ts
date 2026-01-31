import { app, BrowserWindow, session } from "electron";
import fs from "node:fs";

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL("https://nvs.learnovia.com/#/auth/login");

  win.webContents.on("did-finish-load", () => {
    setTimeout(() => {
      const content = fs.readFileSync("dist/inject/index.js", "utf8");
      win.webContents.executeJavaScript(content);
    }, 2000);
  });

  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ["https://nvsapi.learnovia.com/api/auth/login"] },
    (details, callback) => {
      if (details.method === "POST") {
        const bytes = details.uploadData?.[0]?.bytes;
        console.log(JSON.parse(bytes?.toString("utf-8") || "{}"));
      }
      callback({ requestHeaders: details.requestHeaders });
    },
  );
};

app.whenReady().then(() => {
  createWindow();
});
