chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    installedAt: new Date().toISOString(),
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'CIPA_FETCH_JSON') return false;

  fetchJson(message)
    .then((payload) => sendResponse({ ok: true, payload }))
    .catch((error) => sendResponse({ ok: false, error: error.message || String(error) }));

  return true;
});

async function fetchJson(message) {
  const url = new URL(message.url);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('Unsupported API URL protocol');
  }

  const response = await fetch(message.url, {
    method: message.method || 'POST',
    headers: message.headers || { 'Content-Type': 'application/json' },
    body: message.body,
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${text.slice(0, 300)}`);
  }

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error('API returned non-JSON response');
  }
}
