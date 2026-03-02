# CC Browser Overlay Architecture

## Overview

This document describes the architecture and design decisions of the CC Browser Overlay application.

## System Architecture

### Electron Application Structure

The application follows the standard Electron architecture with three main processes:

1. **Main Process** (`main.js`)
   - Manages application lifecycle
   - Creates and configures browser windows
   - Handles system events and global shortcuts
   - Controls window properties and behavior

2. **Renderer Process** (`src/index.html`)
   - Displays the overlay content
   - Handles user interactions within the overlay
   - Can be extended with JavaScript for dynamic content

3. **Preload Process** (`preload.js`)
   - Security bridge between main and renderer processes
   - Currently empty, planned for future IPC communication

## Window Management

### Overlay Window Properties

```javascript
{
  width: 1920,           // Full HD width (configurable)
  height: 1080,          // Full HD height (configurable)
  transparent: true,     // Enables transparency
  frame: false,          // Removes window borders
  alwaysOnTop: true,     // Stays above other applications
  webPreferences: {
    nodeIntegration: false,  // Security best practice
    contextIsolation: true,  // Security best practice
    enableRemoteModule: false // Deprecated, security best practice
  }
}
```

### Mouse Event Handling

The application implements a toggle system for mouse events:

- **Default State**: `setIgnoreMouseEvents(true)` - Mouse passes through
- **Toggle Behavior**: `setIgnoreMouseEvents(false, { forward: true })` - Normal interaction
- **Keyboard Shortcut**: `Ctrl/Cmd + Shift + T`

## Content Loading

### URL Loading Strategy

1. **Command Line Argument**: First argument is treated as URL
2. **Default Fallback**: Transparent PNG test image if no URL provided
3. **Local Files**: Can load local HTML files using `file://` protocol

### Content Security

- **No Node Integration**: Renderer process cannot access Node.js APIs
- **Context Isolation**: Prevents prototype pollution attacks
- **CSP Headers**: Can be configured for additional security

## Configuration Management

### Current Configuration

- Window dimensions (hardcoded, planned for configuration)
- Default URL (hardcoded, planned for configuration)
- Keyboard shortcuts (hardcoded, planned for customization)

### Future Configuration System

- JSON configuration file
- User preferences persistence
- Command line overrides
- Environment variable support

## Security Considerations

### Electron Security Best Practices

1. **Node Integration Disabled**: Prevents renderer from accessing system APIs
2. **Context Isolation Enabled**: Protects against prototype pollution
3. **Remote Module Disabled**: Prevents renderer from accessing main process
4. **Hardware Acceleration Disabled**: Better compatibility, reduces GPU issues

### Overlay-Specific Security

1. **Mouse Passthrough Safety**: Can be disabled for safety
2. **Window Always on Top**: Can be toggled if needed
3. **Transparent Window**: No visual indicators of running application

## Performance Considerations

### Resource Management

- **Minimal Dependencies**: Only essential Electron packages
- **Hardware Acceleration**: Disabled for compatibility
- **Window Size**: Fixed size to prevent performance issues

### Memory Management

- **Single Window**: Only one browser window instance
- **Content Cleanup**: Window destruction handles cleanup
- **Event Listeners**: Proper cleanup on window close

## Extensibility

### Plugin Architecture (Planned)

- **Edit Mode Plugin**: Configuration and customization
- **View Mode Plugin**: Content display and management
- **Menu System Plugin**: User interface and settings

### API Design

- **Modular Functions**: Each feature in separate modules
- **Event-Driven**: Communication through events
- **Configuration-Driven**: Behavior controlled by settings

## Development Workflow

### Build Process

1. **Development**: `npm run dev` with TypeScript support
2. **Production**: `npm run build` for optimized build
3. **Testing**: `npm test` (not yet implemented)

### Code Organization

- **Main Process**: `main.js` for Electron configuration
- **Renderer**: `src/` directory for overlay content
- **Documentation**: `docs/` directory for API and architecture docs
- **Tests**: `tests/` directory for test files
- **Assets**: `assets/` directory for images and resources

## Future Enhancements

### Edit Mode Implementation

- Configuration panel overlay
- Font and style customization
- Behavior and positioning controls
- Real-time preview

### View Mode Implementation

- Chat content integration
- Status indicators
- Real-time updates
- Content filtering

### Menu System Implementation

- Toggleable settings panel
- Keyboard shortcut management
- Persistent configuration
- Status bar integration