import { RecipeInfo } from "./dataTypes";
import { ApiError } from "./error";
import { makeRequest } from "./makeRequest";

/**
 * Get full information on the recipe with the given id
 */
export const getRecipeInfo = async (id: number): Promise<RecipeInfo | null> => {
  const params = new URLSearchParams();
  params.set("includeNutrition", "false");
  const endpoint = `/recipes/${id.toString(10)}/information`;

  const response = await makeRequest(endpoint, params);

  switch (response.status) {
    case 200:
      return response.json();

    case 404:
      return null;

    default:
      throw new ApiError(response);
  }
};
