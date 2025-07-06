const { ipcRenderer } = require('electron');

// Since contextIsolation is false, we can expose ipcRenderer directly to window
window.ipcRenderer = ipcRenderer;

// Also expose electronAPI for compatibility
window.electronAPI = {
    ipcRenderer: ipcRenderer,
    platform: process.platform,
    versions: process.versions,

    // Expose ipcRenderer methods
    sendMessage: (message) => ipcRenderer.send('message', message),
    onMessage: (callback) => ipcRenderer.on('message', callback),
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    openExternal: (url) => ipcRenderer.invoke('open-external', url),

    // Printer and Machine ID functionality
    findMac: () => ipcRenderer.send('findMac'),
    onGetMac: (callback) => ipcRenderer.on('getMac', callback),
    findPrinter: () => ipcRenderer.send('findPrinter'),
    onGetPrinter: (callback) => ipcRenderer.on('getPrinter', callback),
    printData: (printer, data) => ipcRenderer.send('set-title', { printer, data }),

    // Dialog functionality to replace alert() and confirm()
    showConfirm: (message, title = 'Confirm') =>
        ipcRenderer.invoke('show-confirm-dialog', { message, title }),
    showAlert: (message, title = 'Alert', type = 'info') =>
        ipcRenderer.invoke('show-alert-dialog', { message, title, type }),
    showError: (message, title = 'Error') =>
        ipcRenderer.invoke('show-alert-dialog', { message, title, type: 'error' }),
    showWarning: (message, title = 'Warning') =>
        ipcRenderer.invoke('show-alert-dialog', { message, title, type: 'warning' }),
    showMessageBox: (options) =>
        ipcRenderer.invoke('show-message-box', options),
    showErrorBox: (title, content) =>
        ipcRenderer.invoke('show-error-box', title, content)
};

// Remove all listeners when the window is closed
window.addEventListener('beforeunload', () => {
    ipcRenderer.removeAllListeners('message');
    ipcRenderer.removeAllListeners('getMac');
    ipcRenderer.removeAllListeners('getPrinter');
});

