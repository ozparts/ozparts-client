import { checkUserCountry } from "./supportApi";

describe("checkUserCountry", () => {
  const setBrowser = (languages: string[]) => {
    Object.defineProperty(globalThis, "window", { value: {}, configurable: true });
    Object.defineProperty(globalThis, "navigator", {
      value: { language: languages[0], languages },
      configurable: true,
    });
  };
  const mockServer = (code: string) => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ code, country: "" }),
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    return fetchMock;
  };

  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
    jest.restoreAllMocks();
  });

  it("should use the browser language without asking the server", async () => {
    setBrowser(["cs"]);
    const fetchMock = mockServer("DE");
    await expect(checkUserCountry(true)).resolves.toBe("CZ");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("should ask the server when the language is ambiguous", async () => {
    setBrowser(["en"]);
    mockServer("IE");
    await expect(checkUserCountry(true)).resolves.toBe("IE");
  });

  it("should not ask the server when checkOnServer is false", async () => {
    setBrowser(["en"]);
    const fetchMock = mockServer("IE");
    await expect(checkUserCountry()).resolves.toBe("");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("should ask the server when the browser country is not allowed", async () => {
    setBrowser(["pl-PL"]);
    mockServer("GB");
    await expect(checkUserCountry(true, ["GB", "IE", "JE", "GG"])).resolves.toBe("GB");
  });

  it("should return an empty string when the server country is not allowed", async () => {
    setBrowser(["pl-PL"]);
    mockServer("PL");
    await expect(checkUserCountry(true, ["GB", "IE", "JE", "GG"])).resolves.toBe("");
  });
});
