# CC Browser Overlay API Documentation

## Overview

This document describes the main components and API of the CC Browser Overlay application.

## Main Process (main.js)

### Functions

#### `createWindow()`
Creates and configures the main overlay window.

**Window Configuration:**
- `width`: 1920 (can be customized)
- `height`: 1080 (can be customized)
- `transparent`: true
- `frame`: false
- `alwaysOnTop`: true

**Usage:**
```javascript
const win = createWindow();
```

#### `app.on('window-all-closed')`
Handles application shutdown when all windows are closed.

#### `app.on('activate')`
Recreates the main window if all windows are closed (macOS behavior).

#### `app.whenReady().then()`
Initializes the application and sets up global shortcuts.

### Global Shortcuts

#### `CommandOrControl+Shift+T`
Toggles mouse event ignoring on the overlay window.

**Behavior:**
- When enabled: Mouse clicks pass through to applications behind the overlay
- When disabled: Mouse interactions work normally with the overlay content

## Preload Script (preload.js)

**Current Status:** Empty placeholder file

**Purpose:** Will be used for secure IPC communication between main and renderer processes.

## Renderer Process (src/index.html)

**Current Status:** Basic HTML structure with test image

**Purpose:** Main content area for the overlay window.

## Configuration

### Command Line Arguments

The application accepts a URL as the first command line argument:

```bash
node main.js https://example.com
```

If no URL is provided, it loads a default transparent PNG test image.

### Environment Variables

None currently configured.

## Security Considerations

1. **Hardware Acceleration**: Disabled for better compatibility
2. **Mouse Events**: Can be toggled for safety
3. **Window Properties**: Frameless and transparent for seamless overlay

## Future API Extensions

### Edit Mode API
- Font size adjustment
- Behavior configuration
- Overlay positioning
- Transparency controls

### View Mode API
- Chat content display
- Status indicators
- Real-time updates
- Content filtering

### Menu System API
- Settings panel toggle
- Keyboard shortcut management
- Configuration persistence
- Status bar controls