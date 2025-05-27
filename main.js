// Copyright (c) 2025 Numair Hussain
// Licensed under the MIT License. See LICENSE file in the project root for full license information.


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
        width: 400, // was 400
        height: 650, // was 650
        autoHideMenuBar: true,
        resizable: true, //end in false
        show: false,
        icon: iconPath,
        fullscreenable: false,
        webPreferences: {
          devTools: true, //end in false
          contextIsolation: true,
          nodeIntegration: false,
          preload: path.join(__dirname, 'preload.js'),
          sandbox: false
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
