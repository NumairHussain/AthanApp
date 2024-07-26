//do "npm start" in terminal to run 

const path = require('path');
const { app, BrowserWindow} = require ('electron')

const isMac = process.platform === 'darwin';

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'Athan App',
        width: 400,
        height: 600,
        transparent: true,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // Open devtools if in dev env

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
