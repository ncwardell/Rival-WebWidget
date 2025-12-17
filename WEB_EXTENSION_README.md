# Rival Web Extension

A MetaMask-like browser extension for executing serverless functions via the Rival platform using custom protocol handlers and secure API key management.

## Overview

The Rival Web Extension provides a secure, user-friendly interface for managing Rival function executions directly from your browser. Similar to MetaMask for cryptocurrency transactions, this extension handles authentication, confirmation dialogs, and execution tracking for Rival serverless functions.

## Design & Branding

The extension follows the Rival brand identity from [cortexone.rival.io](https://cortexone.rival.io/):

- **Logo**: Rival logo positioned at the top of the extension popup
- **Style**: Modern, clean interface inspired by MetaMask's design patterns
- **Colors**: Rival brand colors (to be extracted from cortexone.rival.io)
- **Layout**: Compact popup interface (360x600px recommended)

## Core Features

### 1. Wallet-Style Interface

- **USD Balance Display**: Shows current balance (fixed at $100 for now)
  - Prominent display at the top of the extension
  - Future: Connect to actual account balance API

### 2. Tabbed Navigation

The extension features two main tabs:

#### Settings Tab
- **API Key Management**
  - Secure input field for API key
  - Auto-save functionality
  - Masked display with show/hide toggle
  - Edit/update capabilities

- **Base URL Configuration**
  - Input field for custom base URL
  - Default: `https://cortexconnect.rival.io`
  - Validation for proper URL format

- **Protocol Handler Status**
  - Displays if `web+rival://` is registered
  - Quick re-registration button if needed

#### Transaction Log Tab
- **Execution History**
  - Chronological list of all function executions
  - Each entry shows:
    - Timestamp
    - Function ID
    - Version ID
    - Path (if applicable)
    - Status (pending/success/failed)
    - Gas/cost indicator (for future billing)

- **Log Entry Actions**
  - Click to view full execution details
  - Copy function URL
  - Re-execute with same parameters

### 3. Protocol Handler: `web+rival://`

#### First-Run Experience

On installation or first launch:
1. Extension displays welcome screen
2. User is prompted to accept `web+rival://` protocol handler registration
3. Browser shows native protocol handler permission dialog
4. User accepts, enabling URL scheme handling

#### Protocol Format

```
web+rival://{functionId}?v={versionId}
web+rival://{functionId}?v={versionId}/{path}
```

**Examples:**
```
web+rival://abc-123-def?v=Draft
web+rival://abc-123-def?v=1.0.0
web+rival://abc-123-def?v=Draft/newpage
web+rival://abc-123-def?v=2.1.0/admin/dashboard
```

#### URL Parsing & Execution

When a `web+rival://` URL is triggered:

1. **Extension Intercepts**: Browser redirects to extension
2. **Parse Parameters**:
   - Extract `functionId` from URL
   - Extract `versionId` from `v` query parameter
   - Extract `path` from URL segments after version
3. **Build Request Payload**:
   ```json
   // No path
   {
     "web": true
   }

   // With path
   {
     "web": true,
     "path": "newpage"
   }
   ```
4. **Show Confirmation Dialog** (see below)
5. **Execute Function** with stored API key and base URL
6. **Log Transaction** to transaction log tab

### 4. Confirmation Dialogs (MetaMask-Style)

Before every function execution, display a confirmation dialog:

**Dialog Contents:**
- **Header**: "Confirm Function Execution"
- **Function Details**:
  - Function ID: `abc-123-def`
  - Version: `Draft` or `1.0.0`
  - Path: `newpage` (if applicable)
  - Endpoint: `https://cortexconnect.rival.io`
- **Request Payload Preview**:
  ```json
  {
    "web": true,
    "path": "newpage"
  }
  ```
- **Estimated Cost**: $0.001 (future feature)
- **Action Buttons**:
  - **Reject** (cancel, close dialog)
  - **Confirm** (proceed with execution)

**Dialog Behavior:**
- Modal overlay, blocks interaction with page
- Cannot execute without user confirmation
- Timeout: Dialog auto-closes after 60 seconds
- Keyboard shortcuts: ESC to reject, Enter to confirm

### 5. Function Execution Flow

```
User clicks web+rival:// link
        ↓
Extension intercepts URL
        ↓
Parse functionId, version, path
        ↓
Retrieve API key & base URL from storage
        ↓
Display confirmation dialog
        ↓
User confirms
        ↓
POST to: {baseUrl}/functions/{functionId}/{version}/invoke
Headers: { "Authorization": "Bearer {apiKey}" }
Body: { "web": true, "path": "{path}" }
        ↓
Log transaction (pending)
        ↓
Receive response
        ↓
Update transaction log (success/failed)
        ↓
Display result or error
```

## Installation

### From Source (Development)

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/rival-web-extension.git
   cd rival-web-extension
   ```

2. **Install in Chrome/Edge**
   - Navigate to `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the extension directory

3. **First Launch**
   - Click extension icon in toolbar
   - Accept protocol handler registration when prompted
   - Enter your API key in Settings tab
   - Configure base URL (or use default)

### From Chrome Web Store (Future)

Coming soon: One-click install from Chrome Web Store

## Usage

### Initial Setup

1. **Open Extension**: Click Rival icon in browser toolbar
2. **Navigate to Settings Tab**
3. **Enter API Key**:
   - Paste your Rival API key
   - Extension auto-saves on input
4. **Configure Base URL** (optional):
   - Default: `https://cortexconnect.rival.io`
   - Custom endpoints supported
5. **Verify Protocol Handler**:
   - Check that `web+rival://` status shows "Registered"

### Executing Functions

#### Method 1: Direct URL
1. Type `web+rival://yourFunctionId?v=Draft` in browser address bar
2. Confirmation dialog appears
3. Review function details
4. Click "Confirm"
5. Function executes
6. View result or check transaction log

#### Method 2: Webpage Link
Websites can include links:
```html
<a href="web+rival://abc-123?v=1.0.0/checkout">Process Checkout</a>
```
Clicking the link triggers the extension flow.

#### Method 3: Manual Invocation (Future)
- Open extension popup
- Click "Execute Function" button
- Enter function ID manually
- Proceeds through confirmation flow

### Viewing Transaction History

1. **Open Extension**
2. **Navigate to Transaction Log Tab**
3. **View Executions**:
   - Most recent at top
   - Filter by status (all/success/failed)
   - Search by function ID
4. **Click Entry** for details:
   - Full request payload
   - Response data
   - Execution time
   - Error messages (if failed)

## Protocol Details

### URL Structure

```
web+rival://{functionId}?v={versionId}/{path}
```

| Component | Description | Required | Example |
|-----------|-------------|----------|---------|
| `functionId` | Unique function identifier | Yes | `abc-123-def` |
| `versionId` | Version to execute (v= query param) | Yes | `Draft`, `1.0.0`, `Latest` |
| `path` | Additional path for routing | No | `newpage`, `admin/users` |

### Request Payload Mapping

| URL | Payload |
|-----|---------|
| `web+rival://func?v=Draft` | `{"web": true}` |
| `web+rival://func?v=1.0.0/settings` | `{"web": true, "path": "settings"}` |
| `web+rival://func?v=Draft/admin/dashboard` | `{"web": true, "path": "admin/dashboard"}` |

### API Invocation

**Endpoint:**
```
POST {baseUrl}/functions/{functionId}/{version}/invoke
```

**Headers:**
```
Authorization: Bearer {apiKey}
Content-Type: application/json
```

**Body:**
```json
{
  "web": true,
  "path": "optional/path/here"
}
```

**Response:**
```json
{
  "success": true,
  "result": { ... },
  "executionTime": 142,
  "cost": 0.001
}
```

## Security

### API Key Storage
- Stored in browser's secure storage (`chrome.storage.local`)
- Never transmitted except in Authorization header
- Encrypted at rest by browser
- Not accessible to web pages
- User can view/edit/delete anytime

### Permissions Required
- `storage`: Save API key and settings
- `webNavigation`: Detect protocol handler navigation
- Host permissions: Access to configured base URL

### User Consent
- **Protocol Registration**: One-time browser permission required
- **Every Execution**: Confirmation dialog prevents unauthorized executions
- **Transparency**: All requests logged with full details visible

### Best Practices
- Never share your API key
- Review confirmation dialogs before approving
- Regularly audit transaction log for unexpected executions
- Revoke/rotate API key if compromised

## Configuration

### Settings Storage

All settings auto-save:
- **API Key**: Masked input, stored securely
- **Base URL**: Plain text, validated on input
- **Protocol Handler**: Registration status tracked

### Advanced Settings (Future)

Planned features:
- Request timeout configuration
- Retry attempts on failure
- Custom headers
- Notification preferences
- Export/import settings

## Development

### Project Structure

```
rival-web-extension/
├── manifest.json           # Extension manifest (v3)
├── background.js           # Service worker for protocol handling
├── popup/
│   ├── popup.html         # Extension popup UI
│   ├── popup.js           # Popup logic
│   └── popup.css          # Popup styles
├── components/
│   ├── settings-tab.js    # Settings tab component
│   ├── log-tab.js         # Transaction log component
│   └── confirm-dialog.js  # Confirmation dialog component
├── utils/
│   ├── storage.js         # Storage helpers
│   ├── api.js            # API invocation logic
│   └── parser.js         # URL parsing utilities
├── assets/
│   ├── logo.svg          # Rival logo
│   ├── icon16.png        # Extension icon 16x16
│   ├── icon48.png        # Extension icon 48x48
│   └── icon128.png       # Extension icon 128x128
└── README.md             # This file
```

### Building

```bash
# Install dependencies
npm install

# Run development build with hot reload
npm run dev

# Build production version
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

### Testing

#### Manual Testing
1. Load unpacked extension
2. Test protocol handler with sample URLs
3. Verify confirmation dialogs appear
4. Check transaction logging
5. Test settings persistence

#### Automated Testing
```bash
# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests with Puppeteer
npm run test:e2e
```

## API Reference

### Background Script API

```javascript
// Register protocol handler
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.url.startsWith('web+rival://')) {
    handleProtocolUrl(details.url);
  }
});

