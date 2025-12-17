# Rival WebWidget Extension

A MetaMask-like Chrome extension for seamless serverless function execution. Turn your browser into a secure gateway for CortexOne serverless functions with wallet-style transaction management.

---

## 🎯 Overview

Rival WebWidget is a browser extension that acts as a secure wallet and execution environment for CortexOne serverless functions. Like MetaMask manages crypto transactions, Rival WebWidget manages serverless function invocations with secure credential storage, transaction logging, and one-click protocol handling.

---

## ✨ Current Features

### 🔐 Secure Credential Management
- **Auto-save API Keys**: Credentials are automatically saved to browser local storage
- **Encrypted Storage**: API keys stored locally, never transmitted except to authorized endpoints
- **Persistent Configuration**: Settings persist across browser sessions

### 🚀 Protocol Handler (`web+rival://`)
- **One-Click Function Loading**: Click `web+rival://` links to instantly execute functions
- **Auto-Submit**: Functions execute automatically when API key is saved
- **URL Format**: `web+rival://functionId/version=0.0.3`
- **PWA Support**: Works as both Chrome extension and Progressive Web App

### 🎨 Current Interface
- Function ID input
- Version selector (Draft, Latest, custom versions)
- Base URL configuration
- Advanced parameters (Event payload, HTTP method)
- Real-time loading indicators

---

## 🚧 Roadmap: MetaMask-Like Experience

### 🎨 Rival Branding & Design
**Status**: Planned

