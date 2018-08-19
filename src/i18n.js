import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Config from './config';

import common_en from "./translations/common_en.json";
import common_vi from "./translations/common_vi.json";

import auth_en from "./translations/auth_en.json";
import auth_vi from "./translations/auth_vi.json";

//Apps_start
import employee_en from "./translations/employee_en.json";
import employee_vi from "./translations/employee_vi.json";
//Apps_end

i18next
    .use(LanguageDetector)
    .init({
    resources: {
        en: {
            common: common_en,
            auth: auth_en,
            //Apps_start
            employee: employee_en
            //Apps_end
        },
        vi: {
            common: common_vi,
            auth: auth_vi,
            //Apps_start
            employee: employee_vi
            //Apps_end
        },
    },
    lng: localStorage.getItem('default_locale') ? localStorage.getItem('default_locale') : Config.defaultLocale,
    fallbackLng: 'vi',
    // have a common namespace used around the full app
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ','
    },
    react: {
        wait: true
    }
});

export default i18next;