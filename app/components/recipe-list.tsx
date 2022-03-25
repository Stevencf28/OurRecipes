import { Card, Col, Row } from "react-bootstrap";
import { RecipeDetails } from "~/utils/spoonacular.server";

/**
 * Structure of the recipe information that is meant to be sent to the client
 *
 * If you want more data from {@link RecipeDetails}, you need to add fields here
 * and in {@link recipeForClient}.
 */
export interface Recipe {
  id: number;
  title: string;
  image: string;
  cookingTime: number; // in minutes
  sourceUrl: string;
}

/**
 * Convert a {@link RecipeDetails} object into a {@link Recipe} object
 *
 * If you want more data from {@link RecipeDetails}, you need to add fields here
 * and in {@link Recipe}.
 */
export const recipeForClient = (details: RecipeDetails): Recipe => ({
  id: details.id,
  title: details.title,
  image: details.image,
  cookingTime: details.readyInMinutes,
  sourceUrl: details.sourceUrl,
});

export interface RecipeListProps {
  recipes: Recipe[];
}

export default function RecipeList({ recipes }: RecipeListProps): JSX.Element {
  return (
    <Row xs={1} md={3} className="g-5 mt-3 mb-3">
      {recipes.map((recipe) => (
        <Col key={recipe.id}>
          <a href={recipe.sourceUrl}>
            <Card>
              <Card.Img variant="top" src={recipe.image} />
              <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>
              </Card.Body>
            </Card>
          </a>
        </Col>
      ))}
    </Row>
  );
}
