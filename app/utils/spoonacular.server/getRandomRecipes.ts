import { RecipeDetails } from "./dataTypes";
import { ApiError } from "./error";
import { makeRequest } from "./makeRequest";

export interface GetRandomRecipesOptions {
  /**
   * Whether the recipes should have an open license that allows display with
   * proper attribution
   */
  limitLicense?: boolean;

  /**
   * A the tags (can be diets, meal types, cuisines, or intolerances) that the
   * recipe must have
   */
  tags?: string[];

  /**
   * The number of random recipes to be returned (between 1 and 100)
   */
  number?: number;
}

export interface GetRandomRecipesResult {
  recipes: RecipeDetails[];
}

/**
 * Get detailed info about random recipes
 */
export const getRandomRecipes = async (
  options: GetRandomRecipesOptions = {},
): Promise<GetRandomRecipesResult> => {
  const params = new URLSearchParams();

  if (typeof options.limitLicense === "boolean") {
    params.set("limitLicense", options.limitLicense.toString());
  }

  if (options.tags && options.tags.length > 0) {
    params.set("tags", options.tags.join(","));
  }

  if (options.number && options.number > 0 && options.number < 101) {
    params.set("number", options.number.toString());
  }

  const response = await makeRequest("/recipes/random", params);

  if (response.status !== 200) {
    throw new ApiError(response);
  }

  return response.json();
};
