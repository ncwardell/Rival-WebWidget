# Rival Web Extension - Product Overview

**Version:** 1.0
**Purpose:** A MetaMask-like browser extension for executing Rival serverless functions via custom protocol handlers

---

## What Is This?

A Chrome/Edge browser extension that works like MetaMask but for serverless functions instead of cryptocurrency. It:
- Stores your API credentials securely
- Shows confirmation dialogs before executing functions
- Tracks execution history
- Displays your account balance

---

## Key Features

### 1. **MetaMask-Style Interface**

**Visual Design:**
- Use Rival branding from https://cortexone.rival.io/ (logo, colors, fonts)
- Popup size: 360px × 600px
- Rival logo at the top
- Clean, modern design matching Rival's website aesthetic

### 2. **Balance Display**

- Shows USD balance prominently at top: **$100.00** (fixed for now)
- Formatted as currency with dollar sign
- Future: Connect to real balance API

### 3. **Two-Tab Layout**

#### **Settings Tab**
- **API Key Input**: Secure password field with show/hide toggle, auto-saves
- **Base URL Input**: Defaults to `https://cortexconnect.rival.io`, validates HTTPS
- **Protocol Handler Status**: Shows if `web+rival://` is registered, with re-register button

#### **Transaction Log Tab**
- List of all past executions (newest first)
- Each entry shows:
  - ✅/❌ Status icon (success/failed)
  - Function ID
  - Version and path
  - Timestamp
  - Duration or error message
- Click to expand and see full request/response details
- Search bar and filter dropdown (All/Success/Failed)

### 4. **Protocol Handler: `web+rival://`**

**First-Time Setup:**
On first launch, show a dialog asking user to register the `web+rival://` protocol handler. Browser shows permission dialog, user accepts.

**URL Format:**
```
web+rival://{functionId}?v={versionId}/{optionalPath}
```

**Examples:**
```
web+rival://checkout-func?v=Draft
web+rival://checkout-func?v=1.0.0/process
web+rival://admin-panel?v=2.0.0/users/list
```

**How It Works:**
1. Website has a link: `<a href="web+rival://myFunc?v=1.0.0/checkout">Execute</a>`
2. User clicks the link
3. Browser recognizes `web+rival://` and opens the extension
4. Extension parses the URL to extract:
   - `functionId`: myFunc
   - `version`: 1.0.0
   - `path`: checkout

**Payload Conversion:**
- URL without path → `{"web": true}`
- URL with path → `{"web": true, "path": "checkout"}`

### 5. **Confirmation Dialog (MetaMask-Style)**

Every time a function is triggered, show a modal dialog:

**Dialog Contents:**
```
┌────────────────────────────────────┐
│  Confirm Function Execution        │
├────────────────────────────────────┤
│  Function ID: checkout-func        │
│  Version: 1.0.0                    │
│  Path: /process                    │
│  Endpoint: https://cortexconnect...│
│                                    │
│  Request Payload:                  │
│  {                                 │
│    "web": true,                    │
│    "path": "process"               │
│  }                                 │
│                                    │
│  Estimated Cost: $0.001            │
├────────────────────────────────────┤
│  [Reject]           [Confirm]      │
└────────────────────────────────────┘
```

**Behavior:**
- User must click "Confirm" to proceed or "Reject" to cancel
- ESC key = Reject, Enter key = Confirm
- Auto-closes after 60 seconds (rejects automatically)
- Cannot be bypassed—every execution requires approval

### 6. **Function Execution**

After user confirms:
1. Extension calls Rival API:
   ```
   POST {baseUrl}/functions/{functionId}/{version}/invoke
   Headers: Authorization: Bearer {apiKey}
   Body: {"web": true, "path": "..."}
   ```
2. Logs the execution attempt as "pending"
3. Waits for response
4. Updates log with "success" or "failed" status
5. Shows result to user

### 7. **Transaction Logging**

Every execution is logged with:
- Unique ID
- Timestamp
- Function ID, version, path
- Request payload
- Response data
- Status (pending/success/failed)
- Execution time in milliseconds
- Error message (if failed)

**Storage:**
- Stored in browser's secure storage (`chrome.storage.local`)
- Limited to last 100 transactions (auto-prunes older ones)
- Persists across browser restarts

---

## How It Works: End-to-End Flow

```
1. User installs extension
   ↓
2. First launch: Register web+rival:// protocol handler
   ↓
3. User adds API key in Settings tab
   ↓
4. User clicks web+rival:// link on a website
   ↓
5. Extension intercepts URL and parses it
   ↓
6. Extension shows confirmation dialog
   ↓
7. User clicks "Confirm"
   ↓
8. Extension calls Rival API with stored API key
   ↓
9. Function executes
   ↓
10. Extension logs transaction and shows result
```

