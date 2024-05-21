const langSelect = document.getElementById('lang');

async function syncSelectWithStorage() {
  const storedLang = localStorage.getItem('language');
  if (storedLang) {
    langSelect.value = storedLang;
  }
}
async function loadLanguage(lang) {
  const response = await fetch(`/../locales/${lang}.json`);
  return response.json();
}

async function initializeI18n() {
  await syncSelectWithStorage();

  const languages = ['en', 'sk'];
  const resources = {};

  for (const lang of languages) {
    resources[lang] = await loadLanguage(lang);
  }

  i18next.init({
    lng: langSelect.value,
    resources
  }, function (err, t) {
    $('[data-translate]').each(function () {
      $(this).text(i18next.t($(this).data('translate')));
    });
  });

  langSelect.addEventListener('change', function () {
    localStorage.setItem('language', langSelect.value);
    i18next.changeLanguage(langSelect.value, function (err, t) {
      if (err) return console.log('something went wrong loading', err);
      $('[data-translate]').each(function () {
        $(this).text(i18next.t($(this).data('translate')));
      });
    });
  });

  const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        $(mutation.addedNodes).find('[data-translate]').each(function () {
          $(this).text(i18next.t($(this).data('translate')));
        });
      }
    }
  });

  observer.observe(document, { childList: true, subtree: true });
}

initializeI18n();