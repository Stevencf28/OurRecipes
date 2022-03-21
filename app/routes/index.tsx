import { Card, Col, Row } from "react-bootstrap";
import { LoaderFunction, json, useLoaderData } from "remix";
import { parseToInt } from "~/utils/parseString";
import {
  RecipeDetails,
  getRandomRecipes,
  searchRecipesByTitle,
} from "~/utils/spoonacular.server";

/**
 * The data returned by the loader for the main page (when not in search mode)
 */
interface MainData {
  type: "main";
  // TODO: filter data and use `Pick<RecipeDetails, "..." | "...">[]`
  recipes: RecipeDetails[];
}

/**
 * The data returned by the loader for searching by title
 */
interface SearchData {
  type: "search";
  results: {
    // TODO: filter data and use `Pick<RecipeDetails, "..." | "...">[]`
    recipes: RecipeDetails[];
    currentPage: number;
    totalPages: number;
  };
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
  const search = url.searchParams.get("q");

  // The page to show, starting from 0
  const page = parseToInt(url.searchParams.get("p") ?? "");

  // If the search is empty, we return the random list of recipes
  if (!search) {
    const { recipes } = await getRandomRecipes({ number: 1 });
    // TODO: filter data to only include what to show to the user
    return json<MainData>({ type: "main", recipes });
  }

  const NUM_RESULTS_PER_PAGE = 2;
  const results = await searchRecipesByTitle(search, {
    number: NUM_RESULTS_PER_PAGE,
    offset: page * NUM_RESULTS_PER_PAGE,
  });
  const totalPages = Math.ceil(results.totalResults / NUM_RESULTS_PER_PAGE);
  const currentPage = results.offset / NUM_RESULTS_PER_PAGE;
  // TODO: filter data to only include what to show to the user
  return json<SearchData>({
    type: "search",
    results: { totalPages, currentPage, recipes: results.results },
  });
};

export default function Index() {
  const data = useLoaderData<LoaderData>();

  return (
    <div className="container">
      <Row xs={1} md={3} className="g-5 mt-3 mb-3">
        {Array.from({ length: 9 }).map((_, idx) => (
          <Col>
            {data.type === "main" &&
              data.recipes.map((recipe) => (
                <a href={recipe.sourceUrl}>
                  <Card>
                    <Card.Img variant="top" src={recipe.image} />
                    <Card.Body>
                      <Card.Title>{recipe.title}</Card.Title>
                    </Card.Body>
                  </Card>
                </a>
              ))}
            {data.type === "search" &&
              data.results.recipes.map((recipe) => (
                <a href={recipe.sourceUrl}>
                  <Card>
                    <Card.Img variant="top" src={recipe.image} />
                    <Card.Body>
                      <Card.Title>{recipe.title}</Card.Title>
                    </Card.Body>
                  </Card>
                </a>
              ))}
          </Col>
        ))}
      </Row>
    </div>

    //Code before Recipe List UI was implemented
    // <div className="container">
    //   <ul>
    //     {data.type === "main" &&
    //       data.recipes.map((recipe) => (
    //         <li key={recipe.id}>
    //           <h3>{recipe.title}</h3>
    //           <p>{recipe.readyInMinutes} mins</p>
    //         </li>
    //       ))}
    //     {data.type === "search" &&
    //       data.results.recipes.map((recipe) => (
    //         <li key={recipe.id}>
    //           <h3>{recipe.title}</h3>
    //           <p>{recipe.readyInMinutes} mins</p>
    //         </li>
    //       ))}
    //   </ul>
    // </div>
  );
}