// Parse protocol URL
function parseProtocolUrl(url) {
  // Returns: { functionId, version, path }
}

// Show confirmation dialog
async function showConfirmation(details) {
  // Returns: Promise<boolean>
}

// Execute function
async function executeFunction(functionId, version, payload) {
  // Returns: Promise<response>
}

// Log transaction
function logTransaction(transaction) {
  // Stores in chrome.storage.local
}
```

### Storage Schema

```javascript
{
  // Settings
  "settings": {
    "apiKey": "encrypted_key_here",
    "baseUrl": "https://cortexconnect.rival.io",
    "protocolRegistered": true
  },

  // Transaction log
  "transactions": [
    {
      "id": "uuid-v4",
      "timestamp": 1703001600000,
      "functionId": "abc-123",
      "version": "Draft",
      "path": "newpage",
      "payload": { "web": true, "path": "newpage" },
      "status": "success",
      "response": { ... },
      "executionTime": 142,
      "cost": 0.001
    }
  ]
}
```

## Troubleshooting

### Protocol Handler Not Working

**Issue**: `web+rival://` URLs don't open extension

**Solutions**:
1. Check registration: Settings tab → Protocol Handler status
2. Re-register: Click "Re-register Protocol Handler" button
3. Verify in `chrome://settings/handlers`
4. Restart browser after registration

