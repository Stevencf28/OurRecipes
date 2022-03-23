import { Button, Container, Image, ListGroup, Stack } from "react-bootstrap";
import default_pfp from "~/images/blank_profile.png";

export default function id() {
  return (
    <Stack gap={3} direction="vertical">
      {/* Here is the title for the page */}
      <head>
        <title>Recipe Details</title>
      </head>
      <div className="d-flex justify-content-center">
        <h1>My Profile</h1>
      </div>
      <Stack gap={3} direction="horizontal">
        <Container className="d-flex justify-content-center">
          <Image
            src={default_pfp}
            id="profilePic"
            alt="profile"
            className="img-thumbnail"
            style={{ maxWidth: "14rem" }}
          />
        </Container>
        <Container>
          <ListGroup as="ol">
            <ListGroup.Item
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">Display Name</div>
                <p id="displayName">name</p>
              </div>
            </ListGroup.Item>
            <ListGroup.Item
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">Email Address</div>
                <p id="emailAddress">email</p>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Container>
        <Container className="d-flex justify-content-between align-items-start">
          {/* add edit details function here */}
          <Button variant="primary" href="">
            Edit Details
          </Button>
        </Container>
      </Stack>
      <ListGroup
        horizontal
        className="d-flex gap-2 justify-content-center align-items-center"
      >
        <Button variant="primary" href="/collections">
          Collections
        </Button>
        <Button variant="primary" href="/myRecipes">
          Personal Recipes
        </Button>
        <Button variant="primary" href="/myReviews">
          Reviews
        </Button>
      </ListGroup>
    </Stack>
  );
}
