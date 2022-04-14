import { Form, LoaderFunction, json, useLoaderData } from "remix";
import RecipeList, { Recipe, recipeForClient } from "~/components/recipe-list";
import { validateMinLength } from "~/utils/inputValidation";
import { parseToInt } from "~/utils/parseString";
import {
  getRandomRecipes,
  searchRecipesByTitle,
} from "~/utils/spoonacular.server";

/**
 * The data returned by the loader for the main page (when not in search mode)
 */
interface MainData {
  status: "main";
  recipes: Recipe[];
}

/**
 * The data returned by the loader in case of any input validation errors
 */
interface ErrorData {
  status: "error";
  message: string;
  query: string;
}

/**
 * The data returned by the loader for searching by title
 */
interface SearchData {
  status: "search";
  recipes: Recipe[];
  query: string;
  currentPage: number;
  totalPages: number;
}

/**
 * The aggregated data type that the loader returns
 */
type LoaderData = MainData | SearchData | ErrorData;

/**
 * Server-side function to load the data needed for the `/` index route
 *
 * We need to get the list of available recipes
 */
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  // The search query provided by the user
  const search = url.searchParams.get("q");
  // The page to show, starting from 0
  const page = parseToInt(url.searchParams.get("p") ?? "");

  // If the search is empty, we return the random list of recipes
  if (!search) {
    const { recipes } = await getRandomRecipes({ number: 9 });
    return json<MainData>({
      status: "main",
      recipes: recipes.map(recipeForClient),
    });
  }

  // Check if the search query is at least 3 characters long
  const validation = validateMinLength(3)(search);

  // If the search query is less than 3 characters long, return the error
  if (validation.error) {
    return json<ErrorData>(
      {
        status: "error",
        message: validation.error,
        query: validation.value!, // value is not null bc the input is string
      },
      400,
    );
  }

  const NUM_RESULTS_PER_PAGE = 9;
  const results = await searchRecipesByTitle(search, {
    number: NUM_RESULTS_PER_PAGE,
    offset: page * NUM_RESULTS_PER_PAGE,
  });
  const totalPages = Math.ceil(results.totalResults / NUM_RESULTS_PER_PAGE);
  const currentPage = results.offset / NUM_RESULTS_PER_PAGE;
  return json<SearchData>({
    status: "search",
    recipes: results.results.map(recipeForClient),
    query: search,
    totalPages,
    currentPage,
  });
};

/**
 * React component for UI for this page
 */
export default function Index() {
  const data = useLoaderData<LoaderData>();

  return (
    <>
      <div className="container">
        <Form method="get" className="row justify-content-center px-3">
          <div className="col-12 col-md-8 mt-3 fs-5 text-white">
            <div className="search">
              <label htmlFor="searchQuery" className="visually-hidden">
                Recipe Search
              </label>
              <input
                type="text"
                name="q"
                id="searchQuery"
                className="search-bar m-2"
                placeholder="Search for the recipe you want"
                aria-describedby={
                  data.status === "error" ? "search-error" : undefined
                }
                required
              />
              <button type="submit" className="searchbutton">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 1024 1024"
                  height="1.5em"
                  width="1.5em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
                </svg>
              </button>
            </div>
          </div>
          {data.status === "error" && (
            <p
              id="search-error"
              className="col-12 col-md-8 mt-2 alert alert-danger"
              role="alert"
            >
              The search input {data.message}.
            </p>
          )}
        </Form>

        <h1 className="mt-3">
          {data.status === "main"
            ? "Recipes You Might Like"
            : `Search Results for "${data.query}"`}
        </h1>
        <RecipeList recipes={data.status === "error" ? [] : data.recipes} />
      </div>
    </>
  );
}
