# CC Browser Overlay

A transparent, always-on-top browser overlay for streaming and chat viewing. Built with Electron, this application creates a seamless overlay window that can display web content while allowing mouse passthrough.

## Features

- **Transparent Overlay**: Create a borderless, see-through window
- **Always on Top**: Window stays above other applications
- **Mouse Passthrough**: Toggle mouse event ignoring for seamless interaction
- **Custom URL Loading**: Load any web content or local files
- **Keyboard Shortcuts**: Quick access to common functions

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lancer1977/cc-browser-overlay.git
   cd cc-browser-overlay
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm start
   ```

## Usage

### Basic Usage

Start the overlay with default settings:
```bash
npm start
```

Start with a custom URL:
```bash
npm start -- https://example.com
```

### Keyboard Shortcuts

- `Ctrl/Cmd + Shift + T`: Toggle mouse passthrough mode
- `Ctrl/Cmd + Shift + M`: Toggle menu visibility (coming soon)
- `Ctrl/Cmd + Shift + E`: Enter edit mode (coming soon)

### Command Line Arguments

- **URL**: Pass a URL as the first argument to load custom content
- **Default**: If no URL is provided, loads a transparent PNG test image

## Development

### Project Structure

```
cc-browser-overlay/
├── src/
│   ├── main.ts          # Electron main process (TypeScript)
│   ├── preload.js       # Electron preload script
│   └── index.html       # Main overlay content
├── scripts/
│   └── copy-static.mjs  # Copies runtime static files to dist/
├── .github/workflows/   # CI/CD workflows
│   ├── ci.yml
│   └── release.yml
├── docs/                # Documentation
├── tests/               # Test files
├── assets/              # Images and resources
└── package.json         # Project configuration
```

### Development Scripts

- `npm run dev`: Run with TypeScript support
- `npm start`: Run the Electron application
- `npm run build`: Compile TS and copy runtime static files to `dist/`
- `npm run dist`: Build platform package artifacts without publishing
- `npm run release`: Build and publish artifacts via electron-builder
- `npm test`: Run tests (not yet implemented)

## Release Automation

This project uses GitHub Actions + electron-builder for multi-platform packaging.

- `CI` workflow (`.github/workflows/ci.yml`)
  - Runs on pushes to `main` and pull requests
  - Builds on `ubuntu-latest`, `windows-latest`, and `macos-latest`
- `Release` workflow (`.github/workflows/release.yml`)
  - Runs on tags matching `v*.*.*`
  - Builds installers for all three platforms and publishes them to a GitHub Release
  - Uses `GH_TOKEN` from `secrets.GITHUB_TOKEN`

## Configuration

### Window Properties

The overlay window is configured with the following properties:
- **Width**: 1920px (can be adjusted)
- **Height**: 1080px (can be adjusted)
- **Transparent**: Yes
- **Frameless**: Yes
- **Always on Top**: Yes
- **Mouse Events**: Ignored by default (toggle with Ctrl/Cmd+Shift+T)

### Security Considerations

- The application uses a preload script for secure IPC communication
- Hardware acceleration is disabled for better compatibility
- Mouse passthrough can be toggled for safety

## Planned Features

- **Edit Mode**: Font adjustment, behavior configuration, overlay positioning
- **View Mode**: Display chat content, status indicators, real-time updates
- **Menu System**: Toggleable settings panel with keyboard shortcuts
- **Status Bar**: Current mode and settings display
- **Configuration File**: Persistent settings storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/lancer1977/cc-browser-overlay/issues) page.

## Changelog

### v1.0.0
- Initial release
- Basic transparent overlay functionality
- Mouse passthrough toggle
- Custom URL loading