import { Country } from "../types";
import { getCountryFromNavigator } from "../utils/helperFunctions";

const BASE_URL = "https://api.ozparts.eu";

export const checkUserCountry = async (
  checkOnServer: boolean = false
): Promise<string> => {
  const country = getCountryFromNavigator();

  if (country) return country;

  if (checkOnServer) {
    const country = await getCountry();

    return country.code;
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
