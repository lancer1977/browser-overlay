import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

// Application state
let win: BrowserWindow | null;
let isIgnoring = true;
let currentSettings = {
    width: 1920,
    height: 1080,
    transparency: 0,
    fontSize: 16,
    contentUrl: null as string | null
};

// Configuration file path
let configPath: string;

// Load saved settings
function loadSettings() {
    try {
        if (fs.existsSync(configPath)) {
            const saved = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            currentSettings = { ...currentSettings, ...saved };
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Save settings
function saveSettings() {
    try {
        fs.writeFileSync(configPath, JSON.stringify(currentSettings, null, 2));
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

// Determine URL to load
const URL_TO_LOAD = process.argv[2] || currentSettings.contentUrl || 'data:text/html;charset=utf-8,' + encodeURIComponent(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>CC Browser Overlay</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                margin: 0; 
                padding: 20px; 
                background: transparent; 
                color: white; 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            }
            h1 { 
                margin: 0; 
                font-size: 32px; 
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            p { 
                margin: 15px 0 0 0; 
                font-size: 16px; 
                opacity: 0.9; 
            }
            .instructions {
                margin-top: 30px;
                font-size: 14px;
                opacity: 0.8;
                line-height: 1.6;
            }
            .status {
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.8);
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                border: 1px solid rgba(255,255,255,0.2);
            }
        </style>
    </head>
    <body>
        <div class="status">Status: Ready • Mouse: Passthrough • Mode: View</div>
        <h1>CC Browser Overlay</h1>
        <p>Transparent overlay for streaming and chat viewing</p>
        <div class="instructions">
            <strong>Keyboard Shortcuts:</strong><br>
            • Ctrl/Cmd + Shift + T: Toggle mouse passthrough<br>
            • Ctrl/Cmd + Shift + E: Enter edit mode<br>
            • Ctrl/Cmd + Shift + M: Toggle menu<br>
            • Ctrl/Cmd + Shift + H: Show/hide window
        </div>
    </body>
    </html>
`);

// Create main window
function createWindow() {
    win = new BrowserWindow({
        width: currentSettings.width,
        height: currentSettings.height,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Load content
    if (URL_TO_LOAD.startsWith('http') || URL_TO_LOAD.startsWith('file://')) {
        win.loadURL(URL_TO_LOAD);
    } else {
        win.loadFile(path.join(__dirname, 'index.html'));
    }

    // Set initial mouse behavior
    win.setIgnoreMouseEvents(isIgnoring, { forward: true });
    
    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
        win.webContents.openDevTools();
    }
}

// IPC Handlers
ipcMain.handle('get-window-info', () => {
    return {
        width: win?.getSize()[0] || currentSettings.width,
        height: win?.getSize()[1] || currentSettings.height,
        isIgnoring: isIgnoring,
        settings: currentSettings
    };
});

ipcMain.handle('save-settings', (event, settings) => {
    currentSettings = { ...currentSettings, ...settings };
    saveSettings();
    return { success: true };
});

ipcMain.handle('load-settings', () => {
    return currentSettings;
});

ipcMain.on('toggle-mouse-passthrough', (event, enabled) => {
    isIgnoring = enabled;
    if (win) {
        win.setIgnoreMouseEvents(isIgnoring, { forward: true });
        win.webContents.send('mouse-passthrough-changed', isIgnoring);
    }
});

ipcMain.on('apply-settings', (event, settings) => {
    currentSettings = { ...currentSettings, ...settings };
    saveSettings();
    
    if (win) {
        // Update window size
        if (settings.width && settings.height) {
            win.setSize(settings.width, settings.height);
        }
        
        // Update content if URL changed
        if (settings.url && settings.url !== win.webContents.getURL()) {
            win.loadURL(settings.url);
        }
        
        win.webContents.send('settings-applied', currentSettings);
    }
});

ipcMain.on('load-default-content', () => {
    if (win) {
        win.loadFile(path.join(__dirname, 'index.html'));
    }
});

// App lifecycle
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

// Global shortcuts
app.whenReady().then(() => {
    configPath = path.join(app.getPath('userData'), 'config.json');
    loadSettings();
    createWindow();
    
    // Toggle mouse passthrough
    globalShortcut.register('CommandOrControl+Shift+T', () => {
        if (!win) {
            console.error('Window not available');
            return;
        }
        
        isIgnoring = !isIgnoring;
        win.setIgnoreMouseEvents(isIgnoring, { forward: true });
        win.webContents.send('mouse-passthrough-changed', isIgnoring);
        console.log(`Mouse passthrough: ${isIgnoring}`);
    });
    
    // Toggle menu
    globalShortcut.register('CommandOrControl+Shift+M', () => {
        if (!win) return;
        
        win.webContents.send('toggle-menu');
    });
    
    // Enter edit mode
    globalShortcut.register('CommandOrControl+Shift+E', () => {
        if (!win) return;
        
        win.webContents.send('enter-edit-mode');
    });
    
    // Show/hide window
    globalShortcut.register('CommandOrControl+Shift+H', () => {
        if (!win) return;
        
        if (win.isVisible()) {
            win.hide();
        } else {
            win.show();
        }
    });
});

// Cleanup
app.on('before-quit', () => {
    globalShortcut.unregisterAll();
    saveSettings();
});