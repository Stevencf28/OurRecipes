import { Button, Container, Image, ListGroup, Stack } from "react-bootstrap";
import { LoaderFunction, json, useLoaderData } from "remix";
import default_pfp from "~/images/blank_profile.png";
import { requireUser } from "~/utils/auth.server";

/**
 * Information on the user returned from the loader
 */
interface UserInfo {
  id: string;
  email: string;
  displayName?: string;
}

interface LoaderData {
  user: UserInfo;
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request);
  return json<LoaderData>({
    user: {
      id: user._id.toString(),
      email: user.email,
      displayName: user.displayName,
    },
  });
};

export default function Profile() {
  const data = useLoaderData<LoaderData>();

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
                <p
                  id="displayName"
                  className={data.user.displayName ? "" : "text-muted"}
                >
                  {data.user.displayName ?? "Name not set"}
                </p>
              </div>
            </ListGroup.Item>
            <ListGroup.Item
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">
                <div className="fw-bold">Email Address</div>
                <p id="emailAddress">{data.user.email}</p>
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
        <form action="/logout" method="post">
          <Button variant="primary" type="submit" className="button">
            Logout
          </Button>
        </form>
      </ListGroup>
    </Stack>
  );
}
