if (!localStorage.getItem('language')) {
  localStorage.setItem('language', 'sk');
}

const language = localStorage.getItem('language');
const langSelect = document.getElementById('lang');

async function syncSelectWithStorage() {
  if (!langSelect) return;

  const storedLang = localStorage.getItem('language');
  langSelect.value = storedLang;
}

async function loadLanguage(lang) {
  const response = await fetch(`/locales/${lang}.json`);
  return response.json();
}

async function initializeTranslation() {
  await syncSelectWithStorage();

  const resources = {};
  resources[language] = await loadLanguage(language);

  i18next.init({
    lng: language,
    resources
  }, function (err, t) {
    document.querySelectorAll('[data-translate]').forEach(function (element) {
      element.textContent = i18next.t(element.getAttribute('data-translate'));
    });
  });

  if (langSelect) {
    langSelect.addEventListener('change', async function () {
      const newLang = langSelect.value;
      localStorage.setItem('language', newLang);
      const newResources = {};
      newResources[newLang] = await loadLanguage(newLang);
      i18next.init({
        lng: newLang,
        resources: newResources
      }, function (err, t) {
        if (err) return;
        document.querySelectorAll('[data-translate]').forEach(function (element) {
          element.textContent = i18next.t(element.getAttribute('data-translate'));
        });
      });
    });
  }

  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function (node) {
          if (node.nodeType === 1) {
            node.querySelectorAll('[data-translate]').forEach(function (element) {
              element.textContent = i18next.t(element.getAttribute('data-translate'));
            });
          }
        });
      }
    }
  });

  observer.observe(document, { childList: true, subtree: true });
}

initializeTranslation();