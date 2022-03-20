/**
 * Names of the env variables that we need
 */
export type EnvName = "DB_URI" | "COOKIE_SECRET" | "SPOONACULAR_API_KEY";

/**
 * What to suggest when an env variable is missing
 * @private
 */
const actionMsg =
  process.env.NODE_ENV === "production"
    ? "did you set all environment variables?"
    : "did you create your .env file from .env.example?";

/**
 * Error class for when a needed env variable is missing
 */
export class EnvError extends Error {
  constructor(varName: string) {
    super(`Failed to parse env var ${varName}; ${actionMsg}`);
  }
}

/**
 * Get the needed env variable
 */
export default function getEnv(envName: EnvName): string {
  const parsed = process.env[envName];

  if (!parsed) {
    throw new EnvError(envName);
  }

  return parsed;
}
