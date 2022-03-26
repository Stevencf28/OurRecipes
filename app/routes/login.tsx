import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  json,
  redirect,
  useActionData,
} from "remix";
import loginStyles from "~/styles/login.css";
import {
  checkLogin,
  createSessionAndRedirect,
  getUser,
} from "~/utils/auth.server";
import { validateEmail, validateStringRaw } from "~/utils/inputValidation";

export function links() {
  return [{ rel: "stylesheet", href: loginStyles }];
}

/**
 * Server-side handler of GET requests
 */
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (user) throw redirect("/account");
  return {};
};

/**
 * Structure of the data that can be returned by the action
 */
interface ActionData {
  error?: string;
  email?: string;
  password?: string;
}

const LOGIN_FAIL_MESSAGE = "Login failed";

/**
 * Server-side handler of non-GET requests to this page
 */
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  // Input validation
  const email = validateEmail(form.get("email"));
  const password = validateStringRaw(form.get("password"));

  // Make the data beforehand for convenience
  const data: ActionData = {
    error: LOGIN_FAIL_MESSAGE,
    email: email.value,
    password: password.value,
  };

  // Return 400 bad request response if there are any errors
  if (email.error || password.error) {
    return json<ActionData>(data, 400);
  }

  // Due to how the validation functions are written, email and password are
  // guaranteed to exist if there were no errors
  const user = await checkLogin(email.value!, password.value!);
  if (!user) {
    return json<ActionData>(data, 400);
  }

  return createSessionAndRedirect(user._id.toString(), "/account");
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
              defaultValue={data?.email}
            />
          </div>
          <div className="input">
            <input
              type="password"
              id="password-input"
              name="password"
              placeholder="Enter your password"
              defaultValue={data?.password}
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
