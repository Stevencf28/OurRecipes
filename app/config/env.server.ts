/**
 * Parsed env variables that we can use
 */
export interface Env {
  dbUri: string;
  cookieSecrets: string[];
  spoonacularApiKey: string;
}

/**
 * What to suggest when an env variable is missing
 * @private
 */
const actionMsg =
  process.env.NODE_ENV === "production"
    ? "did you set all environment variables?"
    : "did you create properly formatted .env file from .env.example?";

/**
 * Error class for when a needed env variable is missing
 */
export class EnvError extends Error {
  constructor(varName: string) {
    super(`Failed to parse env var ${varName}; ${actionMsg}`);
  }
}

/**
 * Parse needed values from the env variables
 * @private
 */
const parseEnv = (): Readonly<Env> => {
  const parsed: Partial<Env> = {
    dbUri: process.env.DB_URI,
    cookieSecrets: process.env.COOKIE_SECRET?.split("\n")?.filter(Boolean),
    spoonacularApiKey: process.env.SPOONACULAR_API_KEY,
  };

  if (!parsed.dbUri) {
    throw new EnvError("DB_URI");
  }

  if (!parsed.cookieSecrets || parsed.cookieSecrets.length <= 0) {
    throw new EnvError("COOKIE_SECRET");
  }

  if (!parsed.spoonacularApiKey) {
    throw new EnvError("SPOONACULAR_API_KEY");
  }

  Object.freeze(parsed);

  // Coersion because we already checked all fields
  return parsed as Env;
};

/**
 * Parsed env variables that we can use
 */
const env = parseEnv();
export default env;
