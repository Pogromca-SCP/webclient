import resourcesPL from "./locales/resources.pl.json";
import resourcesEN from "./locales/resources.en.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { hasCookieValue, getCookieValue } from "./helpers/cookieHelper";

const resources = {
  pl: {
    translation: resourcesPL
  },
  en: {
    translation: resourcesEN
  }
};

export const langCookie = "lng";

i18n.use(initReactI18next).init({
  resources: resources,
  lng: hasCookieValue(langCookie) ? getCookieValue(langCookie) : "pl",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
