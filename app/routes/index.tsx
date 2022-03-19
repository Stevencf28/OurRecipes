import { LoaderFunction, json, useLoaderData } from "remix";
import { RecipeDetails, getRandomRecipes } from "~/utils/spoonacular.server";

interface LoaderData {
  // TODO: filter data and use `Pick<RecipeDetails, "..." | "...">[]`
  recipes: RecipeDetails[];
}

/**
 * Server-side function to load the data needed for the `/` index route
 *
 * We need to get the list of available recipes
 */
export const loader: LoaderFunction = async () => {
  const { recipes } = await getRandomRecipes({ number: 1 });
  // TODO: filter data to only include what to show to the user
  return json<LoaderData>({ recipes });
};

export default function Index() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="container">
      <ul>
        {data.recipes.map((recipe) => (
          <li key={recipe.id}>
            <h3>{recipe.title}</h3>
            <p>{recipe.readyInMinutes} mins</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
