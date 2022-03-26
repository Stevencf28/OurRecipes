/**
 * Conventions:
 * - All validation functions here require the input value to be present. Use
 *   {@link optional} for non-required fields.
 */

import validator from "validator";

/**
 * The result of a validation for a single user input field
 */
export interface FieldValidationResult {
  /**
   * The error message for this field to be displayed to the user if present
   */
  error?: string;

  /**
   * The previous value the user used for this field, along with some
   * modifications such as trimming leading/trailing whitespaces
   *
   * The values given here should be used as the default values for the inputs.
   * For uncontrolled inputs, that means assigning this value to the
   * `defaultValue` attribute. For controlled inputs, it means using this value
   * as the default state value when using `useState` hook. This is mainly for
   * users who don't run javascript in their browser or for some edge cases
   * where the network was very slow or errored out and the user submitted the
   * form before the javascript was loaded.
   */
  value?: string;
}

/**
 * The type of validation functions
 */
export interface Validator {
  (input: unknown): FieldValidationResult;
}

/**
 * Make the validator accept an optional field and not report errors for an
 * empty value
 *
 * @example
 * const result = optional(validateEmail)(form.get("optional-email"));
 */
export const optional =
  (v: Validator): Validator =>
  (input) => {
    if (input === null || typeof input === "undefined") return {};
    const result = v(input);
    if (result.error) result.error += ", or null";
    return result;
  };

/**
 * Validator that only checks if the value is a string and trims the value
 */
export const validateString: Validator = (input: unknown) => {
  if (typeof input !== "string") return { error: "must be a string" };
  const value = validator.trim(input);
  return { value };
};

/**
 * Validator that only checks if the value is a string and leaves the value
 * untouched
 */
export const validateStringRaw: Validator = (input: unknown) => {
  if (typeof input !== "string") return { error: "must be a string" };
  return { value: input };
};

/**
 * Validator that checks if the value is a non-empty string after trimming
 */
export const validateNonEmpty: Validator = (input: unknown) => {
  if (typeof input !== "string") return { error: "must be a string" };
  const value = validator.trim(input);
  if (!value) return { error: "must not be empty", value };
  return { value };
};

/**
 * Validator for email addresses
 */
export const validateEmail: Validator = (input: unknown) => {
  if (typeof input !== "string") return { error: "must be a string" };
  const value = validator.trim(input);
  if (!validator.isEmail(value))
    return { error: "must be a valid email address", value };
  return { value };
};

/**
 * Validator for passwords
 */
export const validatePassword: Validator = (input: unknown) => {
  if (typeof input !== "string") return { error: "must be a string" };
  const isStrong = validator.isStrongPassword(input, {
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
      value: input,
    };
  return { value: input };
};
