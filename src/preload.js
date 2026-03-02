const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Mouse passthrough controls
    toggleMousePassthrough: (enabled) => ipcRenderer.send('toggle-mouse-passthrough', enabled),
    
    // Window controls
    applySettings: (settings) => ipcRenderer.send('apply-settings', settings),
    loadDefaultContent: () => ipcRenderer.send('load-default-content'),
    
    // Event listeners
    onMousePassthroughChanged: (callback) => ipcRenderer.on('mouse-passthrough-changed', callback),
    onSettingsApplied: (callback) => ipcRenderer.on('settings-applied', callback),
    
    // Window information
    getWindowInfo: () => ipcRenderer.invoke('get-window-info'),
    
    // Configuration
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
    loadSettings: () => ipcRenderer.invoke('load-settings')
});

// Security: Only expose necessary APIs
// Do not expose Node.js APIs directly
// Use IPC for all communication between processes