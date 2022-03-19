import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "remix";

export default function Navigation(): JSX.Element {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <NavLink to="/" className="navbar-brand">
          OurRecipes
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/" className="nav-link">
              Something
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
          </Nav>
          {/*
          When implemented authentication
          <Nav className="ms-auto">
            <NavLink to="/profile/:id" className="nav-link">
              Profile
            </NavLink>
            <NavLink to="/logout/:id" className="nav-link">
              Logout
            </NavLink>
          </Nav>
  ;*/}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
