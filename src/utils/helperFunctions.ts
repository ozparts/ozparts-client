import { LANGUAGE_TO_COUNTRY } from "../types/index.js";

export const mapLanguageToCountry = (language: string): string => {
  const [langCode] = language.split("-");

  return LANGUAGE_TO_COUNTRY.get(language) || langCode?.toUpperCase() || "";
};

export const getCountryFromNavigator = (): string => {
  return isBrowserEnvironment() ? mapLanguageToCountry(navigator.language) : "";
};

export const isBrowserEnvironment = (): boolean =>
  typeof window !== "undefined";
