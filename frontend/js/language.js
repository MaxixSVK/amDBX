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
  const response = await fetch(`/../locales/${lang}.json`);
  return response.json();
}

async function initializeTranslation() {
  await syncSelectWithStorage();

  const languages = ['en', 'sk'];
  const resources = {};

  for (const lang of languages) {
    resources[lang] = await loadLanguage(lang);
  }

  i18next.init({
    lng: language,
    resources
  }, function (err, t) {
    $('[data-translate]').each(function () {
      $(this).text(i18next.t($(this).data('translate')));
    });
  });

  if (langSelect) {
    langSelect.addEventListener('change', function () {
      localStorage.setItem('language', langSelect.value);
      i18next.changeLanguage(langSelect.value, function (err, t) {
        if (err) return console.log('something went wrong loading', err);
        $('[data-translate]').each(function () {
          $(this).text(i18next.t($(this).data('translate')));
        });
      });
    });
  }

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

initializeTranslation();