// Background service worker for Rival-WebWidget Chrome Extension

// Listen for when a tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the URL is being updated and starts with rival://
  if (changeInfo.url && changeInfo.url.startsWith('rival://')) {
    handleRivalUrl(tabId, changeInfo.url);
  }
});

// Listen for web navigation events to catch rival:// URLs before they fail
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  if (details.url.startsWith('rival://')) {
    handleRivalUrl(details.tabId, details.url);
  }
});

// Handle rival:// protocol URLs
function handleRivalUrl(tabId, url) {
  try {
    // Parse the rival:// URL
    // Format: rival://functionId or rival://functionId?baseUrl=xxx&version=xxx
    const urlObj = new URL(url);
    const functionId = urlObj.hostname || urlObj.pathname.replace(/^\/+/, '');

    if (!functionId) {
      console.error('No function ID provided in rival:// URL');
      return;
    }

    // Build the launcher URL with parameters
    const params = new URLSearchParams();
    params.set('functionId', functionId);

    // Check for additional parameters in the URL
    if (urlObj.searchParams.has('baseUrl')) {
      params.set('baseUrl', urlObj.searchParams.get('baseUrl'));
    }
    if (urlObj.searchParams.has('version')) {
      params.set('version', urlObj.searchParams.get('version'));
    }
    if (urlObj.searchParams.has('autoload')) {
      params.set('autoload', urlObj.searchParams.get('autoload'));
    } else {
      // Auto-load by default when using rival:// URLs
      params.set('autoload', 'true');
    }

    // Redirect to launcher page
    const launcherUrl = chrome.runtime.getURL('launcher.html') + '?' + params.toString();

    chrome.tabs.update(tabId, { url: launcherUrl }, () => {
      console.log(`Redirected rival:// URL to launcher: ${launcherUrl}`);
    });
  } catch (error) {
    console.error('Error handling rival:// URL:', error);
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
