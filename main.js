const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.on('open-app', (event, appName) => {
    exec(`start ${appName}`, (error) => {
      if (error) {
        console.error(`exec error: ${error}`);
      }
    });
  });

  ipcMain.on('set-volume', (event, volume) => {
    // This is a simplified example. A more robust solution would use a dedicated library.
    // For now, we'll just open the volume mixer on Windows.
    if (process.platform === 'win32') {
      exec('sndvol.exe', (error) => {
        if (error) {
          console.error(`exec error: ${error}`);
        }
      });
    }
  });

  ipcMain.on('open-settings', (event, setting) => {
    if (process.platform === 'win32') {
      exec(`start ms-settings:${setting}`, (error) => {
        if (error) {
          console.error(`exec error: ${error}`);
        }
      });
    }
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});