/**
 * Parse the given string to an integer, using the default value if failed to
 * parse
 */
export const parseToInt = (value: string, defaultValue: number = 0): number => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Parse the given string to a float, using the default value if failed to parse
 */
export const parseToFloat = (
  value: string,
  defaultValue: number = 0.0,
): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};
