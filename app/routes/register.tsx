import { useState } from "react";
import { ActionFunction, json, useActionData } from "remix";
import validator from "validator";
import User, { UserData } from "~/models/User.server";
import { createSessionAndRedirect, register } from "~/utils/auth.server";

interface ValidationResult {
  // The error messages here should be displayed to the user if present
  error?: string;
  // The values given here should be used as the default values for the inputs.
  // For uncontrolled inputs, that means assigning this value to the
  // `defaultValue` attribute. For controlled inputs, it means using this value
  // as the default state value when using `useState` hook. This is mainly for
  // users who don't run javascript in their browser or for some edge cases
  // where the network was very slow or errored out and the user submitted the
  // form before the javascript was loaded.
  value?: string;
}

interface ActionData {
  email: ValidationResult;
  name: ValidationResult;
  password: ValidationResult;
}

const validateEmail = (email: unknown): ValidationResult => {
  if (typeof email !== "string") return { error: "must be a string" };
  const value = validator.trim(email);
  if (!validator.isEmail(value))
    return { error: "must be a valid email address", value };
  return { value };
};

const validatePassword = (password: unknown): ValidationResult => {
  if (typeof password !== "string") return { error: "must be a string" };
  const isStrong = validator.isStrongPassword(password, {
    minLength: 6,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 1,
  });
  if (!isStrong)
    return {
      error:
        "must be at least 6 characters long and contain at least 1 special character",
      value: password,
    };
  return { value: password };
};

const validateName = (name: unknown): ValidationResult => {
  if (name === null) return {};
  if (typeof name !== "string") return { error: "must be a string or empty" };
  return { value: validator.trim(name) || undefined };
};

/**
 * Server-side handler of form requests for registering an account
 */
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const data: ActionData = {
    name: validateName(form.get("name")),
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

  // An example of assigning the returned value as the default value
  const [email, setEmail] = useState(data?.email.value ?? "");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="registration-form">
      <form>
        <h3 style={{ textAlign: "center" }}>Registraion</h3>
        <div className="form-group">
          <div className="form-group">
            <label htmlFor="name">Display Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Enter display name"
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
            {/* An example of showing the error message */}
            {data?.name.error && (
              <p className="alert alert-danger" role="alert">
                Display name {data.name.error}
              </p>
            )}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />
        </div>
        <div className="buttonContainer">
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "30%", marginTop: "5%" }}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
