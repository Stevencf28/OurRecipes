import {
  getCachedRecipe,
  removeRecipeCache,
  saveRecipeCache,
} from "~/controllers/Recipe.server";
import { RecipeInfo } from "./dataTypes";
import { ApiError } from "./error";
import { makeRequest } from "./makeRequest";

/**
 * Get full information on the recipe with the given id
 */
export const getRecipeInfo = async (id: number): Promise<RecipeInfo | null> => {
  const cached = await getCachedRecipe(id);

  // Check if we can use the cached version
  // If no ingredients, get the information again to see if those are added
  if (cached && cached.extendedIngredients.length) {
    return cached as RecipeInfo;
  }

  const params = new URLSearchParams();
  params.set("includeNutrition", "false");
  const endpoint = `/recipes/${id.toString(10)}/information`;

  const response = await makeRequest(endpoint, params);

  switch (response.status) {
    case 200:
      const data: RecipeInfo = await response.json();
      saveRecipeCache(data);
      return data;

    case 404:
      if (cached) {
        removeRecipeCache(id);
      }
      return null;

    default:
      throw new ApiError(response);
  }
};
