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

        // First load xlsx library
        const xlsxPath = path.join(__dirname, "../dist/inject/xlsx.min.js");
        if (fs.existsSync(xlsxPath)) {
          const xlsxContent = fs.readFileSync(xlsxPath, "utf8");
          win.webContents
            .executeJavaScript(xlsxContent)
            .then(() => {
              console.log("✅ XLSX library loaded");
              // Now load the main plugin
              return loadMainPlugin();
            })
            .catch((err) => {
              console.error("❌ Failed to load XLSX:", err);
              // Still try to load main plugin
              loadMainPlugin();
            });
        } else {
          console.warn("⚠️ XLSX library not found, Excel import will not work");
          loadMainPlugin();
        }

        function loadMainPlugin() {
          const content = fs.readFileSync("dist/inject/bundle.js", "utf8");
          win.webContents
            .executeJavaScript(content)
            .then(() => {
              console.log("✅ WhatsApp plugin injected successfully");
            })
            .catch((err) => {
              console.error("❌ Failed to inject plugin:", err);
            });
        }
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
