import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import i18nextXHRBackend from 'i18next-xhr-backend';
import Config from './config';

i18next
    .use(i18nextXHRBackend)
    .use(LanguageDetector)
    .init({
    backend: {
        // load from i18next-gitbook repo
        loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    lng: localStorage.getItem('default_locale') ? localStorage.getItem('default_locale') : Config.defaultLocale,
    fallbackLng: 'vi',
    debug: true,
    // have a common namespace used around the full app
    ns: ['common', 'auth', 'employee'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ','
    },
    react: {
        wait: true
    }
}, function(err, t) {
    //console.log(err);
});

export default i18next;