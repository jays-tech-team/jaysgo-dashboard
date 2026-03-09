/**
 * Gets environment variable value with optional default fallback
 * In Vite, environment variables must be prefixed with VITE_ to be accessible in client code
 *
 * @param {string} key - The environment variable key (without VITE_ prefix)
 * @param {string|number|boolean} [defaultValue] - Default value if env var is not found
 * @returns {string|undefined} The environment variable value or default value
 */
export const getEnvConfig = (
  key: string,
  defaultValue: string | undefined | number | boolean = undefined
) => {
  // Vite automatically prefixes client-side env vars with VITE_
  const envKey = key.startsWith("VITE_") ? key : `VITE_${key}`;

  // Get the value from import.meta.env (Vite's way of accessing env vars)
  const value = import.meta.env[envKey];

  // Return the value if it exists, otherwise return the default
  return value !== undefined ? value : defaultValue;
};

/**
 * Gets environment variable as boolean
 * Treats 'true', '1', 'yes', 'on' as true (case insensitive)
 *
 * @param {string} key - The environment variable key
 * @param {boolean} [defaultValue=false] - Default boolean value
 * @returns {boolean} The boolean value
 */
export const getEnvBoolean = (key: string, defaultValue = false): boolean => {
  const value = getEnvConfig(key, defaultValue?.toString());

  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return ["true", "1", "yes", "on"].includes(value.toLowerCase());
  }

  return defaultValue;
};

/**
 * Gets environment variable as number
 *
 * @param {string} key - The environment variable key
 * @param {number} [defaultValue=0] - Default numeric value
 * @returns {number} The numeric value
 */
export const getEnvNumber = (key: string, defaultValue = 0): number => {
  const value = getEnvConfig(key, defaultValue?.toString());

  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  return defaultValue;
};

/**
 *
 * Return whether the current instance is production
 */
export const isProduction = () => {
  return (
    import.meta.env.MODE != "development" &&
    (!import.meta.env.VITE_ENVIRONMENT ||
      import.meta.env.VITE_ENVIRONMENT == "PRODUCTION")
  );
};
