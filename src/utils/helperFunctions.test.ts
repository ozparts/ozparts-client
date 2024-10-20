import { mapLanguageToCountry } from "./helperFunctions";

describe("mapLanguageToCountry", () => {
  it("should return the country code when the language is in the LANGUAGE_TO_COUNTRY map", () => {
    expect(mapLanguageToCountry("en-US")).toBe("US");
  });

  it("should return the country code when country subtag is provided", () => {
    expect(mapLanguageToCountry("ua-AU")).toBe("AU");
  });

  it("should return the country code when language subtag is provided", () => {
    expect(mapLanguageToCountry("it")).toBe("IT");
  });

  it("should return an empty string when no language is provided", () => {
    expect(mapLanguageToCountry("")).toBe("");
  });
});
