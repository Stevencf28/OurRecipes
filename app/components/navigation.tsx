import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Form, NavLink } from "remix";

export default function Navigation(): JSX.Element {
  // const handleLogout = () => {
  //   console.log("logout button clicked")
  //   //api call to logout or navigation goes here
  // }
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
            <NavLink to="/" className="nav-link">
              Something
            </NavLink>
          </Nav>
          <Nav className="ms-auto">
            <NavLink to="/login" className="nav-link">
              Login
            </NavLink>
            <NavLink to="/register" className="nav-link">
              Register
            </NavLink>
            <NavLink to="/account" className="nav-link">
              Profile
            </NavLink>
            <Form action="/logout" method="post">
              <Button type="submit" variant="danger" id="logOutButton">
                Logout
              </Button>
            </Form>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
