import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files
import en from './locales/en.json';
import he from './locales/he.json';

const resources = {
  en: {
    translation: en
  },
  he: {
    translation: he
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

// Initialize body direction based on saved language
i18n.on('initialized', (options) => {
  const lng = i18n.language;
  document.body.dir = lng === 'he' ? 'rtl' : 'ltr';
  document.body.lang = lng;
});

// Update body direction when language changes
i18n.on('languageChanged', (lng) => {
  document.body.dir = lng === 'he' ? 'rtl' : 'ltr';
  document.body.lang = lng;
});

export default i18n;