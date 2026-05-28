(function () {
  const key = 'ak_settings';
  const defaults = {
    apiUrl: 'https://image-prompt.alluser.site/api/image-prompt',
    modelName: '',
    apiKey: 'gudgns0411skaluv2018tjdbs130429',
  };

  chrome.storage.local.get([key], (stored) => {
    const settings = { ...defaults, ...(stored[key] || {}) };
    document.getElementById('apiUrl').value = settings.apiUrl;
    document.getElementById('modelName').value = settings.modelName;
    document.getElementById('apiKey').value = settings.apiKey;
  });

  document.getElementById('save').addEventListener('click', () => {
    chrome.storage.local.set({
      [key]: {
        apiUrl: document.getElementById('apiUrl').value.trim() || defaults.apiUrl,
        modelName: document.getElementById('modelName').value.trim(),
        apiKey: document.getElementById('apiKey').value.trim(),
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
