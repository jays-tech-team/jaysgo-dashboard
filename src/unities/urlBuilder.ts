/**
 * Builds a URL by replacing placeholders in the template with corresponding parameter values.
 *
 * Placeholders in the template should be in the format `:key`, where `key` matches a property in the `params` object.
 * If a parameter is not provided for a placeholder, the placeholder's key (without the colon) will remain in the URL.
 *
 * @param urlTemplate - The URL template containing placeholders (e.g., "/users/:userId/posts/:postId").
 * @param params - An object mapping placeholder keys to their replacement string values.
 * @returns The URL with placeholders replaced by their corresponding parameter values.
 *
 * @example
 * ```typescript
 * buildUrl("/users/:userId/posts/:postId", { userId: "123", postId: "456" });
 * // Returns: "/users/123/posts/456"
 * ```
 */
export function buildUrl(urlTemplate: string, params: Record<string, string>) {
  return urlTemplate.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    if (params[key] === undefined) {
      //if params not set we will keep the placeholder
      return key;
    }
    return params[key];
  });
}
