(function () {
  const key = 'settings';
  const defaults = {
    apiUrl: 'https://image-prompt.alluser.site/api/image-prompt',
    model: '',
    apiKey: '',
    useExternalApi: false,
  };

  chrome.storage.local.get([key], (stored) => {
    const settings = { ...defaults, ...(stored[key] || {}) };
    document.getElementById('apiUrl').value = settings.apiUrl;
    document.getElementById('modelName').value = settings.model;
    document.getElementById('apiKey').value = settings.apiKey;
    document.getElementById('useExternalApi').checked = Boolean(settings.useExternalApi);
  });

  document.getElementById('save').addEventListener('click', () => {
    chrome.storage.local.set({
      [key]: {
        apiUrl: document.getElementById('apiUrl').value.trim() || defaults.apiUrl,
        model: document.getElementById('modelName').value.trim(),
        apiKey: document.getElementById('apiKey').value.trim(),
        useExternalApi: document.getElementById('useExternalApi').checked,
      },
    }, () => {
      const status = document.getElementById('status');
      status.textContent = '저장했습니다.';
      setTimeout(() => {
        status.textContent = '';
      }, 1800);
    });
  });
})();
