//do "npm start" in terminal to run 

const path = require('path');
const { app, BrowserWindow} = require ('electron')

const isMac = process.platform === 'darwin';

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Athan App',
        // minHeight: 600,
        // minWidth: 400,
        height: 600,
        width: 400,
        // maxHeight: 1000,
        // maxWidth: 800,
        transparent: true,
        autoHideMenuBar: true,
        resizable: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
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
