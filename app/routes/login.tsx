import { ActionFunction, Form, Link, useActionData } from "remix";
import loginStyles from "~/styles/login.css";

export function links() {
  return [{ rel: "stylesheet", href: loginStyles }];
}

/**
 * Structure of the data that can be returned by the action
 */
interface ActionData {
  error?: string;
  fields?: {
    email?: string;
    password?: string;
  };
}

/**
 * Server-side handler of non-GET requests to this page
 */
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
};

/**
 * The react component for the UI for this page
 */
export default function Login() {
  const data = useActionData<ActionData>();

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
              defaultValue={data?.fields?.email}
            />
          </div>
          <div className="input">
            <input
              type="password"
              id="password-input"
              name="password"
              placeholder="Enter your password"
              defaultValue={data?.fields?.password}
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
