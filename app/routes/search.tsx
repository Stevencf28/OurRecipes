import { CatchValue } from "@remix-run/react/transition";
import React from "react";
import { useState } from "react";
import { Badge, Col, Form, InputGroup, Row } from "react-bootstrap";
import {
  Link,
  LoaderFunction,
  Form as RemixForm,
  json,
  useLoaderData,
} from "remix";
import AdvancedSearch from "~/components/advanced-search";
import { parseToInt } from "~/utils/parseString";
import {
  RecipeDetails,
  RecipeFromIngredients,
  searchRecipes,
} from "~/utils/spoonacular.server";

/**
 * The data (actually nothing) returned by the loader when not searched
 */
interface EmptyData {
  status: "empty";
}

interface SearchDataBase {
  status: "search";
  currentPage: number;
  totalPages: number;
}

interface SearchDataRegular extends SearchDataBase {
  searchType: "regular";
  // TODO: filter data and use `Pick<RecipeDetails, "..." | "...">[]`
  recipes: RecipeDetails[];
}

interface SearchDataIngredients extends SearchDataBase {
  searchType: "ingredients";
  // TODO: filter data and use appropriate type
  recipes: RecipeFromIngredients[];
}

/**
 * The data returned by the loader for searching by filters
 */
type SearchData = SearchDataRegular | SearchDataIngredients;

/**
 * The data returned by the loader in case of any input validation errors
 */
interface ErrorData {
  status: "error";
  message: string;
}

/**
 * The aggregated data type that the loader returns
 */
type LoaderData = EmptyData | SearchData | ErrorData;

/**
 * Server-side function to load the data needed for the `/search` route
 *
 * We need to get the search results if the search form is submitted.
 */
export const loader: LoaderFunction = async ({ request }) => {
  const { searchParams: params } = new URL(request.url);

  // Parse all search filters
  const title = params.get("title") ?? undefined;
  const include = params.getAll("include").filter(Boolean);
  const exclude = params.getAll("exclude").filter(Boolean);
  const tools = params.getAll("tools").filter(Boolean);
  const maxTime = parseToInt(params.get("maxTime") ?? "");
  const page = parseToInt(params.get("p") ?? "");

  // Whether there are any filters specified (i.e. the form is submitted)
  const hasFilters = ["title", "include", "exclude", "tools", "maxTime"].some(
    (key) => params.has(key),
  );

  // Don't do a search if there are no filters
  if (!hasFilters) {
    return json<EmptyData>({ status: "empty" });
  }

  // Whether the values for the filters are all empty
  const filtersEmpty =
    !title &&
    !include.length &&
    !exclude.length &&
    !tools.length &&
    maxTime <= 0;

  // If the filters are all empty, this is a mal-formed request
  if (filtersEmpty) {
    return json<ErrorData>(
      {
        status: "error",
        message: "At least one of the search filters should be specified.",
      },
      400,
    );
  }

  // Now we can send the search request to the API endpoint
  const NUM_RESULTS_PER_PAGE = 2;
  const results = await searchRecipes({
    title,
    includedIngredients: include,
    excludedIngredients: exclude,
    tools,
    maxTime,
    number: NUM_RESULTS_PER_PAGE,
    offset: page * NUM_RESULTS_PER_PAGE,
  });
  const totalPages = Math.ceil(results.totalResults / NUM_RESULTS_PER_PAGE);
  const currentPage = results.offset / NUM_RESULTS_PER_PAGE;
  const searchType: SearchData["searchType"] =
    include.length > 0 || exclude.length > 0 ? "ingredients" : "regular";
  // TODO: filter data to only include what to show to the user
  return json<SearchData>({
    status: "search",
    totalPages,
    currentPage,
    searchType,
    recipes: results.results,
  } as SearchData);
};

/**
 * The UI of this route
 */
