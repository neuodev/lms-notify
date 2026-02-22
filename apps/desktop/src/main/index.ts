import {
  app,
  BrowserWindow,
  session,
  ipcMain,
  BrowserWindowConstructorOptions,
} from "electron";
import Store from "electron-store";
import fs from "node:fs";
import path from "node:path";
import { autoUpdater } from "electron-updater";

// Initialize secure store
const store = new Store({
  name: "auth", // creates auth.json in app data
  encryptionKey: "your-encryption-key", // optional, but recommended
});

autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

let mainWindow: BrowserWindow | null = null;
let loginWindow: BrowserWindow | null = null;

const BACKEND_URL = "http://localhost:3000"; // from env in production

// Map LMS types to URLs
const LMS_URLS: Record<string, string> = {
  LERNOVIA: "https://nvs.learnovia.com/#/auth/login",
  CLASSERA: "https://example.classera.com", // replace
  TEAMS: "https://teams.microsoft.com",
  COLIGO: "https://example.coligo.com", // replace
};

async function openMainWindow(
  token: string,
  lmsType: string,
  schoolId: string,
) {
  const lmsUrl = LMS_URLS[lmsType];
  if (!lmsUrl) {
    console.error(`Unknown LMS type: ${lmsType}`);
    app.quit();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL(lmsUrl);

  mainWindow.webContents.on("did-finish-load", () => {
    // Set token in localStorage of the LMS page
    mainWindow?.webContents
      .executeJavaScript(
        `
      localStorage.setItem('whatsapp_school_token', ${JSON.stringify(token)});
      localStorage.setItem('whatsapp_school_id', ${JSON.stringify(schoolId)});
      localStorage.setItem('whatsapp_lms_type', ${JSON.stringify(lmsType)});
    `,
      )
      .catch((err) => console.error("Failed to set token:", err));

    // Inject plugin after delay
    setTimeout(() => {
      try {
        const basePath = app.isPackaged
          ? path.join(process.resourcesPath, "inject")
          : path.join(__dirname, "../inject");
        const bundlePath = path.join(basePath, "bundle.js");
        if (!fs.existsSync(bundlePath)) {
          console.error("Bundle not found at:", bundlePath);
          return;
        }
        const content = fs.readFileSync(bundlePath, "utf8");
        mainWindow?.webContents
          .executeJavaScript(content)
          .then(() => console.log("Plugin injected"))
          .catch((err) => console.error("Injection failed:", err));
      } catch (err) {
        console.error("Failed to load plugin:", err);
      }
    }, 3000);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

async function checkStoredToken() {
  const token = store.get("token") as string | undefined;
  const schoolId = store.get("schoolId") as string | undefined;
  if (!token || !schoolId) return false;

  try {
    // Validate token by calling /school/me
    const response = await fetch(`${BACKEND_URL}/schools/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Token invalid");
    const data = await response.json();
    const lmsType = data.school?.lmsType;
    if (!lmsType) throw new Error("No lmsType in response");

    // Token valid – open main window
    await openMainWindow(token, lmsType, schoolId);
    return true;
  } catch (err) {
    console.error("Stored token invalid, clearing", err);
    store.clear();
    return false;
  }
}

function createLoginWindow() {
  const windowOptions: BrowserWindowConstructorOptions = {
    width: 500,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "../login/preload.js"),
    },
    modal: true,
    show: false,
  };
  if (mainWindow) windowOptions.parent = mainWindow;

  loginWindow = new BrowserWindow(windowOptions);

  const loginPath = app.isPackaged
    ? path.join(process.resourcesPath, "login", "index.html")
    : path.join(__dirname, "../login/index.html");

  loginWindow.loadFile(loginPath).catch(console.error);
  loginWindow.once("ready-to-show", () => loginWindow?.show());
  loginWindow.on("closed", () => {
    loginWindow = null;
  });
}

// IPC handler for login
ipcMain.handle("login:submit", async (event, { schoolId, password }) => {
  try {
    const response = await fetch(`${BACKEND_URL}/school/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: schoolId, password }),
    });
    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || "Login failed");
    }

    // Store token and school info
    store.set("token", data.token);
    store.set("schoolId", schoolId);
    store.set("lmsType", data.lmsType);

    // Close login window
    if (loginWindow) {
      loginWindow.close();
      loginWindow = null;
    }

    // Open main window
    await openMainWindow(data.token, data.lmsType, schoolId);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
});

app.whenReady().then(async () => {
  // First check for stored token
  const hasValidToken = await checkStoredToken();
  if (!hasValidToken) {
    createLoginWindow();
  }
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("update-downloaded", (info) => {
  console.log("Update downloaded:", info);
  autoUpdater.quitAndInstall();
});

autoUpdater.on("error", (err) => {
  console.error("Update error:", err);
});
