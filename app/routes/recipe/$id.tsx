import { Badge, Container, ListGroup, Stack } from "react-bootstrap";
import { LoaderFunction, json, useLoaderData } from "remix";
import { parseToInt } from "~/utils/parseString";
import { RecipeInfo, getRecipeInfo } from "~/utils/spoonacular.server";

interface LoaderData {
  recipe?: RecipeInfo;
}

export const loader: LoaderFunction = async ({ params }) => {
  const id = parseToInt(params.id ?? "", 0);

  let recipe: RecipeInfo | undefined; // initialized to undefined

  // Send request to the API only if it's not guaranteed to be invalid
  // (Ids of 0 or less are certainly invalid)
  if (id > 0) {
    recipe = (await getRecipeInfo(id)) ?? undefined;
  }

  // if (!recipe) {
  //   // Recipe not found; send 404 not found response
  //   throw json({ url: new URL(request.url), params }, 404);
  // }

  // The response status should be:
  // - "200 OK" when the recipe is found
  // - "404 Not Found" when the recipe is not found
  const status = recipe ? 200 : 404;
  return json<LoaderData>({ recipe }, status);
};

export default function RecipeDetails() {
  const { recipe } = useLoaderData<LoaderData>();

  return (
    <Stack gap={2} direction="vertical">
      {/* Here is the title for the page */}
      <head>
        <title>Recipe Details</title>
      </head>
      {/*Recipe Title*/}
      <div className="d-flex justify-content-center">
        <h1 id="recipeTitle">{recipe?.title ?? "Not Found"}</h1>
      </div>
      <div className="d-flex justify-content-center">
        <img />
      </div>

      <div>
        {/*Cooking Tools and Cooking Time Container*/}
        <Container>
          <ListGroup as="ol" className="d-flex" variant="flush">
            <ListGroup.Item as="li">
              <div className="fw-bold">Cooking Tools</div>
              <ListGroup
                className="d-flex justify-content-between align-items-start"
                id="cookingToolsGroup"
              >
                {/*Cooking Tools*/}
                {/*For the person creating the response,
                  make it so that it will create the multiple listgroup.items
                  so that it is more adaptive and does not
                  require the amount of items to be hardcoded
                  */}
                <ListGroup.Item
                  as="li"
                  className="d-flex justify-content-around align-items-start"
                >
                  <div className="me-auto">
                    <div className="fw-bold">Cooking Tool</div>
                  </div>
                  <Badge bg="primary" id="amount" pill>
                    Amount
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </ListGroup.Item>
            <ListGroup.Item
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="d-flex">
                <div className="mr-auto p-2 fw-bold">Cooking Time</div>
              </div>
              <div className="d-flex">
                <Badge
                  bg="primary"
                  className="align-self-end"
                  id="cookingTime"
                  pill
                >
                  x minutes/hours
                </Badge>
              </div>
            </ListGroup.Item>
            <ListGroup.Item as="li">
              <div className="fw-bold">Ingredients</div>
              <ListGroup
                className="d-flex justify-content-between align-items-start"
                id="ingredientsGroup"
              >
                {/*Ingredients*/}
                {/*For the person creating the response,
                  make it so that it will create the multiple listgroup.items
                  so that it is more adaptive and does not
                  require the amount of items to be hardcoded
                  */}
                <ListGroup.Item
                  as="li"
                  className="d-flex justify-content-around align-items-start"
                >
                  <div className="me-auto">
                    <div className="fw-bold">Ingredient</div>
                  </div>
                  <Badge bg="primary" id="amount" pill>
                    Amount
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </ListGroup.Item>
            <ListGroup.Item as="li">
              <div className="fw-bold">Instructions</div>
              <ListGroup
                className="d-flex justify-content-between align-items-start"
                id="instructionsGroup"
              >
                {/*Ingredients*/}
                {/*For the person creating the response,
                  make it so that it will create the multiple listgroup.items
                  so that it is more adaptive and does not
                  require the amount of items to be hardcoded
                  */}
                <ListGroup.Item
                  as="li"
                  className="d-flex justify-content-around align-items-start"
                >
                  <div className="me-auto">
                    <div className="fw-bold">Step x</div>
                    <p>Enter Description Here</p>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Container>
      </div>
    </Stack>
  );
}
