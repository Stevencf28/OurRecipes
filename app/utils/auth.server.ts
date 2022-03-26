import bcrypt from "bcrypt";
import { createCookieSessionStorage, redirect } from "remix";
import getEnv from "~/config/env.server";
import User, { UserData, UserDoc } from "~/models/User.server";

// ---------------------------- CONFIG VALUES ----------------------------------

/**
 * Number of days the cookie will last in the user's browser
 * @private
 */
const COOKIE_MAX_AGE_DAYS = process.env.NODE_ENV === "production" ? 30 : 1;

/**
 * The number of rounds to generate salt that is used for password hashing
 * @private
 */
const HASH_ROUNDS = process.env.NODE_ENV === "production" ? 12 : 10;

// ------------------------- SESSION MANAGEMENT --------------------------------

const cookieSecrets = getEnv("COOKIE_SECRET")
  .split("\n")
  .map((value) => value.trim())
  .filter(Boolean);

if (cookieSecrets.length === 0) {
  throw new Error("'COOKIE_SECRET' must have at least 1 non-empty line");
}

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "auth_session",
    secure: process.env.NODE_ENV === "production",
    secrets: cookieSecrets,
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * COOKIE_MAX_AGE_DAYS,
  },
});

const getCurrentSession = (request: Request) =>
  sessionStorage.getSession(request.headers.get("Cookie"));

/**
 * Create a brand-new session for the given user and redirect to the given path
 *
 * This is typically used for logging in the user
 */
export const createSessionAndRedirect = async (
  userId: string,
  redirectUrl: string,
): Promise<Response> => {
  const session = await sessionStorage.getSession();
  session.set("id", userId);
  return redirect(redirectUrl, {
    headers: { "Set-Cookie": await sessionStorage.commitSession(session) },
  });
};

// ---------------------- USER AUTH FUNCTIONALITIES ----------------------------

/**
 * Add a new user with the given information
 *
 * Input validation and uniqueness checks must be performed before calling this
 * function.
 */
export const register = async (data: UserData): Promise<UserDoc> => {
  const hash = await bcrypt.hash(data.password, HASH_ROUNDS);
  return new User({ ...data, password: hash }).save();
};

/**
 * Log out the user by destroying the session, and redirect to login page
 */
export const logout = async (request: Request): Promise<Response> => {
  const session = await getCurrentSession(request);
  return redirect("/login", {
    headers: { "Set-Cookie": await sessionStorage.destroySession(session) },
  });
};
