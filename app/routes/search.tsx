import { Badge, Form } from "react-bootstrap";
import {
  Link,
  LoaderFunction,
  Form as RemixForm,
  json,
  useLoaderData,
} from "remix";
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
  const { status } = data;

  return (
    <div className="container">
      {/* An example of how to set up the form */}
      {/* Of course, don't follow this; this is a terrible example */}
      <Form as={RemixForm} method="get">
        <input type="text" name="title" id="search-title" />
        <br />

        {/* Note the duplicated name "include" */}
        <span>Include: </span>
        <input type="text" name="include" id="search-include-0" />
        <input type="text" name="include" id="search-include-1" />
        <br />

        <span>Max Cooking Time (minutes) </span>
        <input
          type="range"
          name="maxTime"
          id="search-max-time"
          min={0}
          max={120}
          step={1}
          defaultValue={0}
        />
        <br />

        <button type="submit">Search</button>
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
