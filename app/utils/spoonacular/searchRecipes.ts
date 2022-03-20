import { RecipeDetails } from "./dataTypes";
import { makeRequest } from "./makeRequest";

export interface SearchRecipesByTitleOptions {
  /**
   * The number of expected results (between 1 and 100)
   */
  number?: number;

  /**
   * The number of results to skip (between 0 and 900)
   */
  offset?: number;
}

export interface SearchRecipesByTitleResult {
  offset: number;
  number: number;
  totalResults: number;
  results: RecipeDetails[];
}

/**
 * Make a request to the Spoonacular API endpoint for recipes with the given
 * title
 */
export const searchRecipesByTitle = async (
  search: string,
  options: SearchRecipesByTitleOptions = {},
) => {
  const params = new URLSearchParams();
  params.set("titleMatch", search);

  if (options.number && options.number > 0 && options.number < 101) {
    params.set("number", options.number.toString());
  }

  if (options.offset && options.offset > 0 && options.offset < 901) {
    params.set("offset", options.offset.toString());
  }

  params.set("instructionsRequired", "true");
  params.set("addRecipeInformation", "true");
  params.set("sort", "popularity");

  return makeRequest<SearchRecipesByTitleResult>(
    "/recipes/complexSearch",
    params,
  );
};