### API Key Invalid

**Issue**: Executions fail with 401 Unauthorized

**Solutions**:
1. Verify API key is correct (check for extra spaces)
2. Ensure API key has proper permissions
3. Check key hasn't expired or been revoked
4. Test key with curl/Postman outside extension

### Confirmation Dialog Not Appearing

**Issue**: Function executes without confirmation

**Solutions**:
1. Check extension permissions in `chrome://extensions/`
2. Ensure popup blocker isn't interfering
3. Verify `background.js` is loaded (check DevTools)
4. Reinstall extension if corrupted

### Transaction Log Empty

**Issue**: Executions not appearing in log

**Solutions**:
1. Check storage permissions
2. Clear extension storage and reconfigure
3. Check browser console for errors
4. Verify storage quota not exceeded

## Roadmap

### Phase 1: MVP (Current)
- [x] Basic popup UI
- [x] Settings tab with API key input
- [x] Transaction log tab
- [x] Protocol handler registration
- [x] Confirmation dialogs
- [x] Function execution
- [x] Transaction logging

### Phase 2: Enhanced Features
- [ ] Real USD balance from API
- [ ] Export transaction log (CSV/JSON)
- [ ] Search and filter transactions
- [ ] Custom notifications
- [ ] Dark mode support
- [ ] Multi-account support

### Phase 3: Advanced Features
- [ ] Gas estimation before execution
- [ ] Batch executions
- [ ] Function favorites/bookmarks
- [ ] Analytics dashboard
- [ ] WebSocket support for real-time updates
- [ ] Mobile browser support

### Phase 4: Enterprise Features
- [ ] Team collaboration
- [ ] Role-based access control
- [ ] Audit logs with export
- [ ] SSO integration
- [ ] Custom branding for white-label
- [ ] API usage analytics

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details

## Support

- **Documentation**: [docs.rival.io/web-extension](https://docs.rival.io/web-extension)
- **Issues**: [GitHub Issues](https://github.com/yourusername/rival-web-extension/issues)
- **Discord**: [Rival Community](https://discord.gg/rival)
- **Email**: support@rival.io

## Changelog

### v1.0.0 (2025-01-15)
- Initial release
- Protocol handler support for `web+rival://`
- Settings and transaction log tabs
- MetaMask-style confirmation dialogs
- Secure API key storage

---

**Note**: This extension is in active development. Features and specifications may change. For the latest updates, check our [GitHub repository](https://github.com/yourusername/rival-web-extension).
