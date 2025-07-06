# Frontend Electron App

A cross-platform desktop application built with Electron and React.

## Features

- 🚀 Latest Electron version (37.2.0)
- ⚛️ React frontend bundled into single executable
- 🔒 Secure with context isolation and preload scripts
- 📦 Single package distribution (exe, dmg, AppImage)
- 🔧 Separate Electron and React projects for easy maintenance

## Project Structure

```
frontend_electron/
├── electron/           # Electron main process files
│   ├── main.js        # Main Electron process
│   └── preload.js     # Preload script for security
├── frontend/          # Your React application
├── assets/            # App icons and resources
├── package.json       # Electron app configuration
└── README.md         # This file
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. **Install Electron dependencies:**

   ```bash
   npm install
   ```

2. **Install React frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

## Development

### Start Development Mode

```bash
npm run electron-dev
```

This will:

- Start the React development server
- Wait for it to be ready
- Launch Electron pointing to the dev server

### Alternative Development Commands

```bash
# Start only React dev server
npm run start:react

# Start only Electron (requires React server running)
npm run electron
```

## Building for Production

### Build React App

```bash
npm run build
```

This builds your React app to `frontend/build/`

### Create Distributable Packages

**For all platforms:**

```bash
npm run dist
```

**For specific platforms:**

```bash
# Windows
npm run dist:win          # Windows (.exe installer + portable)
npm run dist:win-portable # Windows (portable .exe only)

# macOS
npm run dist:mac

# Linux
npm run dist:linux
```

### Windows Build Notes

**Two types of Windows builds are created:**

1. **Installer (.exe)**: Full installation with shortcuts and uninstaller
2. **Portable (.exe)**: Standalone executable that can run from any location

**If you encounter "Setup cannot be closed" error:**

- This usually happens when the app is still running during installation
- The installer is configured to close the app automatically
- If the error persists, manually close the app from Task Manager before running the installer

**Portable Version:**

- No installation required
- Can be copied to USB drive or any folder
- Runs directly by double-clicking the .exe file

**Create unpacked version (for testing):**

```bash
npm run pack
```

## Distribution

The built packages will be available in the `dist/` directory:

- **Windows**: `.exe` installer + portable `.exe`
- **macOS**: `.dmg` file
- **Linux**: `.AppImage` file

## Customization

### App Icons

Replace the placeholder icons in the `assets/` directory:

- `icon.ico` - Windows icon
- `icon.icns` - macOS icon
- `icon.png` - Linux icon (512x512 recommended)

### App Configuration

Edit `package.json` to customize:

- App name and description
- Bundle ID
- Window size and properties
- Build configuration

### Electron Configuration

Modify `electron/main.js` to:

- Change window properties
- Add custom menus
- Handle app lifecycle events
- Configure security settings

## Security Features

- Context isolation enabled
- Node integration disabled
- Remote module disabled
- Preload script for secure API exposure
- External link handling

## Troubleshooting

### Common Issues

1. **Port 3000 already in use:**

   - Kill the process using port 3000
   - Or change the port in React's package.json

2. **Build fails:**

   - Ensure all dependencies are installed
   - Check that React build completes successfully
   - Verify Node.js version compatibility

3. **App doesn't start:**
   - Check console for error messages
   - Ensure React dev server is running (in dev mode)
   - Verify file paths in main.js

### Development Tips

- Use `Ctrl+Shift+I` (or `Cmd+Option+I` on Mac) to open DevTools
- Check the terminal for Electron process logs
- Use `npm run pack` to test the built app without creating installers

## Updating

### Update Electron

```bash
npm update electron
```

### Update React Dependencies

```bash
cd frontend
npm update
cd ..
```

## License

MIT License - feel free to use this template for your projects!
