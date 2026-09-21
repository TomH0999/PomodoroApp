const { app, BrowserWindow } = require('electron');
const path = require('path');

app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
    })
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindows();
    });
});

app.on('window_all_closed', function () {
    if (process.platform !== 'darwin') app.quit();
});