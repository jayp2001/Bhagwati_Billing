# Electron Migration Complete

## Overview

Successfully migrated all functionality from your old main.js file to the current Electron app structure. The app now includes printer management, machine ID generation, and secure printing capabilities while maintaining the existing security and build configuration.

## What Was Migrated

### 1. **Printer Management**

- **Function**: `getPrinterList()`
- **Platform Support**: Windows (PowerShell) and macOS/Linux (lpstat)
- **Usage**: Automatically detects available printers on the system

### 2. **Machine ID Generation**

- **Function**: `getMacAddress()` (uses node-machine-id)
- **Purpose**: Generates unique machine identifier for licensing/identification
- **Dependency**: `node-machine-id` package

### 3. **Secure Printing**

- **Function**: `printData()` with custom margins and printer selection
- **Features**:
  - Silent printing
  - Custom margins (top, bottom, left, right)
  - Printer selection
  - HTML content support
  - Automatic print window cleanup

## Migration Complete

All functionality has been successfully migrated and integrated with your existing codebase using the direct IPC approach you already use throughout your application.

## Security Improvements

### 1. **Context Isolation**

- All IPC communication goes through preload script
- No direct access to Node.js APIs from renderer
- Secure exposure of only necessary functions

### 2. **Print Window Security**

- Print windows have context isolation enabled
- Automatic cleanup after printing
- Error handling for failed prints

## How to Use in Your React Components

Your existing code already uses the correct pattern. Here's how to use the new functionality:

### Get Machine ID

```javascript
// In your component
const ipcRenderer = window.ipcRenderer;

useEffect(() => {
  ipcRenderer.send("findMac");
  ipcRenderer.on("getMac", (event, macId) => {
    console.log("Machine ID:", macId);
    localStorage.setItem("macAddress", macId);
  });

  return () => {
    ipcRenderer.removeAllListeners("getMac");
  };
}, []);
```

### Get Printer List

```javascript
useEffect(() => {
  ipcRenderer.send("findPrinter");
  ipcRenderer.on("getPrinter", (event, printers) => {
    const printerList = printers?.filter((element) => element != "");
    console.log("Available printers:", printerList);
    localStorage.setItem("printers", JSON.stringify(printerList));
  });

  return () => {
    ipcRenderer.removeAllListeners("getPrinter");
  };
}, []);
```

### Print Data

```javascript
const printData = (printer, htmlContent) => {
  const printerConfig = {
    printer: printer,
    data: htmlContent,
  };
  ipcRenderer.send("set-title", printerConfig);
};

// Usage example:
const receiptHtml = renderToString(<RestaurantBill data={billData} />);
printData(selectedPrinter, receiptHtml);
```

## IPC Communication

### Main Process (electron/main.js)

- `findMac` - Request machine ID
- `findPrinter` - Request printer list
- `set-title` - Print data with printer configuration

### Preload Script (electron/preload.js)

- `findMac()` - Send machine ID request
- `onGetMac(callback)` - Listen for machine ID response
- `findPrinter()` - Send printer list request
- `onGetPrinter(callback)` - Listen for printer list response
- `printData(printer, data)` - Send print request

## Testing

### 1. **Development Mode**

```bash
npm start
```

- Opens Electron app with React dev server
- DevTools enabled for debugging
- Hot reload for development

### 2. **Production Build**

```bash
npm run build
npm run electron:build
```

- Creates optimized production build
- Packages as standalone executable

### 3. **Testing**

Your existing components already use the functionality. You can test by:

1. Running the app: `npm start`
2. Checking the login page for printer and machine ID detection
3. Testing printing functionality in your billing components

## Dependencies Added

### New NPM Packages

- `node-machine-id` - For generating unique machine identifiers

### Updated Files

- `electron/main.js` - Added printer and machine ID functionality
- `electron/preload.js` - Added new IPC methods
- `package.json` - Added new dependency

## Platform Support

### Windows

- Printer detection via PowerShell
- Machine ID generation
- Silent printing with custom margins

### macOS/Linux

- Printer detection via lpstat
- Machine ID generation
- Silent printing with custom margins

## Troubleshooting

### Common Issues

1. **Printers not detected**

   - Ensure printers are properly installed
   - Check system permissions
   - Verify printer drivers are installed

2. **Machine ID not generated**

   - Check if `node-machine-id` is installed
   - Verify system permissions

3. **Printing fails**
   - Check printer is online and has paper
   - Verify printer name is correct
   - Check print permissions

### Debug Mode

Run in development mode to see console logs:

```bash
npm start
```

Check DevTools console for error messages.

## Migration Notes

### What Changed from Old main.js

1. **Security**: Added context isolation and preload script
2. **Structure**: Separated concerns between main and renderer processes
3. **Error Handling**: Added proper error handling and cleanup
4. **Build System**: Integrated with existing Electron Builder setup

### What Remained the Same

1. **Core Functionality**: All printer and machine ID features
2. **Print Margins**: Custom margin support maintained
3. **Platform Support**: Windows and Unix-like systems
4. **Receipt Format**: Gujarati text and styling preserved

## Next Steps

1. **Test the functionality** using the ElectronTest component
2. **Integrate into your existing components** using the utility functions
3. **Customize print templates** as needed for your business
4. **Add error handling** specific to your use cases
5. **Test on target platforms** (Windows, macOS, Linux)

## Support

If you encounter any issues:

1. Check the console logs in DevTools
2. Verify all dependencies are installed
3. Test with the ElectronTest component
4. Ensure proper permissions on target systems
