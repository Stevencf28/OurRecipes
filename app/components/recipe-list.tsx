import { Card, Col, Row } from "react-bootstrap";
import { RecipeDetails } from "~/utils/spoonacular.server";

export interface RecipeListProps {
  recipes: RecipeDetails[];
}
export default function RecipeList(recipes): JSX.Element {
  return (
    <Row xs={1} md={3} className="g-5 mt-3 mb-3">
      {recipes.recipes.map((recipe) => (
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
