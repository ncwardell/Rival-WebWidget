// Configuration key prefix for localStorage
const CONFIG_PREFIX = 'rival_widget_';

// Create floating particles
for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
    document.body.appendChild(particle);
}

// Update time display
let clockInterval;
function updateTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
        timeElement.textContent = timeStr;
    } else {
        // Element no longer exists (page was replaced), clear the interval
        if (clockInterval) {
            clearInterval(clockInterval);
        }
    }
}
clockInterval = setInterval(updateTime, 1000);
updateTime();

// Load saved configuration on page load
window.addEventListener('DOMContentLoaded', () => {
    loadSavedConfig();

    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('functionId')) {
        document.getElementById('functionId').value = urlParams.get('functionId');
    }
    if (urlParams.has('baseUrl')) {
        const baseUrl = urlParams.get('baseUrl');
        const baseUrlSelect = document.getElementById('baseUrl');
        for (let option of baseUrlSelect.options) {
            if (option.value === baseUrl) {
                baseUrlSelect.value = baseUrl;
                break;
            }
        }
    }
    if (urlParams.has('version')) {
        document.getElementById('version').value = urlParams.get('version');
    }
    if (urlParams.has('autoload') && urlParams.get('autoload') === 'true') {
        const apiKey = localStorage.getItem(CONFIG_PREFIX + 'api_key');
        if (apiKey) {
            document.getElementById('apiKey').value = apiKey;
            setTimeout(() => {
                document.getElementById('widgetForm').dispatchEvent(new Event('submit'));
            }, 500);
        }
    }
});

function loadSavedConfig() {
    const savedApiKey = localStorage.getItem(CONFIG_PREFIX + 'api_key');
    const savedFunctionId = localStorage.getItem(CONFIG_PREFIX + 'function_id');
    const savedBaseUrl = localStorage.getItem(CONFIG_PREFIX + 'base_url');
    const savedVersion = localStorage.getItem(CONFIG_PREFIX + 'version');

    if (savedApiKey) document.getElementById('apiKey').value = savedApiKey;
    if (savedFunctionId) document.getElementById('functionId').value = savedFunctionId;
    if (savedBaseUrl) document.getElementById('baseUrl').value = savedBaseUrl;
    if (savedVersion) document.getElementById('version').value = savedVersion;
}

function toggleAdvanced() {
    const section = document.getElementById('advancedSection');
    const button = event.target;

    if (section.classList.contains('active')) {
        section.style.maxHeight = '0px';
        section.style.opacity = '0';
        section.style.paddingTop = '0';
        setTimeout(() => {
            section.classList.remove('active');
        }, 500);
        button.textContent = '⚙️ Advanced Parameters';
    } else {
        section.classList.add('active');
        section.style.display = 'block';
        // Force reflow
        section.offsetHeight;
        section.style.maxHeight = '800px';
        section.style.opacity = '1';
        section.style.paddingTop = '20px';
        button.textContent = '⚙️ Hide Parameters';
    }
}

