import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Form, NavLink, useLoaderData } from "remix";

export interface UserInfo {
  id: string;
  email: string;
  displayName?: string;
}

export default function Navigation(): JSX.Element {
  const data = useLoaderData<{ user: UserInfo | null }>();
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <NavLink to="/" className="navbar-brand">
          OurRecipes
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/search" className="nav-link">
              Search Recipe
            </NavLink>
            <NavLink to="/account/collections" className="nav-link">
              My Collections
            </NavLink>
          </Nav>
          <Nav className="ms-auto">
            {data?.user ? (
              <>
                <NavLink to="/account" className="nav-link">
                  My Profile: {data.user.displayName || "User"}
                </NavLink>
                <Form action="/logout" method="post">
                  <Button type="submit" variant="danger" id="logOutButton">
                    Logout
                  </Button>
                </Form>{" "}
              </>
            ) : (
              <>
                <NavLink to="/login" className="nav-link">
                  Login
                </NavLink>
                <NavLink to="/register" className="nav-link">
                  Register
                </NavLink>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
