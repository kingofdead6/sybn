import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonAr from './locales/ar/common.json';
import navAr from './locales/ar/nav.json';
import homeAr from './locales/ar/home.json';
import programsAr from './locales/ar/programs.json';
import forumsAr from './locales/ar/forums.json';
import coursesAr from './locales/ar/courses.json';
import networkAr from './locales/ar/network.json';
import storeAr from './locales/ar/store.json';
import adminAr from './locales/ar/admin.json';

import commonEn from './locales/en/common.json';
import navEn from './locales/en/nav.json';
import homeEn from './locales/en/home.json';
import programsEn from './locales/en/programs.json';
import forumsEn from './locales/en/forums.json';
import coursesEn from './locales/en/courses.json';
import networkEn from './locales/en/network.json';
import storeEn from './locales/en/store.json';
import adminEn from './locales/en/admin.json';

export const NAMESPACES = ['common', 'nav', 'home', 'programs', 'courses', 'forums', 'network', 'store', 'admin'];

i18n.use(initReactI18next).init({
  resources: {
    ar: {
      common: commonAr,
      nav: navAr,
      home: homeAr,
      programs: programsAr,
      forums: forumsAr,
      courses: coursesAr,
      network: networkAr,
      store: storeAr,
      admin: adminAr,
    },
    en: {
      common: commonEn,
      nav: navEn,
      home: homeEn,
      programs: programsEn,
      forums: forumsEn,
      courses: coursesEn,
      network: networkEn,
      store: storeEn,
      admin: adminEn,
    },
  },
  lng: import.meta.env.VITE_DEFAULT_LOCALE || 'ar',
  fallbackLng: 'ar',
  ns: NAMESPACES,
  defaultNS: 'common',
  interpolation: { escapeValue: false },
  returnEmptyString: false,
});

export default i18n;
