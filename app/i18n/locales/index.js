import staticDefaults from "../extracted/static";
import { addLocaleData } from "react-intl";

import ru_data from "react-intl/locale-data/ru";
import en_data from "react-intl/locale-data/en";

addLocaleData([ ...ru_data, ...en_data ]);

// Extra formats. May be customized by each locale.
export const defaultFormats = {
  number: {
    "two-decimals": {
      minimumFractionDigits: 2
    },
    "precise-percent": {
      style: "percent",
      minimumFractionDigits: 4
    }
  },
  date: {
    "day-short-month": {
      day: "numeric",
      month: "short"
    }
  }
};

const ru = {
  key: "ru",
  language: "ru",
  description: "Русский",
  messages: require("../translations/ru.json"),
  formats: defaultFormats
};

const en = {
  key: "en",
  language: "en",
  description: "English (US)",
  messages: staticDefaults, // uses defaultMessage for anything not on the staticDefaults
  formats: defaultFormats //dont customize for en language
};

// pseudo-locale for i18n testing during development. Can be freely
// modified.
const dev = {
  key: "dev",
  language: "pt-BR", // must be one of the allowed locales of format.js/react-intl
  description: "Dev Locale for testing",
  messages: require("../translations/dev.json"),
  formats: defaultFormats
};

const locales = [ ru, en ];

if (process.env.NODE_ENV === "development") {
  locales.push(dev);
}

export default locales;

// appLocaleFromElectronLocale returns the app locale that should be used for a given
// locale returned by electron's app.getLocale() function. Note that
// app.getLocale() can only be called after the app's ready() event is fired.
//
// The locale key returned by this function is guaranteed to exist.
export function appLocaleFromElectronLocale(electronLocale) {
  switch (electronLocale) {

  case "de":
  case "de-AT":
  case "de-CH":
  case "de-DE":
    return "de";

  case "en-GB":
    return "en-GB";
  case "en-AU":
    return "en-AU";

  case "es":
    return "es";

  case "ru":
    return "ru";

  case "fr":
  case "fr-CA":
  case "fr-CH":
  case "fr-FR":
    return "fr";

  case "ja":
    return "ja";

  case "pt":
  case "pt-BR":
  case "pt-PT":
    return "pt-BR";

  case "zh":
  case "zh-CN":
  case "zh-TW":
    return "zh";

  default:
    return "ru";
  }
}