export default function Search(): JSX.Element {
  const data = useLoaderData<LoaderData>();
  const includedIngredients: string[] = [];
  const { status } = data;

  const [included, setIncluded] = useState("");
  const [excluded, setExcluded] = useState("");
  const [cookingTools, setCookingTools] = useState("");
  const [cookingTime, setCookingTime] = useState(0);

  const handleIncludedChange = (value) => setIncluded(value);

  const addIncluded = () => includedIngredients.push(included);

  return (
    <div className="container">
      {/* An example of how to set up the form */}
      {/* Of course, don't follow this; this is a terrible example */}
      <Form method="get">
        <div className="Search-UI">
          <div className="search">
            <input
              type="text"
              name="title"
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
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            className="advanced-search"
            style={{ width: "8%" }}
          >
            Saved filters
          </button>
        </div>
        <div className="ingredients">
          <h3>Ingredients</h3>
          {/* Included Ingredients UI */}
          <Form.Group id="includedGroup">
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                Included Ingredients
              </InputGroup.Text>
              <Form.Control
                name="include"
                placeholder="Ingredient"
                aria-label="Ingredient"
                aria-describedby="basic-addon1"
                value={included}
                onChange={(event) => handleIncludedChange(event.target.value)}
              />
              <button
                type="button"
                className="searchbutton"
                onClick={addIncluded}
              >
                +
              </button>
              <button type="button" className="searchbutton">
                -
              </button>
            </InputGroup>
          </Form.Group>
          {/* Excluded Ingredients UI */}
          <Form.Group id="excludedGroup">
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">
                Exclude Ingredients
              </InputGroup.Text>
              <Form.Control
                placeholder="Ingredient"
                name="exclude"
                aria-label="Ingredient"
                aria-describedby="basic-addon1"
              />
              <button type="button" className="searchbutton">
                +
              </button>
              <button type="button" className="searchbutton">
                -
              </button>
            </InputGroup>
          </Form.Group>
        </div>
        <div className="ingredients">
          <h3>Ingredients</h3>
          {/* Cooking tools UI */}
          <Form.Group>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">Cooking Tools</InputGroup.Text>
              <Form.Control
                placeholder="Cooking Tools"
                aria-label="Ingredient"
                aria-describedby="basic-addon1"
              />
              <button type="button" className="searchbutton">
                +
              </button>
              <button type="button" className="searchbutton">
                -
              </button>
            </InputGroup>
            <Form.Label>Cooking Time: {cookingTime} minutes. </Form.Label>
            <Form.Range
              name="maxTime"
              id="search-max-time"
              step={1}
              defaultValue={0}
              min={0}
              max={240}
              onChange={(e) => setCookingTime(+e.target.value)}
            />
          </Form.Group>
        </div>
      </Form>

      {/* An example of how to detect and show errors */}
      {status === "error" && (
        <p className="alert alert-danger">{data.message}</p>
      )}

      {process.env.NODE_ENV !== "production" && status === "search" && (
        <Link to=".">Clear URL Search Params</Link>
      )}

      {/* An example of showing the search results */}
      {status === "search" && (
        <ul>
          {data.recipes.map((recipe) => (
            // This is just here to help typescript with types :'(
            <RecipeSearchItem
              key={recipe.id}
              searchType={data.searchType}
              recipe={recipe}
            />
          ))}
        </ul>
      )}
      {status === "search" && <pre>{JSON.stringify(data, undefined, 2)}</pre>}
    </div>
  );
}

type RecipeSearchItemProps =
  | { searchType: "regular"; recipe: RecipeDetails }
  | { searchType: "ingredients"; recipe: RecipeFromIngredients };

function RecipeSearchItem(props: RecipeSearchItemProps): JSX.Element {
  const { searchType, recipe } = props;
  return (
    <li>
      <h4>{recipe.title}</h4>
      <p>
        <Badge bg="secondary">{recipe.readyInMinutes} mins</Badge>
        {searchType === "ingredients" && (
          <>
            <br />
            You have ({recipe.usedIngredientCount}):{" "}
            {recipe.usedIngredients.map((i) => i.name).join(", ")}
            <br />
            You need ({recipe.missedIngredientCount}):{" "}
            {recipe.missedIngredients.map((i) => i.name).join(", ")}
          </>
        )}
      </p>
    </li>
  );
}
