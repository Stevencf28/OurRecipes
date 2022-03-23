// preparation for loading data into the page
//import type { LoaderFunction } from "remix";

import { Badge, Container, ListGroup, Stack } from "react-bootstrap";

/*
// preparation for loading data into the page for the person creating the response
export const loader: LoaderFunction = ({ params }) => {
  return (

  )
}
*/
export default function name() {
  return (
    <Stack gap={2} direction="vertical">
      {/* Here is the title for the page */}
      <head>
        <title>Recipe Details</title>
      </head>
      {/*Recipe Title*/}
      <div className="d-flex justify-content-center">
        <h1 id="recipeTitle">Recipe Title</h1>
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
