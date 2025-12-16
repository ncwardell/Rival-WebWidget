# Quick Start: Rival WebWidget URLs

## The Simple Way (No Setup Required)

1. **Get Your Extension ID:**
   - Go to `chrome://extensions/`
   - Find "Rival WebWidget"
   - Copy the ID (looks like: `abcdefghijklmnop`)

2. **Create a Bookmark:**
   - Right-click bookmark bar → "Add page"
   - Name: "My Function"
   - URL: `chrome-extension://YOUR_ID_HERE/launcher.html?functionId=51530a93-7d27-4ca0-9feb-190fc76a46e8&version=0.0.3&autoload=true`
   - Replace `YOUR_ID_HERE` with your actual extension ID

3. **Click the Bookmark:**
   - One click loads your function instantly!

## Why web+rival:// Doesn't Work Yet

Chrome requires **manual registration** for custom protocols:

1. Click extension icon
2. Click "Setup Quick Launch URLs" at bottom
3. Click "Register web+rival:// Protocol"
4. **Allow the permission prompt**
5. Now `web+rival://51530a93-7d27-4ca0-9feb-190fc76a46e8/version=0.0.3` will work

## The web+ Prefix is Required

Chrome's security policy **requires** the `web+` prefix for all custom protocols. There's no way around this without:
- OS-level registry changes (Windows)
- Native app integration
- Installing as PWA (still requires web+ prefix)

## Recommended: Just Use Bookmarks

They work immediately, no setup, no prefix needed.
