import { useState } from "react";
import { Alert, Card, Col, Row } from "react-bootstrap";
import { Form, LoaderFunction, json, useLoaderData } from "remix";
import AdvancedSearch from "~/components/advanced-search";
import RecipeList, { Recipe, recipeForClient } from "~/components/recipe-list";
import { parseToInt } from "~/utils/parseString";
import {
  getRandomRecipes,
  searchRecipesByTitle,
} from "~/utils/spoonacular.server";

/**
 * The data returned by the loader for the main page (when not in search mode)
 */
interface MainData {
  type: "main";
  recipes: Recipe[];
}
/**
 * The data returned by the loader in case of any input validation errors
 */
interface ErrorData {
  status: "error";
  message: string;
}
/**
 * The data returned by the loader in case of any input validation errors
 */

/**
 * The data returned by the loader in case of any input validation errors
 */

/**
 * The data returned by the loader for searching by title
 */
interface SearchData {
  type: "search";
  recipes: Recipe[];
  currentPage: number;
  totalPages: number;
}

/**
 * The aggregated data type that the loader returns
 */
type LoaderData = MainData | SearchData;

/**
 * Server-side function to load the data needed for the `/` index route
 *
 * We need to get the list of available recipes
 */
export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  // The search query provided by the user
  const search = url.searchParams.get("q")!;

  // The search query must  have 3 letters at least
  const ThreeCharRule = /^[a-zA-Z]{3,}$/;

  //Checking if the query has 3 letters or not
  if (ThreeCharRule.test(search) === false) {
    return alert("The search query must  have 3 letters at least");
  }
  // The page to show, starting from 0
  const page = parseToInt(url.searchParams.get("p") ?? "");

  // If the search is empty, we return the random list of recipes
  if (!search) {
    const { recipes } = await getRandomRecipes({ number: 9 });
    return json<MainData>({
      type: "main",
      recipes: recipes.map(recipeForClient),
    });
  }

  const NUM_RESULTS_PER_PAGE = 9;
  const results = await searchRecipesByTitle(search, {
    number: NUM_RESULTS_PER_PAGE,
    offset: page * NUM_RESULTS_PER_PAGE,
  });
  const totalPages = Math.ceil(results.totalResults / NUM_RESULTS_PER_PAGE);
  const currentPage = results.offset / NUM_RESULTS_PER_PAGE;
  return json<SearchData>({
    type: "search",
    totalPages,
    currentPage,
    recipes: results.results.map(recipeForClient),
  });
};

/**
 * React component for UI for this page
 */
export default function Index() {
  const data = useLoaderData<LoaderData>();
  let recipes: Recipe[] = data.recipes;

  // Form is not called from component due to issues with the form not
  // submitting correctly as a component
  return (
    <>
      <Form method="get">
        <div className="container">
          <SearchByTitle />
        </div>
      </Form>
      <div className="container">
        <RecipeList recipes={recipes} />
      </div>
    </>
  );
}

function SearchByTitle(): JSX.Element {
  return (
    <>
      <div className="Search-UI">
        <div className="search">
          <input
            type="text"
            name="q"
            id="searchQuery"
            className="search-bar"
            placeholder="Search for the recipe you want"
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
    </>
  );
}
