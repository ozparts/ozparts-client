import {
  LANGUAGE_TO_COUNTRY,
  REGION_TO_SYSTEM_COUNTRY,
  SYSTEM_COUNTRY_CODES,
} from "../types/index.js";

// Country from a BCP 47 language tag, always a code that exists in the system:
// - the region subtag wins when present (cs-CZ → CZ, zh-Hant-TW → TW, pl_PL → PL, sq-XK → KV);
//   a region that is not a system country (es-419, en-150, es-EA) gives "";
// - without a region, an explicit language → country map (cs → CZ, da → DK, el → GR…).
// A language code is never returned as a country code. Returns "" when unknown or ambiguous (e.g. "en").
export const mapLanguageToCountry = (language: string): string => {
  if (!language) return "";

  const [languageSubtag, ...subtags] = language.trim().split(/[-_]/);
  const region = subtags.find((subtag) => /^([a-z]{2}|\d{3})$/i.test(subtag));

  const country = region
    ? REGION_TO_SYSTEM_COUNTRY.get(region.toUpperCase()) || region.toUpperCase()
    : LANGUAGE_TO_COUNTRY.get(languageSubtag.toLowerCase()) || "";

  return SYSTEM_COUNTRY_CODES.has(country) ? country : "";
};

const isAllowed = (country: string, allowedCountries?: string[]): boolean =>
  !!country &&
  (!allowedCountries ||
    allowedCountries.some((allowed) => allowed.toUpperCase() === country));

// Checks all preferred browser languages and returns the first country that is
// allowed (all system countries when allowedCountries is not given).
export const getCountryFromNavigator = (allowedCountries?: string[]): string => {
  if (!isBrowserEnvironment() || typeof navigator === "undefined") return "";

  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const language of languages) {
    const country = mapLanguageToCountry(language);

    if (isAllowed(country, allowedCountries)) return country;
  }

  return "";
};

// Returns the country only when it is allowed, otherwise "".
export const filterAllowedCountry = (
  country: string | undefined,
  allowedCountries?: string[]
): string => {
  const code = (country || "").toUpperCase();

  return isAllowed(code, allowedCountries) ? code : "";
};

export const isBrowserEnvironment = (): boolean =>
  typeof window !== "undefined";
