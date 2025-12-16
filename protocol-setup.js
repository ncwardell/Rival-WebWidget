// Protocol Setup Page JavaScript

// Get the extension ID and display the proper URL
const extensionId = chrome.runtime.id;
const baseUrl = `chrome-extension://${extensionId}/launcher.html`;

document.addEventListener('DOMContentLoaded', () => {
    // Display the extension URL
    document.getElementById('extensionUrl').textContent =
        `${baseUrl}?functionId=FUNCTION_ID&version=VERSION&autoload=true`;

    // Add event listener for copy button
    const copyButton = document.querySelector('button[data-action="copy"]');
    if (copyButton) {
        copyButton.addEventListener('click', copyExtensionUrl);
    }

    // Add event listener for register button
    const registerButton = document.querySelector('button[data-action="register"]');
    if (registerButton) {
        registerButton.addEventListener('click', registerProtocol);
    }

    // Add event listener for test button
    const testButton = document.querySelector('button[data-action="test"]');
    if (testButton) {
        testButton.addEventListener('click', testProtocol);
    }

    // Show initial message
    showStatus('ℹ️ Use web+rival:// protocol after registration, or use Chrome Extension URLs for reliable quick access.', 'success');
});

function copyExtensionUrl() {
    const url = `${baseUrl}?functionId=FUNCTION_ID&version=VERSION&autoload=true`;
    navigator.clipboard.writeText(url).then(() => {
        showStatus('✅ URL template copied to clipboard!', 'success');
    }).catch(() => {
        showStatus('❌ Failed to copy. Please copy manually.', 'warning');
    });
}

function registerProtocol() {
    try {
        // Register the web+rival protocol handler
        // Chrome requires the 'web+' prefix for custom protocols
        const handlerUrl = `${baseUrl}?url=%s`;

        if ('registerProtocolHandler' in navigator) {
            navigator.registerProtocolHandler(
                'web+rival',
                handlerUrl,
                'Rival WebWidget'
            );
            showStatus('✅ Protocol handler registered! You can now use web+rival:// URLs. Check chrome://settings/handlers to verify.', 'success');
            const statusDiv = document.getElementById('protocolStatus');
            if (statusDiv) {
                statusDiv.className = 'success';
                statusDiv.textContent = '✅ Protocol registered! Try the test button or use web+rival://functionId/version=Draft in your address bar.';
            }
        } else {
            showStatus('❌ Protocol handler API not supported in this browser.', 'warning');
        }
    } catch (error) {
        showStatus(`❌ Registration failed: ${error.message}`, 'warning');
    }
}

function testProtocol() {
    // Try to open a test web+rival:// URL
    const testUrl = 'web+rival://test-function-id/version=Draft';
    showStatus('🧪 Opening test URL: web+rival://test-function-id/version=Draft', 'success');

    // Open the test URL - if registered, it will redirect to our launcher
    window.location.href = testUrl;

    setTimeout(() => {
        showStatus('ℹ️ If the launcher did not open, click "Register" first and allow the permission.', 'warning');
    }, 2000);
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('status');
    if (statusDiv) {
        statusDiv.className = type;
        statusDiv.innerHTML = message;
        statusDiv.style.display = 'block';
    }
}