---

## Technical Requirements

### Extension Type
- **Platform**: Chrome/Edge (Manifest V3)
- **Popup Size**: 360px × 600px
- **Technologies**: HTML, CSS, JavaScript

### Permissions Needed
- `storage`: Save API key and transactions
- `webNavigation`: Intercept `web+rival://` URLs
- `tabs`: Manage execution context

### API Integration
- **Endpoint**: `POST {baseUrl}/functions/{functionId}/{version}/invoke`
- **Authentication**: Bearer token (API key in header)
- **Payload**: `{"web": true, "path": "optional"}`

### Security
- API key stored in browser's encrypted storage
- Only sent over HTTPS to Rival API
- Never logged or exposed to web pages
- All executions require user confirmation

---

## User Stories

### Story 1: Developer Integration
"As a developer, I want to add `web+rival://` links to my website so users can execute functions with one click."

### Story 2: Secure Execution
"As a user, I want to review and approve each function execution before it runs, just like signing a transaction in MetaMask."

### Story 3: Audit Trail
"As a user, I want to see a history of all my function executions so I can audit and troubleshoot."

### Story 4: Easy Setup
"As a new user, I want to quickly set up the extension with my API key and start using it immediately."

---

## Design Specifications

### Header
- Rival logo (obtain from cortexone.rival.io)
- Extension title
- Clean separator line

### Balance Display
- 💵 icon
- Large, bold text: "$100.00"
- Light background to stand out

### Tabs
- Two equal-width tabs: "Settings" and "Transaction Log"
- Active tab: Bold text with colored underline
- Inactive tab: Gray text

### Settings Form
- Clean form inputs with labels
- Password field for API key with eye icon toggle
- Text field for base URL
- Status indicators for protocol handler

### Transaction Cards
- Card-based layout
- Color-coded status (green/red/orange)
- Compact summary view
- Expands on click for full details

### Confirmation Dialog
- Modal overlay (darkened background)
- Centered dialog box
- Clear information hierarchy
- Prominent action buttons

---

## Path Handling Examples

| URL | Extracted Path | API Payload |
|-----|---------------|-------------|
| `web+rival://func?v=1.0` | `null` | `{"web": true}` |
| `web+rival://func?v=1.0/settings` | `"settings"` | `{"web": true, "path": "settings"}` |
| `web+rival://func?v=1.0/admin/users` | `"admin/users"` | `{"web": true, "path": "admin/users"}` |

The extension automatically converts the path from the URL into the correct payload format for the API.

---

## Future Enhancements (Not in Initial Version)

- Real-time balance fetching from API
- Export transaction log (CSV/JSON)
- Multiple account support
- Dark mode
- Custom notifications
- Function favorites/bookmarks
- Gas estimation
- Analytics dashboard

---

## Success Criteria

The extension is complete when:
- ✅ User can install and register protocol handler
- ✅ User can save API key securely
- ✅ Clicking `web+rival://` links triggers extension
- ✅ Confirmation dialog appears for every execution
- ✅ Functions execute successfully when confirmed
- ✅ All executions appear in transaction log
- ✅ UI matches Rival branding
- ✅ Extension works on Chrome and Edge

---

## Development Notes

### Project Structure
```
rival-web-extension/
├── manifest.json          # Extension config
├── background.js          # Protocol handler & API calls
├── popup/
│   ├── index.html        # Main UI
│   ├── popup.js          # UI logic
│   └── popup.css         # Styles
├── utils/
│   ├── storage.js        # Storage helpers
│   ├── api.js            # API client
│   └── parser.js         # URL parser
└── assets/
    └── icons/            # Extension icons
```

### Key Implementation Points

1. **Protocol Handler Registration**
   - Use `navigator.registerProtocolHandler('web+rival', ...)`
   - Listen with `chrome.webNavigation.onBeforeNavigate`

2. **URL Parsing**
   - Split by `?v=` to separate function ID from version/path
   - Split version/path by `/` to extract path segments
   - Build payload object based on presence of path

3. **Confirmation Dialog**
   - Show modal before every API call
   - Return Promise that resolves on confirm/reject
   - Add keyboard shortcuts (ESC/Enter)
   - Implement 60-second timeout

4. **API Client**
   - Use `fetch()` with Bearer token auth
   - Handle errors gracefully (401, 404, 500, network)
   - Return formatted response or throw error

5. **Transaction Logging**
   - Log before execution (status: pending)
   - Update after response (status: success/failed)
   - Store in `chrome.storage.local`
   - Limit to 100 entries, prune oldest

---

**This document provides everything needed to understand and build the Rival Web Extension.**

For questions or clarifications, refer to the Rival API documentation or contact the project team.
