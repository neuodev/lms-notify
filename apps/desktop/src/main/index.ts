import { app, BrowserWindow, session } from "electron";
import fs from "node:fs";
import path from "node:path";

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
      try {
        console.log("📦 Loading WhatsApp plugin...");

        const basePath = app.isPackaged
          ? path.join(process.resourcesPath, 'inject')
          : path.join(__dirname, "../inject");

        const bundlePath = path.join(basePath, "bundle.js");
        if (!fs.existsSync(bundlePath)) {
          console.error("❌ Bundle not found at:", bundlePath);
          return;
        }

        function loadMainPlugin() {
          const content = fs.readFileSync(bundlePath, "utf8");
          win.webContents
            .executeJavaScript(content)
            .then(() => {
              console.log("✅ WhatsApp plugin injected successfully");
            })
            .catch((err) => {
              console.error("❌ Failed to inject plugin:", err);
            });
        }

        loadMainPlugin();
      } catch (err) {
        console.error("❌ Failed to read or inject script:", err);
      }
    }, 3000);
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
