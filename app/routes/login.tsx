import {
  ActionFunction,
  Form,
  Link,
  LoaderFunction,
  json,
  redirect,
  useActionData,
  useTransition,
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
  return null;
};

/**
 * Structure of the data that can be returned by the action
 *
 * The user is redirected to another page on success. Therefore, the returned
 * data is always an error.
 */
interface ActionData {
  error: string;
  email?: string;
  password?: string;
}

const LOGIN_FAIL_MESSAGE =
  "Invalid credentials. Please check your email and password.";

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
  const { state, type } = useTransition();

  // The "actionRedirect" is when the user is being redirected after a
  // successful request for login
  const isLoading = state === "submitting" || type === "actionRedirect";

  return (
    <div className="container">
      <div className="content">
        <h1>Login</h1>
        <Form method="post">
          <fieldset disabled={isLoading}>
            <div className="input">
              <input
                type="email"
                id="email-input"
                name="email"
                placeholder="Enter your email"
                required
                defaultValue={data?.email}
              />
            </div>
            <div className="input">
              <input
                type="password"
                id="password-input"
                name="password"
                placeholder="Enter your password"
                required
                defaultValue={data?.password}
              />
            </div>
            {isLoading ? (
              // Show the loading spinner if the form is being submitted
              <div className="d-flex justify-content-center">
                <div className="spinner-border text-primary mt-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              // When not loading, show the error message if it exists
              data?.error && (
                <div
                  className="error alert alert-danger mt-3 mb-0"
                  role="alert"
                >
                  {data.error}
                </div>
              )
            )}
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </fieldset>
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
