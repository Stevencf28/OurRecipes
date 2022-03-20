import getEnv from "~/config/env.server";

/**
 * Make a request to the Spoonacular API endpoint with the given options
 *
 * The type parameter is for the expected returned data type.
 *
 */
// TODO: maybe cache the returned recipes for 1 hour?
// 1 hour because:
// "You may cache user-requested data ... (for a maximum of 1 hour)."
// from Spoonacular API FAQ page (https://spoonacular.com/food-api/faq)
export const makeRequest = async <Data>(
  endpoint: string,
  params: URLSearchParams = new URLSearchParams(),
): Promise<Data> => {
  params.set("apiKey", getEnv("SPOONACULAR_API_KEY"));
  params.sort();
  const search = params?.toString();
  const path = search ? `${endpoint}?${search}` : endpoint;
  const url = new URL(path, "https://api.spoonacular.com");

  const response = await fetch(url.toString(), {
    headers: {
      accept: "application/json",
    },
    method: "GET",
  });

  return response.json();
};
