# Rival Web Extension - Complete Technical Specification

**Version:** 1.0
**Date:** January 2025
**Document Type:** Product Requirements & Technical Specification
**Status:** Ready for Implementation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [User Experience](#user-experience)
4. [Design Specifications](#design-specifications)
5. [Technical Architecture](#technical-architecture)
6. [Feature Specifications](#feature-specifications)
7. [API Integration](#api-integration)
8. [Data Models](#data-models)
9. [Security Requirements](#security-requirements)
10. [User Flows](#user-flows)
11. [Development Requirements](#development-requirements)
12. [Testing & QA](#testing--qa)
13. [Acceptance Criteria](#acceptance-criteria)

---

## 1. Executive Summary

### 1.1 Purpose

Create a browser extension (Chrome/Edge) that enables users to execute Rival serverless functions through a secure, MetaMask-like interface using custom protocol handlers (`web+rival://`).

### 1.2 Key Objectives

- Provide secure API key management
- Enable one-click function execution via custom URL protocol
- Implement transaction confirmation dialogs (similar to MetaMask)
- Track and display execution history
- Display account balance

### 1.3 Target Users

- Developers integrating Rival serverless functions
- Business users executing approved workflows
- System administrators managing function deployments

---

## 2. Product Overview

### 2.1 What is This Extension?

A browser extension that acts as a secure intermediary between web pages and Rival's serverless function platform. It stores user credentials, handles authentication, and provides a user-friendly interface for executing functions with proper authorization confirmation.

### 2.2 Core Functionality

**Think of it like MetaMask, but for serverless functions:**
- MetaMask stores crypto keys → Rival Extension stores API keys
- MetaMask confirms transactions → Rival Extension confirms function executions
- MetaMask shows transaction history → Rival Extension shows execution history
- MetaMask displays wallet balance → Rival Extension displays USD balance

### 2.3 How It Works

```
Website has link: web+rival://myFunction?v=1.0.0/checkout
                              ↓
              User clicks link in browser
                              ↓
        Browser triggers protocol handler
                              ↓
              Extension intercepts URL
                              ↓
     Extension shows confirmation dialog
                              ↓
            User approves execution
                              ↓
   Extension calls Rival API with stored credentials
                              ↓
        Function executes and returns result
                              ↓
      Extension logs transaction and shows result
```

---

## 3. User Experience

### 3.1 Installation Flow

**Step 1: Install Extension**
- User installs from Chrome Web Store (or loads unpacked in dev mode)
- Extension icon appears in browser toolbar

**Step 2: First Launch - Protocol Registration**
- User clicks extension icon
- Welcome screen appears:
  ```
  ┌─────────────────────────────────────┐
  │          [Rival Logo]               │
  │                                     │
  │    Welcome to Rival Extension!     │
  │                                     │
  │  To enable web+rival:// links,     │
  │  we need to register a protocol    │
  │  handler with your browser.        │
  │                                     │
  │  [Register Protocol Handler]       │
  │                                     │
  │  You can skip and do this later    │
  │  in Settings.                      │
  │                                     │
  │          [Skip]  [Continue]         │
  └─────────────────────────────────────┘
  ```

**Step 3: Browser Permission Dialog**
- Native browser dialog appears asking permission to handle `web+rival://` URLs
- User clicks "Allow"

**Step 4: Setup Complete**
- Extension shows: "Setup complete! Now add your API key in Settings."
- Automatically navigates to Settings tab

### 3.2 Daily Usage Flow

**Scenario: User clicks a web+rival:// link on a website**

1. User browsing website sees: `Execute Checkout Function`
2. User clicks link (href="web+rival://checkout-func?v=1.0.0/process")
3. Extension popup opens with confirmation dialog
4. User reviews details and clicks "Confirm"
5. Function executes
6. Extension shows success notification
7. Result displayed (or page redirected if function returns redirect)

---

## 4. Design Specifications

### 4.1 Branding

**Source:** https://cortexone.rival.io/

**Visual Identity:**
- Extract and use the exact color palette from cortexone.rival.io
- Use Rival logo (obtain SVG from website)
- Match typography and spacing from the website
- Professional, modern aesthetic

**Note for Developers:** Visit cortexone.rival.io and use browser DevTools to extract:
- Primary brand color (likely blue or teal based on common SaaS branding)
- Secondary colors
- Font families
- Logo asset (download or request from Rival team)

### 4.2 Extension Popup Dimensions

```
Width: 360px
Height: 600px (expandable, scrollable)
```

### 4.3 Layout Structure

```
┌────────────────────────────────────┐
│         [Rival Logo]               │ ← Header (80px height)
│                                    │
├────────────────────────────────────┤
│  💵 Balance: $100.00              │ ← Balance Display (60px)
├────────────────────────────────────┤
│  [Settings] [Transaction Log]     │ ← Tab Navigation (50px)
├────────────────────────────────────┤
│                                    │
│                                    │
│         Tab Content Area           │ ← Main Content (410px, scrollable)
│                                    │
│                                    │
└────────────────────────────────────┘
```

### 4.4 Component Specifications

#### 4.4.1 Header Component

```
┌────────────────────────────────────┐
│  [Logo Image]                      │
│  Rival Extension                   │
│  ────────────────────────            │
└────────────────────────────────────┘

Specifications:
- Logo: 40x40px, centered or left-aligned
- Title: 18px, brand primary color, semi-bold
- Background: White or light gray
- Bottom border: 1px solid #e0e0e0
- Padding: 20px
```

#### 4.4.2 Balance Display

```
┌────────────────────────────────────┐
│  💵 USD Balance                    │
│  $100.00                           │
└────────────────────────────────────┘

Specifications:
- Label: 12px, gray, uppercase
- Balance: 24px, brand primary color, bold
- Icon: 20px, left of label
- Background: Light background (e.g., #f8f9fa)
- Padding: 15px 20px
- Border bottom: 1px solid #e0e0e0
```

#### 4.4.3 Tab Navigation

```
┌────────────────────────────────────┐
│  [⚙️ Settings] [📋 Transactions]   │
└────────────────────────────────────┘

Specifications:
- Two equal-width tabs
- Active tab: Underline 3px solid brand color, bold text
- Inactive tab: Gray text, no underline
- Height: 50px
- Font: 14px
- Padding: 15px
- Border bottom: 1px solid #e0e0e0
- Hover state: Slightly darker background
```

#### 4.4.4 Settings Tab Content

```
┌────────────────────────────────────┐
│  🔑 API Key                        │
│  [●●●●●●●●●●●●●●●●] [👁️]          │
│  ──────────────────────            │
│                                    │
│  🌐 Base URL                       │
│  [https://cortexconnect.rival.io] │
│  ──────────────────────            │
│                                    │
│  🔗 Protocol Handler               │
│  ✅ web+rival:// is registered    │
│  [Re-register]                     │
│  ──────────────────────            │
│                                    │
│  [Clear All Data]                  │
└────────────────────────────────────┘

Specifications:

API Key Field:
- Label: 14px, semi-bold, with emoji icon
- Input: Password type, masked dots
- Show/Hide toggle: Eye icon button (24px)
- Auto-save on blur (no save button needed)
- Placeholder: "Enter your Rival API key"
- Border: 1px solid #d0d0d0, rounded 4px
- Focus: Border brand color, slight glow

Base URL Field:
- Label: 14px, semi-bold, with emoji icon
- Input: Text type
- Default value: "https://cortexconnect.rival.io"
- Validation: Must be valid HTTPS URL
- Auto-save on blur

Protocol Handler Status:
- Shows current registration status
- Green checkmark if registered
- Red X if not registered
- Button to re-register if needed

Clear Data Button:
- Secondary button style (outlined, not filled)
- Red text and border
- Confirmation dialog before clearing
```

#### 4.4.5 Transaction Log Tab Content

```
┌────────────────────────────────────┐
│  [🔍 Search...]         [Filter ▼] │
│  ──────────────────────            │
│                                    │
│  ┌──────────────────────────────┐ │
│  │ ✅ checkout-func              │ │
│  │ v1.0.0 • /process             │ │
│  │ 2025-01-15 14:32:18           │ │
│  │ Duration: 142ms               │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │ ✅ user-auth                  │ │
│  │ Draft • /login                │ │
│  │ 2025-01-15 14:30:05           │ │
│  │ Duration: 89ms                │ │
│  └──────────────────────────────┘ │
│                                    │
│  ┌──────────────────────────────┐ │
│  │ ❌ payment-process            │ │
│  │ v2.1.0 • /charge              │ │
│  │ 2025-01-15 14:28:52           │ │
│  │ Error: Insufficient funds     │ │
│  └──────────────────────────────┘ │
│                                    │
│  [Load More]                       │
└────────────────────────────────────┘

Specifications:

Search Bar:
- Input with magnifying glass icon
- Placeholder: "Search by function ID..."
- Real-time filter as user types
- Width: 70% of container

Filter Dropdown:
- Options: All, Success, Failed, Pending
- Width: 25% of container
- Aligned right

Transaction Card:
- Background: White
- Border: 1px solid #e0e0e0
- Rounded corners: 6px
- Padding: 12px
- Margin bottom: 10px
- Clickable (expands to show full details)

Status Icons:
- ✅ Green checkmark for success
- ❌ Red X for failed
- ⏳ Orange clock for pending

Transaction Details:
- Function ID: 14px, bold
- Version & Path: 12px, gray
- Timestamp: 11px, light gray
- Duration/Error: 11px, italics

Hover State:
- Slight shadow: 0 2px 8px rgba(0,0,0,0.1)
- Border color: Brand color

Expanded View (when clicked):
Shows additional details:
- Request payload (formatted JSON)
- Response data (formatted JSON)
- Full error stack trace (if failed)
- Copy button for payload
- Re-execute button
```

#### 4.4.6 Confirmation Dialog (Modal)

```
┌────────────────────────────────────┐
│  Confirm Function Execution        │
│  ─────────────────────────         │
│                                    │
│  Function ID:                      │
│  checkout-func                     │
│                                    │
│  Version:                          │
│  1.0.0                             │
│                                    │
│  Path:                             │
│  /process                          │
│                                    │
│  Endpoint:                         │
│  https://cortexconnect.rival.io   │
│                                    │
│  Request Payload:                  │
│  ┌──────────────────────────────┐ │
│  │ {                            │ │
│  │   "web": true,               │ │
│  │   "path": "process"          │ │
│  │ }                            │ │
│  └──────────────────────────────┘ │
│                                    │
│  Estimated Cost: $0.001            │
│                                    │
│  ──────────────────────            │
│  [Reject]           [Confirm]      │
└────────────────────────────────────┘

Specifications:

Modal Overlay:
- Background: rgba(0, 0, 0, 0.5)
- Blur backdrop filter if supported
- Click outside to close (same as Reject)

Modal Box:
- Width: 340px
- Background: White
- Border radius: 8px
- Box shadow: 0 4px 20px rgba(0,0,0,0.3)
- Padding: 24px

Title:
- 18px, bold, brand color
- Border bottom: 2px solid brand color
- Padding bottom: 12px

Field Labels:
- 12px, bold, uppercase, gray
- Margin bottom: 4px

Field Values:
- 14px, dark gray, monospace font for technical values
- Margin bottom: 16px

Payload Box:
- Background: #f5f5f5
- Border: 1px solid #e0e0e0
- Border radius: 4px
- Padding: 12px
- Font: Monospace, 13px
- Color: #333
- Max height: 120px, scrollable if longer

Buttons:
- Height: 40px
- Border radius: 4px
- Font: 14px, bold
- Width: 48% each (split evenly with gap)

Reject Button:
- Background: White
- Border: 2px solid #ccc
- Color: #666
- Hover: Background #f0f0f0

Confirm Button:
- Background: Brand color gradient
- Border: None
- Color: White
- Hover: Slightly darker shade
- Box shadow: 0 2px 8px rgba(brand-color, 0.3)

Keyboard Shortcuts:
- ESC: Reject/Close
- Enter: Confirm
- Show hint at bottom: "ESC to reject • Enter to confirm"

Auto-Close:
- Dialog auto-closes after 60 seconds
- Show countdown timer: "Auto-closing in 45s..."
```

---

## 5. Technical Architecture

### 5.1 Technology Stack

**Required:**
- **Manifest Version:** 3 (latest Chrome extension standard)
- **JavaScript:** ES6+ (async/await, modules)
- **Storage:** Chrome Storage API (`chrome.storage.local`)
- **Protocol Handling:** Web Navigation API
- **UI Framework:** Vanilla JavaScript or React (developer's choice)
- **Styling:** CSS3 (or Tailwind CSS for rapid development)

**Build Tools (Optional but Recommended):**
- Webpack or Vite for bundling
- ESLint for code quality
- Prettier for formatting
- Jest for testing

### 5.2 Extension Structure

```
rival-web-extension/
├── manifest.json              # Extension manifest (v3)
├── background.js              # Service worker for protocol handling
├── popup/
│   ├── index.html            # Main popup HTML
│   ├── popup.js              # Popup logic and tab management
│   ├── popup.css             # Popup styles
│   └── components/
│       ├── settings-tab.js   # Settings tab component
│       ├── log-tab.js        # Transaction log component
│       └── confirm-dialog.js # Confirmation modal component
├── utils/
│   ├── storage.js            # Storage abstraction layer
│   ├── api.js                # Rival API client
│   ├── parser.js             # URL protocol parser
│   └── logger.js             # Transaction logger
├── assets/
│   ├── icons/
│   │   ├── icon16.png        # 16x16 icon
│   │   ├── icon48.png        # 48x48 icon
│   │   └── icon128.png       # 128x128 icon
│   └── logo.svg              # Rival logo
└── tests/
    ├── parser.test.js        # Unit tests for parser
    ├── api.test.js           # Unit tests for API client
    └── integration.test.js   # Integration tests
```

### 5.3 manifest.json

```json
{
  "manifest_version": 3,
  "name": "Rival Web Extension",
  "version": "1.0.0",
  "description": "Execute Rival serverless functions securely via custom protocol handlers",

  "permissions": [
    "storage",
    "webNavigation",
    "tabs"
  ],

  "host_permissions": [
    "https://cortexconnect.rival.io/*",
    "https://*/*"
  ],

  "background": {
    "service_worker": "background.js",
    "type": "module"
  },

  "action": {
    "default_popup": "popup/index.html",
    "default_icon": {
      "16": "assets/icons/icon16.png",
      "48": "assets/icons/icon48.png",
      "128": "assets/icons/icon128.png"
    }
  },

  "icons": {
    "16": "assets/icons/icon16.png",
    "48": "assets/icons/icon48.png",
    "128": "assets/icons/icon128.png"
  },

  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

**Important Notes:**
- `webNavigation` permission is crucial for intercepting `web+rival://` URLs
- `storage` permission for saving API keys and transaction log
- `tabs` permission for opening/managing tabs when executing functions
- Host permissions allow extension to call Rival API endpoints

### 5.4 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Browser                            │
│                                                         │
│  ┌──────────────┐         ┌─────────────────┐         │
│  │   Web Page   │────────▶│  Extension Icon │         │
│  │              │         │  (Toolbar)      │         │
│  │ <a href=     │         └─────────────────┘         │
│  │ "web+rival://│                 │                    │
│  │  ...">       │                 ▼                    │
│  └──────────────┘         ┌─────────────────┐         │
│         │                 │   Popup UI      │         │
│         │                 │  (popup.html)   │         │
│         │                 └─────────────────┘         │
│         │                         │                    │
│         ▼                         ▼                    │
│  ┌──────────────────────────────────────────┐         │
│  │      Background Service Worker           │         │
│  │         (background.js)                   │         │
│  │                                           │         │
│  │  • Listens for web+rival:// navigation   │         │
│  │  • Parses URL parameters                 │         │
│  │  • Triggers confirmation dialog          │         │
│  │  • Calls Rival API                       │         │
│  │  • Logs transactions                     │         │
│  └──────────────────────────────────────────┘         │
│         │                         │                    │
│         ▼                         ▼                    │
│  ┌──────────────┐         ┌─────────────────┐         │
│  │   Storage    │         │   Rival API     │         │
│  │ (chrome.     │         │ (cortexconnect. │         │
│  │  storage)    │         │  rival.io)      │         │
│  └──────────────┘         └─────────────────┘         │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Feature Specifications

### 6.1 Feature: Protocol Handler Registration

**User Story:**
As a user, I want the extension to handle `web+rival://` URLs so I can execute functions by clicking links.

**Technical Requirements:**

1. **On First Launch:**
   - Check if protocol is already registered
   - If not, show welcome screen with registration prompt
   - When user clicks "Register", call protocol registration API

2. **Registration Implementation:**
   ```javascript
   // In background.js or appropriate script
   navigator.registerProtocolHandler(
     'web+rival',
     chrome.runtime.getURL('popup/index.html') + '?url=%s',
     'Rival Function Executor'
   );
   ```

3. **Navigation Interception:**
   ```javascript
   // In background.js
   chrome.webNavigation.onBeforeNavigate.addListener((details) => {
     if (details.url.startsWith('web+rival://')) {
       // Parse URL
       const parsed = parseProtocolUrl(details.url);

       // Show confirmation dialog
       showConfirmationDialog(parsed);

       // Prevent default navigation
       return { cancel: true };
     }
   });
   ```

4. **Persistence:**
   - Store registration status in chrome.storage.local
   - Show status in Settings tab
   - Provide re-registration button if user clears browser data

**Acceptance Criteria:**
- [ ] First launch shows registration prompt
- [ ] Clicking "Register" triggers browser permission dialog
- [ ] After approval, `web+rival://` URLs are intercepted by extension
- [ ] Registration status persists across browser restarts
- [ ] Settings tab shows current registration status
- [ ] Re-registration button works if protocol is unregistered

---

### 6.2 Feature: URL Protocol Parsing

**User Story:**
As a developer, I need the extension to correctly parse `web+rival://` URLs and extract function parameters.

**URL Format:**
```
web+rival://{functionId}?v={versionId}/{optionalPath}
```

**Examples:**
- `web+rival://abc-123?v=Draft`
- `web+rival://my-function-id?v=1.0.0`
- `web+rival://checkout?v=2.1.0/process`
- `web+rival://admin?v=Draft/users/list`

**Parser Implementation:**

```javascript
// utils/parser.js

/**
 * Parses a web+rival:// URL into components
 * @param {string} url - Full protocol URL
 * @returns {Object} Parsed components
 */
function parseProtocolUrl(url) {
  // Remove protocol prefix
  const withoutProtocol = url.replace('web+rival://', '');

  // Split by '?v=' to separate functionId from version+path
  const [functionId, rest] = withoutProtocol.split('?v=');

  if (!functionId || !rest) {
    throw new Error('Invalid URL format. Expected: web+rival://functionId?v=version');
  }

  // Split version from path
  const [version, ...pathParts] = rest.split('/');
  const path = pathParts.join('/'); // Rejoin in case path has multiple segments

  return {
    functionId: functionId.trim(),
    version: version.trim(),
    path: path || null
  };
}

/**
 * Converts parsed URL to API request payload
 * @param {Object} parsed - Output from parseProtocolUrl
 * @returns {Object} Request payload
 */
function buildPayload(parsed) {
  const payload = {
    web: true
  };

  if (parsed.path) {
    payload.path = parsed.path;
  }

  return payload;
}

// Export functions
export { parseProtocolUrl, buildPayload };
```

**Test Cases:**

```javascript
// tests/parser.test.js

test('Parse basic URL without path', () => {
  const url = 'web+rival://my-func?v=Draft';
  const result = parseProtocolUrl(url);
  expect(result).toEqual({
    functionId: 'my-func',
    version: 'Draft',
    path: null
  });
});

test('Parse URL with simple path', () => {
  const url = 'web+rival://checkout?v=1.0.0/process';
  const result = parseProtocolUrl(url);
  expect(result).toEqual({
    functionId: 'checkout',
    version: '1.0.0',
    path: 'process'
  });
});

test('Parse URL with nested path', () => {
  const url = 'web+rival://admin?v=2.0.0/users/list';
  const result = parseProtocolUrl(url);
  expect(result).toEqual({
    functionId: 'admin',
    version: '2.0.0',
    path: 'users/list'
  });
});

test('Build payload without path', () => {
  const parsed = { functionId: 'func', version: 'Draft', path: null };
  const payload = buildPayload(parsed);
  expect(payload).toEqual({ web: true });
});

test('Build payload with path', () => {
  const parsed = { functionId: 'func', version: '1.0', path: 'checkout' };
  const payload = buildPayload(parsed);
  expect(payload).toEqual({ web: true, path: 'checkout' });
});
```

**Acceptance Criteria:**
- [ ] Parser correctly extracts functionId, version, and path
- [ ] Parser handles URLs with and without paths
- [ ] Parser handles multi-segment paths (e.g., `/admin/users/list`)
- [ ] Parser throws error for malformed URLs
- [ ] Payload builder creates correct JSON for API
- [ ] All test cases pass

---

### 6.3 Feature: API Key Management

**User Story:**
As a user, I want to securely store my API key so the extension can authenticate with Rival's API.

**Technical Requirements:**

1. **Storage Implementation:**
   ```javascript
   // utils/storage.js

   /**
    * Save API key to secure storage
    */
   async function saveApiKey(apiKey) {
     await chrome.storage.local.set({ apiKey: apiKey });
   }

   /**
    * Retrieve API key from storage
    */
   async function getApiKey() {
     const result = await chrome.storage.local.get('apiKey');
     return result.apiKey || null;
   }

   /**
    * Remove API key from storage
    */
   async function clearApiKey() {
     await chrome.storage.local.remove('apiKey');
   }
   ```

2. **Settings Tab UI:**
   - Password input field (type="password")
   - Show/hide toggle (eye icon)
   - Auto-save on blur (no save button)
   - Visual feedback when saved (brief green checkmark animation)

3. **Input Validation:**
   - API key must not be empty
   - Trim whitespace
   - Show error if invalid format (if there's a known format)

4. **Security Considerations:**
   - Use chrome.storage.local (not sessionStorage or localStorage from web context)
   - Never log API key to console
   - Never send API key except in Authorization header to Rival API
   - Mask display by default

**Settings Tab Implementation:**

```javascript
// popup/components/settings-tab.js

class SettingsTab {
  constructor() {
    this.apiKeyInput = document.getElementById('apiKey');
    this.showKeyToggle = document.getElementById('showKeyToggle');
    this.baseUrlInput = document.getElementById('baseUrl');

    this.init();
  }

  async init() {
    // Load saved values
    await this.loadSettings();

    // Auto-save on blur
    this.apiKeyInput.addEventListener('blur', () => this.saveApiKey());
    this.baseUrlInput.addEventListener('blur', () => this.saveBaseUrl());

    // Show/hide toggle
    this.showKeyToggle.addEventListener('click', () => this.toggleKeyVisibility());
  }

  async loadSettings() {
    const apiKey = await getApiKey();
    const baseUrl = await getBaseUrl();

    if (apiKey) {
      this.apiKeyInput.value = apiKey;
    }

    if (baseUrl) {
      this.baseUrlInput.value = baseUrl;
    } else {
      // Set default
      this.baseUrlInput.value = 'https://cortexconnect.rival.io';
    }
  }

  async saveApiKey() {
    const apiKey = this.apiKeyInput.value.trim();

    if (!apiKey) {
      this.showError('API key cannot be empty');
      return;
    }

    await saveApiKey(apiKey);
    this.showSuccess('API key saved');
  }

  async saveBaseUrl() {
    const baseUrl = this.baseUrlInput.value.trim();

    if (!baseUrl.startsWith('https://')) {
      this.showError('Base URL must use HTTPS');
      return;
    }

    await saveBaseUrl(baseUrl);
    this.showSuccess('Base URL saved');
  }

  toggleKeyVisibility() {
    const isPassword = this.apiKeyInput.type === 'password';
    this.apiKeyInput.type = isPassword ? 'text' : 'password';
    this.showKeyToggle.textContent = isPassword ? '🙈' : '👁️';
  }

  showSuccess(message) {
    // Show brief green checkmark animation
    // Auto-hide after 2 seconds
  }

  showError(message) {
    // Show error message in red
  }
}
```

**Acceptance Criteria:**
- [ ] API key saved to chrome.storage.local
- [ ] API key persists across browser restarts
- [ ] API key is masked by default (type="password")
- [ ] Show/hide toggle works correctly
- [ ] Auto-save triggers on blur
- [ ] Visual feedback shown when saved
- [ ] Empty values show error and don't save
- [ ] Whitespace is trimmed before saving

---

### 6.4 Feature: Confirmation Dialog

**User Story:**
As a user, I want to review and approve each function execution before it runs, similar to how MetaMask requires transaction confirmation.

**Technical Requirements:**

1. **Trigger Conditions:**
   - Every time a `web+rival://` URL is intercepted
   - Before any API call to Rival is made
   - Cannot be bypassed (no "auto-approve" setting)

2. **Dialog Contents:**
   - Function ID
   - Version
   - Path (if present)
   - Full endpoint URL that will be called
   - Request payload (formatted JSON)
   - Estimated cost (future: from API, now: fixed $0.001)
   - Two buttons: Reject and Confirm

3. **Implementation:**

   ```javascript
   // popup/components/confirm-dialog.js

   class ConfirmDialog {
     constructor() {
       this.isOpen = false;
       this.resolvePromise = null;
       this.rejectPromise = null;

       this.createDialog();
     }

     createDialog() {
       // Create modal overlay and dialog box in DOM
       // Hidden by default (display: none)
     }

     /**
      * Show confirmation dialog and wait for user response
      * @param {Object} details - Function execution details
      * @returns {Promise<boolean>} - true if confirmed, false if rejected
      */
     show(details) {
       return new Promise((resolve, reject) => {
         this.resolvePromise = resolve;
         this.rejectPromise = reject;

         // Populate dialog with details
         this.populateDialog(details);

         // Show dialog
         this.isOpen = true;
         this.dialog.style.display = 'block';

         // Start 60-second countdown
         this.startCountdown();
       });
     }

     populateDialog(details) {
       document.getElementById('confirmFunctionId').textContent = details.functionId;
       document.getElementById('confirmVersion').textContent = details.version;
       document.getElementById('confirmPath').textContent = details.path || 'N/A';
       document.getElementById('confirmEndpoint').textContent = details.endpoint;
       document.getElementById('confirmPayload').textContent =
         JSON.stringify(details.payload, null, 2);
     }

     confirm() {
       this.close();
       this.resolvePromise(true);
     }

     reject() {
       this.close();
       this.resolvePromise(false);
     }

     close() {
       this.isOpen = false;
       this.dialog.style.display = 'none';
       this.clearCountdown();
     }

     startCountdown() {
       let seconds = 60;
       this.countdownInterval = setInterval(() => {
         seconds--;
         document.getElementById('countdown').textContent = `Auto-closing in ${seconds}s`;

         if (seconds <= 0) {
           this.reject(); // Auto-reject if timeout
         }
       }, 1000);
     }

     clearCountdown() {
       if (this.countdownInterval) {
         clearInterval(this.countdownInterval);
       }
     }
   }

   // Singleton instance
   const confirmDialog = new ConfirmDialog();

   // Keyboard shortcuts
   document.addEventListener('keydown', (e) => {
     if (!confirmDialog.isOpen) return;

     if (e.key === 'Escape') {
       confirmDialog.reject();
     } else if (e.key === 'Enter') {
       confirmDialog.confirm();
     }
   });
   ```

4. **Usage in Background Script:**

   ```javascript
   // background.js

   chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
     if (!details.url.startsWith('web+rival://')) return;

     // Parse URL
     const parsed = parseProtocolUrl(details.url);
     const payload = buildPayload(parsed);
     const baseUrl = await getBaseUrl();
     const endpoint = `${baseUrl}/functions/${parsed.functionId}/${parsed.version}/invoke`;

     // Show confirmation dialog
     const confirmed = await confirmDialog.show({
       functionId: parsed.functionId,
       version: parsed.version,
       path: parsed.path,
       endpoint: endpoint,
       payload: payload
     });

     if (confirmed) {
       // Execute function
       await executeFunction(parsed, payload);
     } else {
       // User rejected
       console.log('User rejected function execution');
     }
   });
   ```

**Acceptance Criteria:**
- [ ] Dialog appears for every `web+rival://` URL
- [ ] Dialog shows all required information clearly
- [ ] Reject button closes dialog without executing
- [ ] Confirm button proceeds with execution
- [ ] ESC key triggers reject
- [ ] Enter key triggers confirm
- [ ] Dialog auto-closes after 60 seconds (rejecting)
- [ ] Countdown timer is visible
- [ ] Dialog cannot be bypassed
- [ ] Modal overlay prevents interaction with background

---

### 6.5 Feature: Function Execution

**User Story:**
As a user, after confirming execution, I want the extension to call the Rival API and execute the function.

**Technical Requirements:**

1. **API Endpoint:**
   ```
   POST {baseUrl}/functions/{functionId}/{version}/invoke
   ```

2. **Request Format:**
   ```
   Headers:
     Authorization: Bearer {apiKey}
     Content-Type: application/json

   Body:
     {
       "web": true,
       "path": "optional/path"  // only if path present
     }
   ```

3. **Implementation:**

   ```javascript
   // utils/api.js

   /**
    * Execute a Rival function
    * @param {Object} params - Function parameters
    * @param {Object} payload - Request payload
    * @returns {Promise<Object>} - API response
    */
   async function executeFunction(params, payload) {
     const apiKey = await getApiKey();
     const baseUrl = await getBaseUrl();

     if (!apiKey) {
       throw new Error('API key not configured. Please add your API key in Settings.');
     }

     const url = `${baseUrl}/functions/${params.functionId}/${params.version}/invoke`;

     const response = await fetch(url, {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${apiKey}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(payload)
     });

     if (!response.ok) {
       const error = await response.json();
       throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
     }

     const result = await response.json();
     return result;
   }
   ```

4. **Error Handling:**
   - 401 Unauthorized: Show "Invalid API key" error
   - 404 Not Found: Show "Function not found" error
   - 500 Server Error: Show "Server error, please try again"
   - Network error: Show "Network error, check connection"

5. **Success Handling:**
   - Log transaction with "success" status
   - Show success notification
   - If response contains redirect URL, navigate to it
   - If response contains data, display it (or store for viewing)

**Acceptance Criteria:**
- [ ] API call made with correct endpoint
- [ ] Authorization header includes API key
- [ ] Request body matches payload format
- [ ] Success responses logged correctly
- [ ] Error responses show user-friendly messages
- [ ] Network errors handled gracefully
- [ ] Transaction logged before execution (status: pending)
- [ ] Transaction updated after execution (status: success/failed)

---

### 6.6 Feature: Transaction Logging

**User Story:**
As a user, I want to see a history of all function executions so I can audit and troubleshoot.

**Technical Requirements:**

1. **Data Structure:**
   ```javascript
   {
     id: 'uuid-v4-string',
     timestamp: 1703001600000,  // Unix timestamp
     functionId: 'checkout-func',
     version: '1.0.0',
     path: 'process',  // or null
     payload: { web: true, path: 'process' },
     status: 'success',  // or 'failed', 'pending'
     response: { ... },  // API response object
     error: null,  // or error message if failed
     executionTime: 142  // milliseconds
   }
   ```

2. **Storage:**
   - Store in chrome.storage.local under key "transactions"
   - Array of transaction objects
   - Limit to last 100 transactions (auto-prune older ones)

3. **Logger Implementation:**

   ```javascript
   // utils/logger.js

   /**
    * Create a new transaction log entry
    */
   async function logTransaction(params, payload) {
     const transaction = {
       id: generateUUID(),
       timestamp: Date.now(),
       functionId: params.functionId,
       version: params.version,
       path: params.path,
       payload: payload,
       status: 'pending',
       response: null,
       error: null,
       executionTime: null
     };

     // Get existing transactions
     const { transactions = [] } = await chrome.storage.local.get('transactions');

     // Add new transaction at beginning
     transactions.unshift(transaction);

     // Keep only last 100
     if (transactions.length > 100) {
       transactions.length = 100;
     }

     // Save
     await chrome.storage.local.set({ transactions });

     return transaction.id;
   }

   /**
    * Update transaction with result
    */
   async function updateTransaction(id, status, response = null, error = null, executionTime = null) {
     const { transactions = [] } = await chrome.storage.local.get('transactions');

     const transaction = transactions.find(t => t.id === id);
     if (transaction) {
       transaction.status = status;
       transaction.response = response;
       transaction.error = error;
       transaction.executionTime = executionTime;

       await chrome.storage.local.set({ transactions });
     }
   }

   /**
    * Get all transactions
    */
   async function getTransactions() {
     const { transactions = [] } = await chrome.storage.local.get('transactions');
     return transactions;
   }

   /**
    * Clear all transactions
    */
   async function clearTransactions() {
     await chrome.storage.local.set({ transactions: [] });
   }
   ```

4. **Usage:**

   ```javascript
   // In execution flow

   // Before execution
   const txId = await logTransaction(parsed, payload);

   const startTime = Date.now();

   try {
     // Execute function
     const response = await executeFunction(parsed, payload);
     const executionTime = Date.now() - startTime;

     // Update log with success
     await updateTransaction(txId, 'success', response, null, executionTime);

   } catch (error) {
     const executionTime = Date.now() - startTime;

     // Update log with failure
     await updateTransaction(txId, 'failed', null, error.message, executionTime);
   }
   ```

5. **Transaction Log Tab Display:**
   - Load all transactions on tab open
   - Display in reverse chronological order (newest first)
   - Format timestamp as human-readable date/time
   - Color code by status (green=success, red=failed, orange=pending)
   - Click to expand and see full details

**Acceptance Criteria:**
- [ ] Every execution creates a transaction log entry
- [ ] Transaction logged before execution (status: pending)
- [ ] Transaction updated after execution with status and result
- [ ] Transactions persisted in storage
- [ ] Maximum 100 transactions kept (older pruned)
- [ ] Transaction log tab displays all transactions
- [ ] Transactions sorted by timestamp (newest first)
- [ ] Clicking transaction shows full details
- [ ] Search and filter work correctly

---

### 6.7 Feature: Balance Display

**User Story:**
As a user, I want to see my account balance prominently displayed in the extension.

**Technical Requirements:**

1. **Initial Implementation (MVP):**
   - Fixed value: $100.00
   - Displayed at top of popup, below header
   - Formatted as currency: `$100.00`
   - Icon: 💵 or $ symbol

2. **Display Component:**
   ```javascript
   // popup/components/balance-display.js

   class BalanceDisplay {
     constructor() {
       this.balanceElement = document.getElementById('balance');
       this.init();
     }

     async init() {
       await this.loadBalance();
     }

     async loadBalance() {
       // For now, fixed at $100
       const balance = 100.00;

       // Format as currency
       const formatted = new Intl.NumberFormat('en-US', {
         style: 'currency',
         currency: 'USD'
       }).format(balance);

       this.balanceElement.textContent = formatted;
     }
   }
   ```

3. **Future Enhancement (Phase 2):**
   - Fetch real balance from API
   - Endpoint: `GET {baseUrl}/account/balance`
   - Refresh on popup open
   - Show loading state while fetching
   - Cache for 5 minutes to reduce API calls

**Acceptance Criteria:**
- [ ] Balance displayed as $100.00
- [ ] Formatted with proper currency symbol and decimals
- [ ] Positioned prominently at top of popup
- [ ] Styled according to design specifications
- [ ] (Future) Real-time balance fetching implemented

---

## 7. API Integration

### 7.1 Rival API Specification

**Base URL:**
```
https://cortexconnect.rival.io
```

**Authentication:**
```
All requests require Bearer token authentication
Header: Authorization: Bearer {apiKey}
```

### 7.2 Endpoint: Invoke Function

**Request:**
```
POST /functions/{functionId}/{version}/invoke

Headers:
  Authorization: Bearer {apiKey}
  Content-Type: application/json

Body:
  {
    "web": true,
    "path": "optional/path"  // only include if path present
  }
```

**Response (Success):**
```json
{
  "success": true,
  "result": {
    // Function-specific response data
  },
  "executionTime": 142,
  "cost": 0.001
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": {
    "code": "FUNCTION_ERROR",
    "message": "Detailed error message"
  }
}
```

**Status Codes:**
- 200: Success
- 400: Bad Request (invalid payload)
- 401: Unauthorized (invalid API key)
- 404: Not Found (function doesn't exist)
- 500: Internal Server Error

### 7.3 Future Endpoints (Not Implemented Yet)

**Get Account Balance:**
```
GET /account/balance

Response:
{
  "balance": 100.00,
  "currency": "USD"
}
```

**Get Function Details:**
```
GET /functions/{functionId}

Response:
{
  "id": "abc-123",
  "name": "Checkout Function",
  "versions": ["Draft", "1.0.0", "2.0.0"],
  "description": "..."
}
```

---

## 8. Data Models

### 8.1 Storage Schema

All data stored in `chrome.storage.local`:

```javascript
{
  // Settings
  "apiKey": "sk_live_abc123...",  // String, user's API key
  "baseUrl": "https://cortexconnect.rival.io",  // String, API base URL
  "protocolRegistered": true,  // Boolean, protocol handler status

  // Transactions
  "transactions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",  // UUID v4
      "timestamp": 1703001600000,  // Unix timestamp (milliseconds)
      "functionId": "checkout-func",  // String
      "version": "1.0.0",  // String
      "path": "process",  // String or null
      "payload": {  // Object
        "web": true,
        "path": "process"
      },
      "status": "success",  // "pending" | "success" | "failed"
      "response": {  // Object or null
        "success": true,
        "result": { ... }
      },
      "error": null,  // String or null
      "executionTime": 142  // Number (milliseconds) or null
    }
  ]
}
```

### 8.2 TypeScript Type Definitions (Reference)

```typescript
// types.ts

interface Settings {
  apiKey: string | null;
  baseUrl: string;
  protocolRegistered: boolean;
}

interface Transaction {
  id: string;
  timestamp: number;
  functionId: string;
  version: string;
  path: string | null;
  payload: FunctionPayload;
  status: 'pending' | 'success' | 'failed';
  response: FunctionResponse | null;
  error: string | null;
  executionTime: number | null;
}

interface FunctionPayload {
  web: true;
  path?: string;
}

interface FunctionResponse {
  success: boolean;
  result?: any;
  executionTime?: number;
  cost?: number;
  error?: {
    code: string;
    message: string;
  };
}

interface ParsedUrl {
  functionId: string;
  version: string;
  path: string | null;
}
```

---

## 9. Security Requirements

### 9.1 API Key Security

**Requirements:**
1. **Storage:** Use chrome.storage.local (encrypted by browser)
2. **Transmission:** Only send in Authorization header over HTTPS
3. **Display:** Mask by default (password input type)
4. **Logging:** Never log to console or error messages
5. **Scope:** Never expose to web pages (extension-only access)

**Implementation Checklist:**
- [ ] API key stored in chrome.storage.local
- [ ] API key never logged to console
- [ ] API key only sent to Rival API endpoints
- [ ] Input field uses type="password"
- [ ] Show/hide toggle for user convenience
- [ ] Clear data function completely removes key

### 9.2 Content Security Policy

**manifest.json:**
```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'"
  }
}
```

**Purpose:**
- Prevent XSS attacks
- Only allow scripts from extension package
- No inline scripts or eval()

### 9.3 Permissions Minimization

**Only Request Necessary Permissions:**
- `storage`: For saving settings and transactions
- `webNavigation`: For protocol handler interception
- `tabs`: For managing execution context

**Do NOT request:**
- `cookies`: Not needed
- `history`: Not needed
- `bookmarks`: Not needed
- Excessive host permissions beyond Rival API

### 9.4 HTTPS Enforcement

**Requirements:**
- Only accept HTTPS base URLs
- Validate user input in baseUrl field
- Reject HTTP URLs (except localhost for development)

```javascript
function validateBaseUrl(url) {
  if (!url.startsWith('https://')) {
    // Allow localhost for development
    if (!url.startsWith('http://localhost') && !url.startsWith('http://127.0.0.1')) {
      throw new Error('Base URL must use HTTPS');
    }
  }
  return true;
}
```

### 9.5 User Confirmation Requirement

**Requirements:**
- Every function execution MUST show confirmation dialog
- No auto-approve or "trust this function" feature
- Dialog cannot be bypassed programmatically
- Timeout auto-rejects (doesn't auto-approve)

---

## 10. User Flows

### 10.1 Flow: First-Time Setup

```
┌─────────────────────────────────────────┐
│ User installs extension                 │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ User clicks extension icon              │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Extension checks if protocol registered │
└────────────┬────────────────────────────┘
             │
             ▼
        [Not Registered]
             │
             ▼
┌─────────────────────────────────────────┐
│ Show welcome screen                     │
│ "Register web+rival:// handler?"        │
└────────────┬────────────────────────────┘
             │
             ▼
      [User clicks Register]
             │
             ▼
┌─────────────────────────────────────────┐
│ Browser shows permission dialog         │
│ "Allow Rival Extension to handle        │
│  web+rival:// links?"                   │
└────────────┬────────────────────────────┘
             │
             ▼
       [User clicks Allow]
             │
             ▼
┌─────────────────────────────────────────┐
│ Extension registers protocol handler    │
│ Saves status to storage                 │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Show success message                    │
│ "Setup complete! Add your API key."     │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Navigate to Settings tab automatically  │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ User enters API key                     │
│ Extension auto-saves on blur            │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Setup Complete - Ready to use           │
└─────────────────────────────────────────┘
```

### 10.2 Flow: Execute Function via Link

```
┌─────────────────────────────────────────┐
│ User browsing website                   │
│ Sees link: "Process Checkout"          │
│ href="web+rival://checkout?v=1.0.0"    │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ User clicks link                        │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Browser recognizes web+rival:// protocol│
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Browser triggers protocol handler       │
│ Sends to extension                      │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Extension background.js intercepts      │
│ Parses URL: functionId, version, path  │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Extension checks for API key            │
└────────────┬────────────────────────────┘
             │
        ┌────┴─────┐
        │          │
   [No Key]   [Has Key]
        │          │
        ▼          ▼
   ┌────────┐  ┌──────────────────────────┐
   │ Show   │  │ Build payload:           │
   │ error: │  │ {web: true, path: "..."} │
   │ "Setup │  └──────────┬───────────────┘
   │  API   │             │
   │  key"  │             ▼
   └────────┘  ┌──────────────────────────┐
               │ Open confirmation dialog │
               │ Show:                    │
               │ - Function ID            │
               │ - Version                │
               │ - Path                   │
               │ - Payload                │
               │ - Endpoint URL           │
               └──────────┬───────────────┘
                          │
                    ┌─────┴──────┐
                    │            │
              [Reject]      [Confirm]
                    │            │
                    ▼            ▼
          ┌─────────────┐  ┌─────────────────┐
          │ Close dialog│  │ Log transaction │
          │ Do nothing  │  │ (status:pending)│
          └─────────────┘  └────────┬────────┘
                                    │
                                    ▼
                          ┌─────────────────┐
                          │ POST to Rival   │
                          │ API with payload│
                          └────────┬────────┘
                                   │
                              ┌────┴─────┐
                              │          │
                         [Success]   [Error]
                              │          │
                              ▼          ▼
                    ┌──────────────┐  ┌──────────┐
                    │ Update log   │  │ Update   │
                    │ (success)    │  │ log      │
                    │              │  │ (failed) │
                    │ Show success │  │          │
                    │ notification │  │ Show err │
                    └──────────────┘  └──────────┘
```

### 10.3 Flow: View Transaction History

```
┌─────────────────────────────────────────┐
│ User clicks extension icon              │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Extension popup opens                   │
│ Settings tab active by default          │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ User clicks "Transaction Log" tab       │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Extension loads transactions from       │
│ chrome.storage.local                    │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Display transactions in reverse         │
│ chronological order (newest first)      │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ User sees list of transaction cards     │
│ Each shows:                             │
│ - Status icon (✅ ❌ ⏳)                │
│ - Function ID                           │
│ - Version & Path                        │
│ - Timestamp                             │
│ - Duration or Error                     │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ User clicks a transaction card          │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Card expands to show full details:      │
│ - Full request payload (JSON)           │
│ - Full response data (JSON)             │
│ - Error details (if failed)             │
│ - Copy payload button                   │
│ - Re-execute button                     │
└─────────────────────────────────────────┘
```

---

## 11. Development Requirements

### 11.1 Code Quality Standards

**JavaScript:**
- Use ES6+ syntax (const/let, arrow functions, async/await)
- No var declarations
- Use strict mode
- Consistent code formatting (Prettier recommended)
- ESLint for code quality

**CSS:**
- Use CSS custom properties for theming
- Mobile-first responsive design (even though it's an extension)
- BEM naming convention or similar
- No !important unless absolutely necessary

**Comments:**
- JSDoc comments for all public functions
- Inline comments for complex logic
- TODO comments for future enhancements

### 11.2 File Organization

**Separation of Concerns:**
- Background script handles protocol interception and API calls
- Popup scripts handle UI interactions
- Utils modules for reusable logic
- Components are self-contained

**Module System:**
- Use ES6 modules (import/export)
- No global variables (except where required by Chrome APIs)

### 11.3 Error Handling

**Requirements:**
- Try/catch blocks around all async operations
- User-friendly error messages (no raw stack traces)
- Log errors to console for debugging (but not sensitive data)
- Show errors in UI with actionable guidance

**Example:**
```javascript
try {
  await executeFunction(params, payload);
} catch (error) {
  if (error.message.includes('401')) {
    showError('Invalid API key. Please check your settings.');
  } else if (error.message.includes('404')) {
    showError('Function not found. Check the function ID and version.');
  } else {
    showError(`Execution failed: ${error.message}`);
  }

  console.error('Function execution error:', error);
}
```

### 11.4 Performance Considerations

**Loading Speed:**
- Minimize popup load time (< 300ms)
- Lazy load transaction log data
- Cache settings in memory after first load

**Storage Efficiency:**
- Limit transaction log to 100 entries
- Prune old transactions automatically
- Don't store unnecessary data

**API Efficiency:**
- No polling (event-driven only)
- Rate limiting on balance fetches (future)
- Cache balance for 5 minutes (future)

### 11.5 Browser Compatibility

**Target Browsers:**
- Chrome 88+ (latest Manifest V3 support)
- Edge 88+ (Chromium-based)

**Testing Required:**
- Test on both Chrome and Edge
- Test on Windows, Mac, and Linux
- Test with different screen sizes (popup)

---

## 12. Testing & QA

### 12.1 Unit Tests

**Test Coverage Requirements:**
- Minimum 80% code coverage
- All utility functions must have tests
- Parser functions especially critical

**Example Tests:**

```javascript
// tests/parser.test.js
describe('parseProtocolUrl', () => {
  test('parses basic URL', () => {
    const result = parseProtocolUrl('web+rival://func?v=1.0.0');
    expect(result).toEqual({
      functionId: 'func',
      version: '1.0.0',
      path: null
    });
  });

  test('parses URL with path', () => {
    const result = parseProtocolUrl('web+rival://func?v=1.0.0/admin');
    expect(result).toEqual({
      functionId: 'func',
      version: '1.0.0',
      path: 'admin'
    });
  });

  test('throws error for invalid URL', () => {
    expect(() => {
      parseProtocolUrl('web+rival://invalid');
    }).toThrow('Invalid URL format');
  });
});

// tests/api.test.js
describe('executeFunction', () => {
  test('makes correct API call', async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true })
      })
    );

    // Mock storage
    chrome.storage.local.get = jest.fn((keys, cb) => {
      cb({ apiKey: 'test-key', baseUrl: 'https://test.rival.io' });
    });

    const result = await executeFunction(
      { functionId: 'test', version: '1.0' },
      { web: true }
    );

    expect(fetch).toHaveBeenCalledWith(
      'https://test.rival.io/functions/test/1.0/invoke',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-key'
        })
      })
    );
  });
});
```

### 12.2 Integration Tests

**Test Scenarios:**
1. Protocol handler registration flow
2. Complete execution flow (URL → API → log)
3. Settings save and load
4. Transaction logging and retrieval
5. Error handling paths

### 12.3 Manual Testing Checklist

**Installation:**
- [ ] Extension loads without errors
- [ ] Icons display correctly
- [ ] Protocol registration prompt appears on first launch
- [ ] Protocol registers successfully

**Settings Tab:**
- [ ] API key input saves correctly
- [ ] API key persists after browser restart
- [ ] Show/hide toggle works
- [ ] Base URL saves correctly
- [ ] Base URL validation works (rejects HTTP)
- [ ] Protocol status displays correctly
- [ ] Clear data button works

**Transaction Log Tab:**
- [ ] Empty state displays when no transactions
- [ ] Transactions display after execution
- [ ] Newest transactions appear first
- [ ] Success status shows green checkmark
- [ ] Failed status shows red X
- [ ] Clicking transaction expands details
- [ ] Search filters correctly
- [ ] Filter dropdown works

**Function Execution:**
- [ ] Clicking web+rival:// link opens extension
- [ ] Confirmation dialog shows correct details
- [ ] Reject button cancels execution
- [ ] Confirm button proceeds with execution
- [ ] ESC key rejects
- [ ] Enter key confirms
- [ ] Timeout auto-rejects after 60s
- [ ] Countdown timer displays
- [ ] Successful execution logs correctly
- [ ] Failed execution shows error
- [ ] API key missing shows appropriate error

**Error Scenarios:**
- [ ] Missing API key handled gracefully
- [ ] Invalid API key (401) shows clear error
- [ ] Function not found (404) shows clear error
- [ ] Network error handled gracefully
- [ ] Malformed URL shows error

### 12.4 Performance Testing

**Metrics:**
- [ ] Popup opens in < 300ms
- [ ] Transaction log loads in < 500ms
- [ ] API calls complete in reasonable time (< 3s typical)
- [ ] No memory leaks (test with 100+ executions)
- [ ] Storage doesn't exceed quota

---

## 13. Acceptance Criteria

### 13.1 MVP Feature Checklist

**Core Features:**
- [ ] Extension installs successfully in Chrome/Edge
- [ ] Protocol handler `web+rival://` registers on first launch
- [ ] Users can enter and save API key in Settings
- [ ] Users can set custom base URL
- [ ] Balance displays $100.00
- [ ] Clicking `web+rival://` link triggers extension
- [ ] Confirmation dialog appears before every execution
- [ ] Function executes successfully when confirmed
- [ ] Execution rejected when user clicks Reject
- [ ] All executions logged in Transaction Log
- [ ] Transaction Log displays with correct details
- [ ] Search and filter work in Transaction Log

**Design Requirements:**
- [ ] Rival branding applied (colors, logo from cortexone.rival.io)
- [ ] Popup is 360x600px
- [ ] Layout matches specifications
- [ ] Two tabs (Settings and Transaction Log) implemented
- [ ] Confirmation dialog matches MetaMask style
- [ ] All components styled per design specs

**Technical Requirements:**
- [ ] Manifest V3 used
- [ ] All permissions justified and minimal
- [ ] API key stored securely
- [ ] HTTPS enforced for base URL
- [ ] Protocol parser handles all URL formats correctly
- [ ] Error handling implemented for all API calls
- [ ] Transactions limited to 100 (auto-pruned)
- [ ] No console errors in normal operation

**Security Requirements:**
- [ ] API key never logged
- [ ] API key only sent to Rival API
- [ ] Confirmation required for all executions
- [ ] Content Security Policy implemented
- [ ] No XSS vulnerabilities
- [ ] Input validation on all user inputs

### 13.2 Testing Checklist

- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing checklist completed
- [ ] Tested on Chrome (latest)
- [ ] Tested on Edge (latest)
- [ ] Tested on Windows
- [ ] Tested on Mac
- [ ] No memory leaks detected
- [ ] Performance metrics met

### 13.3 Documentation Checklist

- [ ] README.md created with installation instructions
- [ ] Code comments added to all public functions
- [ ] API integration documented
- [ ] User guide created (how to use)
- [ ] Developer guide created (how to modify/extend)

---

## 14. Future Enhancements (Out of Scope for MVP)

**Phase 2:**
- Real USD balance from API
- Export transaction log (CSV/JSON)
- Dark mode support
- Notification preferences

**Phase 3:**
- Multi-account support
- Function favorites/bookmarks
- Gas estimation before execution
- Analytics dashboard

**Phase 4:**
- Team collaboration features
- Role-based access control
- SSO integration
- White-label customization

---

## 15. Appendix

### 15.1 Glossary

- **Protocol Handler**: Browser feature that allows custom URL schemes (e.g., `web+rival://`)
- **Service Worker**: Background script in Manifest V3 extensions
- **chrome.storage.local**: Browser-provided encrypted storage for extensions
- **Bearer Token**: Authorization method using API key in header
- **MetaMask**: Popular crypto wallet extension (used as UX reference)

### 15.2 References

- [Chrome Extension Manifest V3 Documentation](https://developer.chrome.com/docs/extensions/mv3/)
- [Web Navigation API](https://developer.chrome.com/docs/extensions/reference/webNavigation/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Protocol Handler Registration](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler)

### 15.3 Contact & Support

- **Project Lead**: [Name]
- **Repository**: [GitHub URL]
- **Issues**: [GitHub Issues URL]
- **Documentation**: [Docs URL]

---

**Document Version:** 1.0
**Last Updated:** January 2025
**Status:** Ready for Development
**Estimated Development Time:** 2-3 weeks for MVP

---

## Ready to Build?

This specification contains everything needed to build the Rival Web Extension from scratch. Developers should:

1. Set up project structure as outlined
2. Implement features in order: Protocol → Storage → UI → Execution → Logging
3. Write tests as you go
4. Follow design specifications exactly
5. Test thoroughly before release

Good luck! 🚀
