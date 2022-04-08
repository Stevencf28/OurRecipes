import { saveRecipesToCache } from "~/controllers/Recipe.server";
import { RecipeCore, RecipeDetails, RecipeFromIngredients } from "./dataTypes";
import { ApiError } from "./error";
import { makeRequest } from "./makeRequest";

const NUMBER_MIN = 1;
const NUMBER_MAX = 100;
const OFFSET_MIN = 0;
const OFFSET_MAX = 900;

/**
 * The structure of the data returned from the search API
 *
 * @template Recipe the type of the recipe data
 */
export interface SearchRecipesResult<
  Recipe extends RecipeCore = RecipeDetails,
> {
  offset: number;
  number: number;
  totalResults: number;
  results: Recipe[];
}

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

/**
 * Make a request to the Spoonacular API endpoint for recipes with the given
 * title
 */
export const searchRecipesByTitle = async (
  search: string,
  { number, offset }: SearchRecipesByTitleOptions = {},
): Promise<SearchRecipesResult> => {
  const params = new URLSearchParams();
  params.set("titleMatch", search);

  if (number && number >= NUMBER_MIN && number <= NUMBER_MAX) {
    params.set("number", number.toString());
  }

  if (offset && offset >= OFFSET_MIN && offset <= OFFSET_MAX) {
    params.set("offset", offset.toString());
  }

  params.set("instructionsRequired", "true");
  params.set("addRecipeInformation", "true");
  params.set("sort", "popularity");

  const response = await makeRequest("/recipes/complexSearch", params);

  if (response.status !== 200) {
    throw new ApiError(response);
  }

  const data: SearchRecipesResult = await response.json();
  saveRecipesToCache(data.results);
  return data;
};

/**
 * Search options for advanced recipe search
 */
export interface SearchRecipesOptions extends SearchRecipesByTitleOptions {
  /**
   * Any search query for the title
   */
  title?: string;

  /**
   * List of the names of cooking tools to include
   *
   * Multiple values are interpreted as `or`.
   */
  tools?: string[];

  /**
   * Maximum cooking time in minutes for the returned recipes
   */
  maxTime?: number;

  /**
   * List of names of ingredients to include in the search
   */
  includedIngredients?: string[];

  /**
   * List of names of ingredients to exclude from the search
   */
  excludedIngredients?: string[];
}

/**
 * Make a request to the Spoonacular API enpoint for the list of recipes
 * satisfying the given query options
 *
 * Ingredients match data is added to each recipe if any ingredient filters are
 * given.
 */
export const searchRecipes = async (
  options: SearchRecipesOptions = {},
): Promise<
  SearchRecipesResult | SearchRecipesResult<RecipeFromIngredients>
> => {
  const {
    title,
    tools,
    maxTime,
    includedIngredients,
    excludedIngredients,
    number,
    offset,
  } = options;

  const params = new URLSearchParams();

  if (title) {
    params.set("titleMatch", title);
  }

  if (tools && tools.length > 0) {
    params.set("equipment", tools.join(","));
  }

  if (maxTime && maxTime > 0) {
    params.set("maxReadyTime", maxTime.toString());
  }

  if (number && number >= NUMBER_MIN && number <= NUMBER_MAX) {
    params.set("number", number.toString());
  }

  if (offset && offset >= OFFSET_MIN && offset <= OFFSET_MAX) {
    params.set("offset", offset.toString());
  }

  const include = includedIngredients && includedIngredients.length > 0;
  const exclude = excludedIngredients && excludedIngredients.length > 0;

  if (include) {
    params.set("includeIngredients", includedIngredients.join(","));
  }

  if (exclude) {
    params.set("excludeIngredients", excludedIngredients.join(","));
  }

  if (include || exclude) {
    // If we have any ingredients filters, get information on ingredients match
    // and set the sorting to minimum missing ingredients
    params.set("fillIngredients", "true");
    params.set("sort", "min-missing-ingredients");
    params.set("ignorePantry", "true");
  } else {
    // If no ingredients filters are specified, sort the recipes by popularity
    params.set("sort", "popularity");
  }

  params.set("instructionsRequired", "true");
  params.set("addRecipeInformation", "true");

  const response = await makeRequest("/recipes/complexSearch", params);

  if (response.status !== 200) {
    throw new ApiError(response);
  }

  const data: Awaited<ReturnType<typeof searchRecipes>> = await response.json();
  saveRecipesToCache(data.results);
  return data;
};
