const { app, BrowserWindow, ipcMain } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true
        },
        title: 'Loading',
    });

    win.setTitle('Loading');
    win.loadFile('resources/index.html');
    win.removeMenu();
    // win.webContents.openDevTools();
    ipcMain.on('closeApp', () => {
        win.close()
    })
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});



ipcMain.on('newWindow', () => {
    createWindow();
})