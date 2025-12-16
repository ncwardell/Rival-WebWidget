# Rival-WebWidget

A Chrome extension for loading and executing serverless web functions from CortexOne.

## Overview

Rival-WebWidget is a universal serverless function loader that allows you to invoke and interact with CortexOne functions directly from your browser. The extension provides a sleek, cyberpunk-themed interface for managing API credentials, selecting functions, and controlling execution parameters.

## Features

- **Easy Function Loading**: Simple interface to load and execute serverless functions
- **Auto-Save Settings**: All settings automatically save as you type - no need to click save
- **Credential Management**: Securely store API keys and configuration locally
- **Quick Launch URLs**: Use `rival://functionId/version=Draft` URLs to instantly load functions
- **Multiple Endpoints**: Support for multiple CortexOne instances
- **Advanced Parameters**: Customize HTTP methods and event payloads
- **Visual Feedback**: Real-time progress indicators and status updates

## Installation

### Method 1: Load Unpacked Extension (Development)

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/yourusername/Rival-WebWidget.git
   cd Rival-WebWidget
   ```

2. **Create icon files** (required)
   - Navigate to the `icons` directory
   - Follow the instructions in `icons/README.md` to create the required PNG files
   - Or use ImageMagick:
     ```bash
     cd icons
     convert icon.svg -resize 16x16 icon16.png
     convert icon.svg -resize 48x48 icon48.png
     convert icon.svg -resize 128x128 icon128.png
     ```

3. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top-right corner)
   - Click "Load unpacked"
   - Select the `Rival-WebWidget` directory
   - The extension icon should appear in your browser toolbar

### Method 2: Install from Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store in the future.

## Usage

### Method 1: Using the Extension Popup

1. **Open the extension**
   - Click the Rival-WebWidget icon in your Chrome toolbar

2. **Enter your credentials**
   - API Key: Your CortexOne API key
   - Function ID: The UUID of the function you want to invoke
   - Base URL: Select your CortexOne instance endpoint
   - Version: Specify the function version (e.g., "Draft", "Latest", "v1")

3. **Configure advanced options (optional)**
   - Click "Advanced Parameters" to expand
   - Customize the event payload (JSON)
   - Select the HTTP method (POST, GET, PUT, DELETE)

4. **Initialize the function**
   - Check "Persist configuration" to remember your settings
   - Click "🚀 Initialize Function"
   - The extension will load and execute your serverless function

### Method 2: Using rival:// URLs (Quick Launch)

You can navigate directly to functions using the `rival://` protocol:

```
rival://functionId/version=Draft
```

**Examples:**
```
rival://51530a93-7d27-4ca0-9feb-190fc76a46e8/version=Draft
rival://51530a93-7d27-4ca0-9feb-190fc76a46e8/version=Latest
rival://my-function-id/version=v1
```

**URL Format:**
- Basic: `rival://functionId` (uses default version "Draft")
- With version: `rival://functionId/version=VersionName`

**How it works:**
1. Type or paste a `rival://functionId/version=Draft` URL in Chrome's address bar
2. The extension automatically intercepts the URL
3. Opens the launcher page with your function ID and version pre-filled
4. Auto-loads the function if you have saved API credentials

**Note:** Settings are now auto-saved as you type. Your API key will be saved automatically when you paste or enter it.

## Configuration

### Supported Endpoints

- `https://cortexconnect.rival.io` - Production endpoint
- `http://34.171.49.45:4443` - Alternative endpoint (auto-translated to HTTPS)

### Event Payload

The extension allows you to customize the event data sent to your function. Default payload:

```json
{
  "web": true
}
```

You can modify this in the Advanced Parameters section to send custom data to your function.

## Development

### Project Structure

```
Rival-WebWidget/
├── manifest.json       # Chrome extension configuration
├── background.js       # Background service worker (handles rival:// URLs)
├── popup.html         # Extension popup interface
├── launcher.html      # Full-page launcher (opened by rival:// URLs)
├── styles.css         # Styling and animations
├── script.js          # Core functionality
├── index.html         # Standalone web version (legacy)
├── icons/            # Extension icons
│   ├── icon.svg      # SVG source
│   ├── icon16.png    # 16x16 icon
│   ├── icon48.png    # 48x48 icon
│   └── icon128.png   # 128x128 icon
└── README.md         # This file
```

### Building from Source

1. Make your changes to the source files
2. Ensure icons are generated (see Installation step 2)
3. Reload the extension in `chrome://extensions/`

### Testing

1. Load the extension using the unpacked method
2. Test with a valid CortexOne API key and function ID
3. Check the browser console for debugging information

## API Integration

The extension exposes a global `RivalWidget` object that loaded functions can use:

```javascript
// Get stored credentials
const apiKey = window.RivalWidget.getApiKey();
const functionId = window.RivalWidget.getFunctionId();
const baseUrl = window.RivalWidget.getBaseUrl();

// Get the full function URL
const url = window.RivalWidget.getFunctionUrl();

// Invoke a function programmatically
const response = await window.RivalWidget.invokeFunction({
  custom: "data"
});

// Reload the widget
window.RivalWidget.reload();
```

## Security

- API credentials are stored locally using `localStorage`
- Credentials are never sent to third parties
- All communication is encrypted (HTTPS)
- Mixed content warnings are automatically handled

## Troubleshooting

### Extension won't load
- Ensure all required icon files are present in the `icons/` directory
- Check that `manifest.json` is valid JSON
- Verify Developer mode is enabled in Chrome

### Function invocation fails
- Verify your API key is correct
- Check that the Function ID is valid
- Ensure the base URL is accessible
- Check browser console for detailed error messages

### Mixed content warnings
- The extension automatically translates HTTP endpoints to HTTPS where possible
- If using a custom endpoint, ensure it supports HTTPS

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue on GitHub.
