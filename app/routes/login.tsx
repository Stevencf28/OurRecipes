import { Form, Link } from "remix";
import loginStyles from "~/styles/login.css";

export function links() {
  return [{ rel: "stylesheet", href: loginStyles }];
}

export default function login() {
  return (
    <div className="container">
      <div className="content">
        <h1>Login</h1>
        <Form method="post">
          <div className="input">
            <input
              type="email"
              id="email-input"
              name="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="input">
            <input
              type="password"
              id="password-input"
              name="password"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </Form>
        <div className="links">
          <ul>
            <li>
              <Link prefetch="intent" to="/register">
                Don't have an account? Sign up now.
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
