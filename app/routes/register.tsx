import { ActionFunction, json, useActionData } from "remix";
import User, { UserData } from "~/models/User.server";
import { createSessionAndRedirect, register } from "~/utils/auth.server";
import {
  FieldValidationResult,
  optional,
  validateEmail,
  validatePassword,
  validateString,
} from "~/utils/inputValidation";

interface ActionData {
  email: FieldValidationResult;
  name: FieldValidationResult;
  password: FieldValidationResult;
}

/**
 * Server-side handler of form requests for registering an account
 */
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  // Input validation
  const data: ActionData = {
    name: optional(validateString)(form.get("name")),
    email: validateEmail(form.get("email")),
    password: validatePassword(form.get("password")),
  };

  // Return 400 bad request response if there are any errors
  if (Object.values(data).some((result) => result.error)) {
    return json<ActionData>(data, 400);
  }

  // Due to how the validation functions are written, email and password are
  // guaranteed to exist if there were no errors
  const userData: UserData = {
    email: data.email.value!,
    password: data.password.value!,
    displayName: data.name.value,
  };

  // Check if the email address already exists
  const existing = await User.findOne({ email: userData.email });
  if (existing) {
    data.email.error = `${userData.email} is already registered`;
    return json<ActionData>(data, 400);
  }

  // Register the new user, automatically log in the user by creating the
  // session, and then redirect to the account page
  const user = await register(userData);
  return createSessionAndRedirect(user._id.toString(), "/account");
};

/**
 * The React component for the UI of this page
 */
export default function Registration(): JSX.Element {
  const data = useActionData<ActionData>();

  return (
    <div className="registration-form">
      <form method="post" action="/register">
        <h3 style={{ textAlign: "center" }}>Registration</h3>
        <div className="form-group">
          <div className="form-group">
            <label htmlFor="name">Display Name</label>
            <input
              name="name"
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter display name"
            />
            {/* Display Error Handling */}
            {data?.name.error && (
              <p className="alert alert-danger" role="alert">
                Display name {data.name.error}
              </p>
            )}
          </div>
        </div>
        <div className="form-group">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              name="email"
              type="email"
              className="form-control"
              id="email"
              aria-describedby="emailHelp"
              placeholder="Enter email"
            />
            {/* Email Error Handling */}
            {data?.email.error && (
              <p className="alert alert-danger" role="alert">
                Email {data.email.error}
              </p>
            )}
          </div>
        </div>
        <div className="form-group">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
            />
            {/* Password Error Handling */}
            {data?.password.error && (
              <p className="alert alert-danger" role="alert">
                Password {data.password.error}
              </p>
            )}
          </div>
        </div>
        <div className="buttonContainer">
          <button
            className="btn btn-primary"
            style={{ width: "30%", marginTop: "5%" }}
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