async function loadFunction(event) {
    event.preventDefault();

    const apiKey = document.getElementById('apiKey').value.trim();
    const functionId = document.getElementById('functionId').value.trim();
    let baseUrl = document.getElementById('baseUrl').value.trim().replace(/\/$/, '');
    const version = document.getElementById('version').value;
    const rememberConfig = document.getElementById('rememberConfig').checked;
    const eventDataRaw = document.getElementById('eventData').value.trim();
    const httpMethod = document.getElementById('httpMethod').value;

    const loadingDiv = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const submitButton = event.target.querySelector('button[type="submit"]');
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');

    errorDiv.classList.remove('active');

    // Parse event data
    let eventData = {};
    if (eventDataRaw) {
        try {
            eventData = JSON.parse(eventDataRaw);
        } catch (err) {
            errorDiv.textContent = 'Error: Invalid JSON in event data';
            errorDiv.classList.add('active');
            return;
        }
    }

    // Save configuration if requested
    if (rememberConfig) {
        localStorage.setItem(CONFIG_PREFIX + 'api_key', apiKey);
        localStorage.setItem(CONFIG_PREFIX + 'function_id', functionId);
        localStorage.setItem(CONFIG_PREFIX + 'base_url', baseUrl);
        localStorage.setItem(CONFIG_PREFIX + 'version', version);
    } else {
        localStorage.removeItem(CONFIG_PREFIX + 'api_key');
        localStorage.removeItem(CONFIG_PREFIX + 'function_id');
        localStorage.removeItem(CONFIG_PREFIX + 'base_url');
        localStorage.removeItem(CONFIG_PREFIX + 'version');
    }

    // Store API credentials for use by loaded function
    localStorage.setItem('rival_api_key', apiKey);
    localStorage.setItem('rival_function_id', functionId);
    localStorage.setItem('rival_base_url', baseUrl);
    localStorage.setItem('rival_version', version);

    // Show loading with progress
    loadingDiv.classList.add('active');
    progressBar.classList.add('active');
    submitButton.disabled = true;

    // Animate progress
    progressFill.style.width = '30%';

    let functionUrl = `${baseUrl}/api/v1/functions/${functionId}/invoke`;

    console.log('[Rival-WebWidget] Original URL:', functionUrl);
    console.log('[Rival-WebWidget] Page protocol:', window.location.protocol);
    console.log('[Rival-WebWidget] Endpoint protocol:', baseUrl.split(':')[0]);

    // Translate HTTP IP to HTTPS domain for mixed content
    // Keep the IP in the UI, but use HTTPS domain behind the scenes
    if (baseUrl === 'http://34.171.49.45:4443') {
        functionUrl = functionUrl.replace('http://34.171.49.45:4443', 'https://rival-internal.secretcult.network');
        console.log('[Rival-WebWidget] Translated IP to HTTPS domain:', functionUrl);
    }

    // Check if translation was applied
    const isPageHttps = window.location.protocol === 'https:';
    const isEndpointHttp = baseUrl.startsWith('http://');

    console.log('[Rival-WebWidget] Is page HTTPS?', isPageHttps);
    console.log('[Rival-WebWidget] Is endpoint HTTP?', isEndpointHttp);

    if (isPageHttps && isEndpointHttp && baseUrl !== 'http://34.171.49.45:4443') {
        // Only show warning if using HTTP endpoint that we can't translate
        errorDiv.textContent = 'Warning: HTTP endpoint detected. Connection may be blocked by browser.';
        errorDiv.style.background = 'rgba(255, 165, 0, 0.1)';
        errorDiv.style.borderColor = '#ffa500';
        errorDiv.style.color = '#ff8800';
        errorDiv.classList.add('active');

        setTimeout(() => {
            errorDiv.classList.remove('active');
            errorDiv.style.background = '';
            errorDiv.style.borderColor = '';
            errorDiv.style.color = '';
        }, 4000);
    } else {
        console.log('[Rival-WebWidget] Connection ready - using HTTPS');
    }

    try {
        const requestBody = {
            version: version,
            event: eventData
        };

        progressFill.style.width = '60%';

        const response = await fetch(functionUrl, {
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey
            },
            body: httpMethod !== 'GET' ? JSON.stringify(requestBody) : undefined
        });

        progressFill.style.width = '90%';

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }

        // Try to parse as JSON first (CortexOne wraps responses)
        let html;
        try {
            const data = await response.json();

            if (data.result && data.result.body) {
                html = data.result.body;
            } else if (data.body) {
                html = data.body;
            } else if (typeof data === 'string') {
                html = data;
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (jsonError) {
            const text = await response.text();

            if (text.trim().startsWith('<') || text.includes('<!DOCTYPE')) {
                html = text;
            } else {
                errorDiv.textContent = 'Error: Function did not return valid HTML';
                errorDiv.classList.add('active');
                loadingDiv.classList.remove('active');
                progressBar.classList.remove('active');
                submitButton.disabled = false;
                return;
            }
        }

        progressFill.style.width = '100%';

        // Small delay for visual feedback
        await new Promise(resolve => setTimeout(resolve, 300));

        // Clear the clock interval before replacing the page
        if (clockInterval) {
            clearInterval(clockInterval);
        }

        // Replace current page with the HTML
        document.open();
        document.write(html);
        document.close();

    } catch (err) {
        console.error('Error:', err);
        loadingDiv.classList.remove('active');
        progressBar.classList.remove('active');
        progressFill.style.width = '0%';
        submitButton.disabled = false;

        let errorMessage = err.message;
        if (isPageHttps && isEndpointHttp) {
            errorMessage += '\n\nNote: Mixed content detected. If the CORS proxy fails, you may need to:\n1. Use the HTTPS endpoint instead, or\n2. Host this page over HTTP (not GitHub Pages)';
        }

        errorDiv.textContent = `Error: ${errorMessage}`;
        errorDiv.classList.add('active');
    }
}

// Global function for loaded functions to call back to the widget
window.RivalWidget = {
    getApiKey: () => localStorage.getItem('rival_api_key'),
    getFunctionId: () => localStorage.getItem('rival_function_id'),
    getBaseUrl: () => localStorage.getItem('rival_base_url'),
    getVersion: () => localStorage.getItem('rival_version'),
    getFunctionUrl: () => {
        const baseUrl = localStorage.getItem('rival_base_url');
        const functionId = localStorage.getItem('rival_function_id');
        let url = `${baseUrl}/api/v1/functions/${functionId}/invoke`;

        // Translate HTTP IP to HTTPS domain for mixed content
        if (baseUrl === 'http://34.171.49.45:4443') {
            url = url.replace('http://34.171.49.45:4443', 'https://rival-internal.secretcult.network');
        }

        return url;
    },
    reload: () => {
        window.location.href = window.location.pathname;
    },
    invokeFunction: async (eventData = {}) => {
        const apiKey = localStorage.getItem('rival_api_key');
        let functionUrl = window.RivalWidget.getFunctionUrl();
        const version = localStorage.getItem('rival_version');

        const response = await fetch(functionUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey
            },
            body: JSON.stringify({
                version: version,
                event: eventData
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    }
};
