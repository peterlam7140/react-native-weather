import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import tc from "./tc.json";

const resources = {
  en: { translation: en, },
  tc: { translation: tc, },
};

i18n.use(initReactI18next).init({ resources, compatibilityJSON: 'v3', fallbackLng: "en", lng: "en", interpolation: { escapeValue: false, }, });

export default i18n;