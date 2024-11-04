//do "npm start" in terminal to run 

const path = require('path');
const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron')

const isMac = process.platform === 'darwin';
const iconPath = path.join(__dirname, path.join('assets', 'mosque.png'))
const whiteIconPath = path.join(__dirname, path.join('assets', 'white mosque.png'))
const fs = require("fs")

let mainWindow; 
let hidden;
let tray;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Athan App',
        width: 800, // was 400
        height: 800, // was 650
        autoHideMenuBar: true,
        resizable: true, //end in false
        show: false,
        icon: iconPath,
        fullscreenable: false,
        webPreferences: {
          devTools: true, //end in false
          contextIsolation: false,
          nodeIntegration: true
        }

    });

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));

    mainWindow.on("ready-to-show", mainWindow.show)

    tray = new Tray(whiteIconPath);
    tray.setToolTip("Athan App")

    mainWindow.on('close', function (event) {
      hidden = true;
      event.preventDefault();
      mainWindow.hide();
    })
    
    tray.on("click", function () {
      if (hidden) {
        mainWindow.show()
      }
    })

    tray.setContextMenu(Menu.buildFromTemplate([
      {label: 'Show', click: () => {mainWindow.show()}},
      {label: 'Quit', click: () => {app.exit()}}]
    ));
};

if (process.platform == 'win32') {
  app.setAppUserModelId(app.name);
}

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow()
      }
    })
});
