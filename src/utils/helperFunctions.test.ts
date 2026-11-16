import {
  filterAllowedCountry,
  getCountryFromNavigator,
  mapLanguageToCountry,
} from "./helperFunctions";
import { LANGUAGE_TO_COUNTRY, SYSTEM_COUNTRY_CODES } from "../types/index";

describe("mapLanguageToCountry", () => {
  it("should return the region subtag when the language has a region", () => {
    expect(mapLanguageToCountry("en-US")).toBe("US");
    expect(mapLanguageToCountry("cs-CZ")).toBe("CZ");
  });

  it("should return the country code when country subtag is provided", () => {
    expect(mapLanguageToCountry("ua-AU")).toBe("AU");
  });

  it("should take the region after a script subtag", () => {
    expect(mapLanguageToCountry("zh-Hant-TW")).toBe("TW");
  });

  it("should accept an underscore separator", () => {
    expect(mapLanguageToCountry("pl_PL")).toBe("PL");
  });

  it("should return the country code when language subtag is provided", () => {
    expect(mapLanguageToCountry("it")).toBe("IT");
  });

  it.each([
    ["cs", "CZ"],
    ["da", "DK"],
    ["el", "GR"],
    ["sv", "SE"],
    ["sl", "SI"],
    ["et", "EE"],
    ["nb", "NO"],
    ["CS", "CZ"],
  ])("should map language %s without region to country %s", (language, country) => {
    expect(mapLanguageToCountry(language)).toBe(country);
  });

  it("should return an empty string for an ambiguous language", () => {
    expect(mapLanguageToCountry("en")).toBe("");
  });

  it("should return an empty string for an unknown language", () => {
    expect(mapLanguageToCountry("xx")).toBe("");
  });

  it("should return an empty string when no language is provided", () => {
    expect(mapLanguageToCountry("")).toBe("");
  });

  it("should map the Kosovo region XK to the system code KV", () => {
    expect(mapLanguageToCountry("sq-XK")).toBe("KV");
  });

  it("should return an empty string for a region that is not a system country", () => {
    expect(mapLanguageToCountry("es-419")).toBe("");
    expect(mapLanguageToCountry("en-150")).toBe("");
    expect(mapLanguageToCountry("es-EA")).toBe("");
  });

  it("should only map languages to system countries", () => {
    for (const country of LANGUAGE_TO_COUNTRY.values()) {
      expect(SYSTEM_COUNTRY_CODES.has(country)).toBe(true);
    }
  });
});

describe("filterAllowedCountry", () => {
  it("should return the country when no allowed list is given", () => {
    expect(filterAllowedCountry("cz")).toBe("CZ");
  });

  it("should return the country only when it is allowed", () => {
    expect(filterAllowedCountry("GB", ["GB", "IE", "JE", "GG"])).toBe("GB");
    expect(filterAllowedCountry("PL", ["GB", "IE", "JE", "GG"])).toBe("");
    expect(filterAllowedCountry(undefined)).toBe("");
  });
});

describe("getCountryFromNavigator", () => {
  const setBrowser = (language: string, languages: string[]) => {
    Object.defineProperty(globalThis, "window", { value: {}, configurable: true });
    Object.defineProperty(globalThis, "navigator", {
      value: { language, languages },
      configurable: true,
    });
  };

  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
  });

  it("should return an empty string outside the browser", () => {
    expect(getCountryFromNavigator()).toBe("");
  });

  it("should return the first preferred language that yields a country", () => {
    setBrowser("en", ["en", "cs"]);
    expect(getCountryFromNavigator()).toBe("CZ");
  });

  it("should return an empty string when no language yields a country", () => {
    setBrowser("en", ["en"]);
    expect(getCountryFromNavigator()).toBe("");
  });

  it("should skip countries the project does not ship to", () => {
    setBrowser("pl-PL", ["pl-PL", "en-IE", "en"]);
    expect(getCountryFromNavigator(["GB", "IE", "JE", "GG"])).toBe("IE");
    expect(getCountryFromNavigator(["GB"])).toBe("");
  });

  it("should fall back to navigator.language when languages is empty", () => {
    setBrowser("da", []);
    expect(getCountryFromNavigator()).toBe("DK");
  });
});
