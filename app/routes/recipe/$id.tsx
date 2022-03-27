import { Badge, ListGroup, Stack } from "react-bootstrap";
import { Link, LoaderFunction, MetaFunction, json, useLoaderData } from "remix";
import { parseToInt } from "~/utils/parseString";
import { RecipeInfo, getRecipeInfo } from "~/utils/spoonacular.server";

/**
 * The type of data returned by the loader of this page
 */
interface LoaderData {
  recipe?: RecipeInfo;
}

/**
 * Meta tags for this page
 */
export const meta: MetaFunction = ({ data }) => {
  // Note: Do NOT remove that `?` for accessing the `recipe` field from the data
  // I'm not sure if the data returned by the loader is always guaranteed to be
  // there. Don't get fooled by the `as LoaderData` part.
  const title = (data as LoaderData)?.recipe?.title ?? "Recipe Not Found";

  return { title };
};

/**
 * Server-side GET request handler for this page
 */
export const loader: LoaderFunction = async ({ params }) => {
  const id = parseToInt(params.id ?? "", 0);

  let recipe: RecipeInfo | undefined; // initialized to undefined

  // Send request to the API only if it's not guaranteed to be invalid
  // (Ids of 0 or less are certainly invalid)
  if (id > 0) {
    recipe = (await getRecipeInfo(id)) ?? undefined;
  }

  // The response status should be:
  // - "200 OK" when the recipe is found
  // - "404 Not Found" when the recipe is not found
  const status = recipe ? 200 : 404;
  return json<LoaderData>({ recipe }, status);
};

/**
 * The React component for the UI of this page
 */
export default function RecipeDetails() {
  const { recipe } = useLoaderData<LoaderData>();

  return recipe ? (
    <Stack gap={2} direction="vertical">
      {/*Recipe Title*/}
      <div className="d-flex justify-content-center">
        <h1 id="recipeTitle">{recipe.title}</h1>
      </div>
      <div className="d-flex justify-content-center">
        <img src={recipe.image} alt="" />
      </div>

      <ListGroup as="ul" className="d-flex" variant="flush">
        {/*Cooking Tools*/}
        <ListGroup.Item as="li">
          <div className="fw-bold">Cooking Tools</div>
          <ListGroup
            as="ul"
            className="d-flex justify-content-between align-items-start"
            id="cookingToolsGroup"
          >
            <ListGroup.Item
              as="li"
              className="d-flex justify-content-around align-items-center"
            >
              <div className="me-2">
                <div className="fw-bold">Cooking Tool</div>
              </div>
              <Badge bg="primary" id="amount" pill>
                Amount
              </Badge>
            </ListGroup.Item>
          </ListGroup>
        </ListGroup.Item>

        {/* Cooking Time */}
        <ListGroup.Item
          as="li"
          className="d-flex justify-content-between align-items-center"
        >
          <div className="d-flex">
            <div className="mr-auto p-2 fw-bold">Cooking Time</div>
          </div>
          <div className="d-flex align-items-center">
            <Badge
              bg="primary"
              className="align-self-end"
              id="cookingTime"
              pill
            >
              {recipe.readyInMinutes} minutes
            </Badge>
          </div>
        </ListGroup.Item>

        {/*Ingredients*/}
        <ListGroup.Item as="li">
          <div className="fw-bold">Ingredients</div>
          <ListGroup
            as="ul"
            className="d-flex justify-content-between align-items-start"
            id="ingredientsGroup"
          >
            {recipe.extendedIngredients.map((ing) => (
              <ListGroup.Item
                key={ing.id}
                as="li"
                className="d-flex justify-content-around align-items-center"
              >
                <div className="me-2">
                  <div className="fw-bold">{ing.nameClean ?? ing.name}</div>
                </div>
                <Badge bg="primary" id="amount" pill>
                  {ing.amount.toString().substring(0, 5)}{" "}
                  <span>{ing.measures.us.unitLong}</span>
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </ListGroup.Item>

        {/*Instructions*/}
        <ListGroup.Item as="li">
          <div className="fw-bold">Instructions</div>
          {recipe.analyzedInstructions.length > 0 ? (
            // The API already has analyzed the instructions, so we can use them
            <ListGroup
              as="ol"
              className="d-flex justify-content-between align-items-start"
              id="instructionsGroup"
              variant="flush"
            >
              {/* The instructions are divided into sections */}
              {recipe.analyzedInstructions.map((section, idx) => (
                <ListGroup.Item key={`section-${idx}`} as="li">
                  {/* The name of the section if it exists */}
                  <div className="fw-bold">
                    {section.name ||
                      `Section ${idx + 1} of ${
                        recipe.analyzedInstructions.length
                      }`}
                  </div>
                  {/* Instruction Steps for This Section */}
                  <ListGroup
                    as="ol"
                    className="d-flex justify-content-between align-items-start"
                    id="instructionsGroup"
                  >
                    {section.steps.map((step) => (
                      <ListGroup.Item
                        key={`section-${idx}-step-${step.number}`}
                        as="li"
                        className="d-flex justify-content-around align-items-start"
                      >
                        <div className="me-auto">
                          <div className="fw-bold">Step {step.number}</div>
                          <p>{step.step}</p>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            // Our main page uses `getRandomRecipes`, but the API doesn't
            // support only showing recipes with already existing analyzed
            // instructions.
            <p>
              Sorry, we don't support showing instructions for this recipe yet.
              Please go{" "}
              <Link to={recipe.sourceUrl} reloadDocument>
                here
              </Link>{" "}
              to see the instructions.
            </p>
          )}
        </ListGroup.Item>
      </ListGroup>
    </Stack>
  ) : (
    <>
      <h1>Recipe Not Found</h1>
      <p>The URL address you provided does not seem valid.</p>
    </>
  );
}
