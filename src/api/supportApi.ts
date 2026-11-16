import { Country } from "../types/index.js";
import {
  filterAllowedCountry,
  getCountryFromNavigator,
} from "../utils/helperFunctions.js";

const BASE_URL = "https://api.ozparts.eu";

// Detects the user's country: first from the browser languages, then (optionally) from the server.
// allowedCountries: the countries the project ships to. When given, only one of them is returned;
// if neither the browser nor the server gives an allowed country, the result is "" and the
// project picks its own default.
export const checkUserCountry = async (
  checkOnServer: boolean = false,
  allowedCountries?: string[]
): Promise<string> => {
  const country = getCountryFromNavigator(allowedCountries);

  if (country) return country;

  if (checkOnServer) {
    const country = await getCountry();

    return filterAllowedCountry(country.code, allowedCountries);
  }

  return "";
};

const getCountry = async (): Promise<Country> => {
  let response: Response;

  try {
    response = await fetch(`${BASE_URL}/country`);
  } catch (error) {
    throw new Error(error);
  }

  if (!response.ok) {
    throw new Error("Failed to fetch country");
  }
  return response.json();
};
