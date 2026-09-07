const { app, BrowserWindow, Menu, shell, dialog } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    title: "Gellelio Galileo Training - Wings Fly Aviation Academy",
    backgroundColor: "#000000",
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    mainWindow.maximize();
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) shell.openExternal(url);
    return { action: "deny" };
  });

  const menu = Menu.buildFromTemplate([
    {
      label: "Simulator",
      submenu: [
        { label: "Reset Session", accelerator: "CmdOrCtrl+N", click: () => mainWindow.webContents.executeJavaScript("reset()") },
        { label: "Privacy Policy", click: () => mainWindow.loadFile(path.join(__dirname, "privacy-policy.html")) },
        { type: "separator" },
        { role: "quit", label: "Exit" }
      ]
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "togglefullscreen" },
        { role: "zoomin" },
        { role: "zoomout" },
        { role: "resetzoom" },
        { type: "separator" },
        { label: "Developer Tools", accelerator: "F12", click: () => mainWindow.webContents.openDevTools() }
      ]
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About Gellelio",
          click: () => dialog.showMessageBox(mainWindow, {
            type: "info",
            title: "About Gellelio Galileo Training",
            message: "Gellelio Galileo Training Simulator v0.1",
            detail: "Offline educational simulator for Wings Fly Aviation Academy.\n\nNot affiliated with Travelport or Galileo. No live GDS access."
          })
        },
        { label: "Privacy Policy", click: () => mainWindow.loadFile(path.join(__dirname, "privacy-policy.html")) }
      ]
    }
  ]);
  Menu.setApplicationMenu(menu);
  mainWindow.on("closed", () => { mainWindow = null; });
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
