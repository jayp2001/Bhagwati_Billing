const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');
const { machineIdSync } = require('node-machine-id');
const isDev = true;

let mainWindow;

function createWindow() {
    // Create the browser window - exactly like your old setup
    mainWindow = new BrowserWindow({
        minWidth: 800,
        minHeight: 600,
        title: "Shree Bhagwati Billing",
        icon: path.join(__dirname, '../assets/icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // Load the app
    if (isDev) {
        // In development, load from React dev server
        mainWindow.loadURL('http://localhost:3001');
        // Open DevTools in development
        mainWindow.webContents.openDevTools();
    } else {
        // In production, load the built React app
        mainWindow.loadFile(path.join(__dirname, '../frontend/build/index.html'));
    }

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Initialize machine ID
    getMacAddress();
}

// Printer and Machine ID functionality - exactly like your old setup
function getPrinterList() {
    return new Promise((resolve, reject) => {
        if (process.platform === "win32") {
            exec(
                'powershell -Command "Get-Printer | Select-Object Name"',
                (err, stdout) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const printerNames = stdout
                        .split("\r\n")
                        .map((line) => line.trim())
                        .filter((printer) => printer);

                    resolve(printerNames);
                }
            );
        } else {
            exec("lpstat -a", (err, stdout) => {
                if (err) {
                    reject(err);
                    return;
                }

                const printerNames = stdout
                    .split("\n")
                    .map((line) => line.trim().split(" ")[0])
                    .filter((printer) => printer);

                resolve(printerNames);
            });
        }
    });
}

function getMacAddress() {
    return machineIdSync();
}

// IPC Handlers - exactly like your old setup
ipcMain.on("findMac", async (event, title) => {
    const mac = getMacAddress();
    mainWindow.webContents.send("getMac", mac);
});

ipcMain.on("findPrinter", async (event, title) => {
    getPrinterList()
        .then((printers) => {
            mainWindow.webContents.send("getPrinter", printers);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
});

ipcMain.on("set-title", async (event, title) => {
    const printer = title.printer;
    const data = title.data;
    const printWindow = new BrowserWindow({ show: false });
    await printWindow.loadURL(`data:text/html,` + encodeURIComponent(data));
    try {
        printWindow.webContents.print({
            silent: true,
            printBackground: true,
            margins: {
                marginType: "custom",
                top: printer.marginTop,
                bottom: printer.marginBottom,
                left: printer.marginLeft,
                right: printer.marginRight,
            },
            deviceName: printer.printerName,
        });
    } catch (error) {
    }
});

// Dialog handlers for replacing alert() and confirm()
ipcMain.handle('show-confirm-dialog', async (event, options) => {
    const result = await dialog.showMessageBox(mainWindow, {
        type: 'question',
        buttons: ['Yes', 'No'],
        defaultId: 0,
        cancelId: 1,
        title: options.title || 'Confirm',
        message: options.message,
        icon: options.icon || null
    });
    return result.response === 0; // Return true if 'Yes' was clicked
});

ipcMain.handle('show-alert-dialog', async (event, options) => {
    await dialog.showMessageBox(mainWindow, {
        type: options.type || 'info', // info, warning, error
        buttons: ['OK'],
        defaultId: 0,
        title: options.title || 'Alert',
        message: options.message,
        icon: options.icon || null
    });
});

ipcMain.handle('show-message-box', async (event, options) => {
    const result = await dialog.showMessageBox(mainWindow, options);
    return result;
});

ipcMain.handle('show-error-box', async (event, title, content) => {
    dialog.showErrorBox(title, content);
});

// Create window when Electron is ready
app.whenReady().then(() => {
    createWindow();

    // On macOS, re-create window when dock icon is clicked
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
        shell.openExternal(navigationUrl);
    });
});