- **Brand Alignment**: Design system matching [cortexone.rival.io](https://cortexone.rival.io/)
- **Rival Logo**: Prominent logo placement at extension header
- **Color Scheme**: Rival's signature colors and typography
- **Modern UI**: Clean, professional interface inspired by MetaMask

### 💰 Wallet Interface
**Status**: Planned

Display USD balance at the top of the extension (wallet functionality):
```
┌─────────────────────────┐
│   [Rival Logo]          │
│                         │
│   Balance: $100.00 USD  │
│                         │
└─────────────────────────┘
```

Initially fixed at $100, expandable for future pay-per-invocation features.

### 📑 Two-Tab Interface
**Status**: Planned

#### Tab 1: Settings
Simplified configuration (removing unnecessary fields):
- **API Key** (required)
- **Base URL** (required)
  - Default: `https://cortexconnect.rival.io`
  - Alternative: `http://34.171.49.45:4443`

*Removed fields*: Function ID, Version, Event Data, HTTP Method (these are now protocol-driven)

#### Tab 2: Transaction Log
Track all function invocations with MetaMask-like transaction history:
```
┌─────────────────────────────────────────┐
│ Recent Transactions                     │
├─────────────────────────────────────────┤
│ ✅ getUserData  12:45 PM  Status: 200  │
│ ✅ processOrder 12:30 PM  Status: 200  │
│ ❌ fetchData    12:15 PM  Status: 500  │
│ ✅ authenticate 12:00 PM  Status: 200  │
└─────────────────────────────────────────┘
```

Each entry shows:
- Function name/ID
- Timestamp
- HTTP status code
- Success/failure indicator

### 🔗 Enhanced Protocol Handler
**Status**: Partially Implemented

#### New URL Format
```
web+rival://{functionId}?v={versionId}
web+rival://{functionId}?v={versionId}/{path}
```

**Examples**:
- `web+rival://51530a93-7d27-4ca0-9feb-190fc76a46e8?v=0.0.3`
- `web+rival://51530a93-7d27-4ca0-9feb-190fc76a46e8?v=Draft`
- `web+rival://51530a93-7d27-4ca0-9feb-190fc76a46e8?v=Latest/dashboard`
- `web+rival://51530a93-7d27-4ca0-9feb-190fc76a46e8?v=0.0.3/user/profile`

#### Event Payload Mapping

**Base invocation** (no path):
```json
{
  "web": true
}
```

**With path** (e.g., `/dashboard`):
```json
{
  "web": true,
  "path": "dashboard"
}
```

**With nested path** (e.g., `/user/profile`):
```json
{
  "web": true,
  "path": "user/profile"
}
```

#### First-Run Handler Registration
**Status**: Planned

On extension install or first run:
1. Show dialog: "Rival WebWidget wants to handle web+rival:// URLs"
2. User clicks "Allow"
3. Protocol handler registered automatically
4. No manual navigation to setup page required

### ✅ Transaction Confirmation Dialog
**Status**: Planned (Critical Feature)

Before EVERY function invocation, show MetaMask-style confirmation:

```
┌─────────────────────────────────────────┐
│  Confirm Function Execution             │
├─────────────────────────────────────────┤
│                                         │
│  Function:  getUserData                 │
│  Version:   0.0.3                       │
│  Path:      /dashboard                  │
│  Endpoint:  cortexconnect.rival.io      │
│                                         │
│  Event Data:                            │
│  {                                      │
│    "web": true,                         │
│    "path": "dashboard"                  │
│  }                                      │
│                                         │
│  [Reject]              [Confirm]        │
└─────────────────────────────────────────┘
```

**Workflow**:
1. User clicks `web+rival://` link OR website triggers execution
2. Extension pauses and shows confirmation dialog
3. User reviews function details
4. User clicks **Reject** (abort) or **Confirm** (execute)
5. On confirm, function executes and result displays
6. Transaction logged to Transaction Log tab

### 🌐 Website-Triggered Invocations
**Status**: Planned (Advanced Feature)

Allow websites to trigger the extension to execute functions:

#### JavaScript API
```javascript
// Website can request function execution via extension
if (window.rivalWebWidget) {
  await window.rivalWebWidget.execute({
    functionId: '51530a93-7d27-4ca0-9feb-190fc76a46e8',
    version: '0.0.3',
    path: 'dashboard',
    eventData: {
      userId: '12345',
      action: 'getData'
    }
  });
}
```

#### Security Flow
1. Website calls `rivalWebWidget.execute()`
2. Extension shows confirmation dialog (same as protocol handler)
3. User reviews request details
4. User approves/rejects
5. Extension executes function using stored API key
6. Result returned to website
7. Transaction logged

**Benefits**:
- Websites don't need to store API keys
- Users maintain full control via confirmation dialogs
- Centralized credential management
- Audit trail in transaction log

---

## 🔧 Installation

### Chrome Extension
1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the extension directory
6. Extension icon appears in toolbar

### First-Time Setup
1. Click extension icon
2. On first run, accept protocol handler registration (future feature)
3. Enter your CortexOne API key (Settings tab)
4. Select Base URL
5. Ready to use!

---

## 📖 Usage

### Method 1: Protocol URLs (Recommended)
Click or paste `web+rival://` URLs anywhere:

```
web+rival://51530a93-7d27-4ca0-9feb-190fc76a46e8?v=0.0.3
```

Extension automatically:
1. Shows confirmation dialog (future)
2. Loads your saved API key
3. Executes the function
4. Displays HTML output
5. Logs transaction (future)

### Method 2: Extension Popup
1. Click extension icon
2. Enter your credentials (API Key, Function ID, Version)
3. Click "Initialize Function"
4. View function output

### Method 3: Website Integration (Future)
Websites can trigger functions via JavaScript API with user confirmation.

---

## 🔐 Security Model

### Credential Storage
- **Local Only**: API keys stored in browser's `localStorage`
- **Never Transmitted**: Credentials only sent to configured base URL
- **User Controlled**: Only executes on user confirmation (future)

### Transaction Approval (Future)
Like MetaMask signing transactions:
- Every invocation requires explicit user approval
- Clear display of what function will execute
- View event data before confirming
- Reject suspicious or unwanted invocations

### Host Permissions
Extension only accesses:
- `https://cortexconnect.rival.io`
- `http://34.171.49.45:4443`
- No other domains without explicit permission

---

## 🛠️ Technical Architecture

### Current Implementation

#### Files
- **manifest.json**: Chrome extension configuration (Manifest V3)
- **popup.html**: Extension popup interface
- **launcher.html**: Full-page function loader
- **script.js**: Core functionality and protocol handling
- **styles.css**: Extension styling
- **background.js**: Service worker for protocol interception
- **protocol-setup.html**: Protocol handler registration page
- **protocol-setup.js**: Registration logic

#### Protocol Flow
```
User clicks web+rival://...
         ↓
Browser catches protocol
         ↓
Extension background.js intercepts
         ↓
Redirects to launcher.html with params
         ↓
script.js parses URL
         ↓
Auto-fills form fields
         ↓
Auto-submits if API key saved
         ↓
Function executes
         ↓
HTML output displayed
```

### Future Implementation

#### Enhanced Protocol Flow (with Confirmation)
```
User clicks web+rival://...
         ↓
Browser catches protocol
         ↓
Extension shows confirmation dialog
         ↓
User reviews details
         ↓
User clicks Confirm
         ↓
Function executes with saved credentials
         ↓
Result displayed
         ↓
Transaction logged
```

#### Website Integration Flow
```
Website calls rivalWebWidget.execute()
         ↓
Extension receives request
         ↓
Shows confirmation dialog
         ↓
User approves
         ↓
Extension executes with API key
         ↓
Result returned to website
         ↓
Transaction logged
```

---

## 📋 URL Format Specification

### Current Format (Legacy)
```
web+rival://functionId/version=versionId
```

**Example**:
```
web+rival://51530a93-7d27-4ca0-9feb-190fc76a46e8/version=0.0.3
```

### New Format (Roadmap)
```
web+rival://{functionId}?v={versionId}[/{path}]
```

**Components**:
- `{functionId}`: UUID of the serverless function
- `?v={versionId}`: Version identifier (e.g., `0.0.3`, `Draft`, `Latest`)
- `/{path}`: Optional path for routing within function (e.g., `/dashboard`, `/user/profile`)

**Examples**:

| URL | Parsed Values | Event Payload |
|-----|---------------|---------------|
| `web+rival://abc123?v=0.0.3` | `functionId=abc123`<br>`version=0.0.3` | `{"web": true}` |
| `web+rival://abc123?v=Draft/dashboard` | `functionId=abc123`<br>`version=Draft`<br>`path=dashboard` | `{"web": true, "path": "dashboard"}` |
| `web+rival://abc123?v=Latest/user/profile` | `functionId=abc123`<br>`version=Latest`<br>`path=user/profile` | `{"web": true, "path": "user/profile"}` |

---

## 🎯 Use Cases

### 1. Quick Function Testing
Developer testing serverless functions:
```
web+rival://myFunction?v=Draft
```
- Click link
- Confirm execution (future)
- See output immediately
- Check transaction log for debugging (future)

### 2. Shareable Function Links
Share function access with team:
```
web+rival://reports?v=Latest/monthly
```
- Recipients click link
- Enter their own API key (first time)
- Confirm execution (future)
- View report output

### 3. Embedded in Documentation
Link functions directly in docs:
```markdown
View the dashboard: [Launch](web+rival://dashboard?v=Latest)
```

### 4. Website Integration (Future)
E-commerce site processing orders:
```javascript
await window.rivalWebWidget.execute({
  functionId: 'processOrder',
  version: 'Latest',
  eventData: { orderId: '12345', userId: 'abc' }
});
```
- User confirms transaction
- Function processes securely
- Result returned to website
- Logged for audit

---

## 🔮 Future Enhancements

### Near-Term
- ✅ Confirmation dialogs for all invocations
- ✅ Two-tab interface (Settings + Transaction Log)
- ✅ Rival branding and design overhaul
- ✅ First-run protocol handler auto-registration
- ✅ New URL format with path support (`?v=` and optional `/path`)
- ✅ Simplified settings (only API Key and Base URL)

### Mid-Term
- 💡 Website JavaScript API for triggering invocations
- 💡 Transaction log export (CSV, JSON)
- 💡 Function execution analytics
- 💡 Multiple API key profiles (work, personal, test)
- 💡 Dark mode

### Long-Term
- 💡 Actual wallet functionality with billing integration
- 💡 Pay-per-invocation metering
- 💡 Team/organization API key sharing
- 💡 Function bookmarks/favorites
- 💡 Execution history search and filtering
- 💡 Chrome OS native app integration (clean `rival://` URLs without `web+` prefix)

---

## 🆘 Support

### Common Issues

**Q: Protocol handler not working?**
A: Reload extension at `chrome://extensions/` and check protocol registration in `protocol-setup.html`

**Q: API key not saving?**
A: Check browser console for localStorage errors. Ensure you're not in incognito mode.

**Q: Function not auto-executing?**
A: Ensure API key is saved first. Open extension popup, enter API key, then try protocol URL again.

**Q: Confirmation dialog not showing?**
A: Feature not yet implemented. Currently functions auto-execute when API key is saved.

### Developer Console
Check browser console (F12) for debug logs:
```
[Rival-WebWidget] web+rival:// URL detected
[Rival-WebWidget] API key loaded from storage
[Rival-WebWidget] Auto-submitting form...
```

---

## 📞 Contact

- **Product**: Rival CortexOne Team
- **Website**: https://cortexone.rival.io/
- **Documentation**: [CortexOne Docs](https://cortexconnect.rival.io)

---

**Version**: 1.0.0 (Current Implementation)
**Roadmap Version**: 2.0.0 (MetaMask-like Experience)
**Last Updated**: December 2025
