// Background service worker for Rival-WebWidget Chrome Extension

// Listen for when a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the URL is being updated and starts with web+rival://
  if (changeInfo.url && changeInfo.url.startsWith('web+rival://')) {
    handleRivalUrl(tabId, changeInfo.url);
  }
});

// Listen for web navigation events to catch web+rival:// URLs before they fail
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.url.startsWith('web+rival://')) {
    handleRivalUrl(details.tabId, details.url);
  }
});

// Handle web+rival:// protocol URLs
function handleRivalUrl(tabId, url) {
  try {
    // Parse the web+rival:// URL
    // Format: web+rival://functionId/version=Draft
    // Remove the web+rival:// prefix
    let urlPath = url.replace(/^web\+rival:\/\//, '');

    // Split by / to get functionId and version part
    const parts = urlPath.split('/');
    const functionId = parts[0];

    if (!functionId) {
      console.error('No function ID provided in rival:// URL');
      return;
    }

    // Build the launcher URL with parameters
    const params = new URLSearchParams();
    params.set('functionId', functionId);

    // Check for version in the path (format: /version=Draft)
    if (parts.length > 1) {
      const versionPart = parts[1];
      if (versionPart.startsWith('version=')) {
        const version = versionPart.substring(8); // Remove 'version=' prefix
        if (version) {
          params.set('version', version);
        }
      }
    }

    // Auto-load by default when using rival:// URLs
    params.set('autoload', 'true');

    // Redirect to launcher page
    const launcherUrl = chrome.runtime.getURL('launcher.html') + '?' + params.toString();

    chrome.tabs.update(tabId, { url: launcherUrl }, () => {
      console.log(`Redirected web+rival:// URL to launcher: ${launcherUrl}`);
    });
  } catch (error) {
    console.error('Error handling web+rival:// URL:', error);
  }
}

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openFunction') {
    // Open a new tab with the function
    const params = new URLSearchParams({
      functionId: request.functionId,
      autoload: 'true'
    });

    if (request.baseUrl) params.set('baseUrl', request.baseUrl);
    if (request.version) params.set('version', request.version);

    const launcherUrl = chrome.runtime.getURL('launcher.html') + '?' + params.toString();

    chrome.tabs.create({ url: launcherUrl }, (tab) => {
      sendResponse({ success: true, tabId: tab.id });
    });

    return true; // Keep the message channel open for async response
  }
});

console.log('Rival-WebWidget background service worker loaded');
