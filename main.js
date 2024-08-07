//do "npm start" in terminal to run 

const path = require('path');
const { app, BrowserWindow } = require ('electron')

const isMac = process.platform === 'darwin';

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Athan App',
        height: 700,
        width: 500,
        autoHideMenuBar: true,
        resizable: false,
        show: false,
        webPreferences: {
          contextIsolation: false,
          nodeIntegration: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));

    mainWindow.on("ready-to-show", mainWindow.show)
}

app.whenReady().then(() => {
    createMainWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createMainWindow()
        }
      })
});

app.on('window-all-closed', () => {
  if (!isMac) {
      app.quit()
  }
})
