import { type ClassValue, clsx } from "clsx";
import { FieldErrors } from "react-hook-form";
import { twMerge } from "tailwind-merge";

const baseURL = import.meta.env.VITE_API_ENGIN_URL;

/**
 * This function will merge the class names and remove the duplicates.
 * @param inputs - ClassValue[]
 * @description This function will merge the class names and remove the duplicates.
 * @example cn("bg-red-500", "bg-blue-500", "bg-red-500")
 * @returns
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * This function will format the date to "dd/mm/yyyy hh:mm"
 * @param date - Date object or string
 * @description This function will format the date to "dd/mm/yyyy hh:mm"
 * @example formatDate(new Date())
 * @returns formatted date string
 */
export function formatDate(
  date: Date | string | null,
  hour12: boolean = true,
  time = true
) {
  if (!date) return null;

  if (typeof date === "string") {
    date = new Date(date);
  }

  return date.toLocaleDateString("en-UK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: time ? "2-digit" : undefined,
    minute: time ? "2-digit" : undefined,
    hour12,
  });
}

/**
 * Converts a time string from 24-hour format ("HH:mm") to 12-hour format with AM/PM.
 *
 * @param time24 - The time string in 24-hour format (e.g., "14:30").
 * @returns The time string in 12-hour format with AM/PM (e.g., "02:30 PM").
 *
 * @example
 * convertTo12Hour("09:15"); // returns "09:15 AM"
 * convertTo12Hour("18:45"); // returns "06:45 PM"
 */
export function convertTo12Hour(time24: string) {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;
}

/**
 * Logs a message to the console only in development mode.
 * No logs will appear in production. Even through, remove this function after testing.
 * @param message - The message to log.
 * @example __clog("This is a log message", "log")
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function __clog(...args: any[]) {
  if (import.meta.env.MODE === "development") {
    const style =
      "background-color: darkblue; color: white; font-style: italic; border: 1px solid hotpink; padding:0 3px;";
    // eslint-disable-next-line no-console
    console.log("%cDebug:", style, args);
  }
}

/**
 * Parses structured form data where keys are in the format `productName[fieldName]`
 * and returns a nested object mapping product names to their respective fields and values.
 *
 * Numeric values are automatically converted to numbers; non-numeric values remain as strings.
 *
 * @param formData - The FormData object containing entries with keys in the format `productName[fieldName]`.
 * @returns An object where each key is a product name and its value is an object mapping field names to their values.
 *
 * @example
 * // Given formData with entries:
 * // "apple[price]" => "10"
 * // "apple[quantity]" => "5"
 * // "banana[price]" => "7"
 * // Returns:
 * // {
 * //   apple: { price: 10, quantity: 5 },
 * //   banana: { price: 7 }
 * // }
 */
export function parseStructuredFormData<
  T extends Record<string, string | number>
>(formData: FormData): Record<string, T> {
  const data: Record<string, T> = {};

  for (const [key, value] of formData.entries()) {
    // eslint-disable-next-line no-useless-escape
    const match = key.match(/^([^\[\]]+)\[([^\[\]]+)\]$/);
    if (match) {
      const [, productName, fieldName] = match;

      if (!data[productName]) {
        data[productName] = {} as T;
      }

      const valueStr = typeof value === "string" ? value : value.name ?? "";
      const numericValue = parseFloat(valueStr);

      data[productName][fieldName as keyof T] = isNaN(numericValue)
        ? (valueStr as T[keyof T])
        : (numericValue as T[keyof T]);
    }
  }

  return data;
}

export function getTomorrowDate(localString?: boolean): Date | string {
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1); // Set the date to tomorrow
  tomorrowDate.setHours(0, 0, 0, 0); // Set time to midnight to avoid time-zone differences

  // Return either the localized string or the Date object
  return localString ? tomorrowDate.toISOString() : tomorrowDate;
}

/**
 * Calculates the date after a given number of days from the current date.
 * The result can be returned either as a Date object or as an ISO string.
 *
 * @param {number} days - The number of days to add to the current date (can be positive or negative).
 * @param {boolean} [localString=false] - Optional flag to return the date as an ISO string. Default is false (returns a Date object).
 * @returns {Date | string} - The calculated date, either as a Date object or an ISO string, based on the localString flag.
 */
export function getDateOf(days: number, localString?: boolean): Date | string {
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + days); // Set the date to the days
  tomorrowDate.setHours(0, 0, 0, 0); // Set time to midnight to avoid time-zone differences

  // Return either the localized string or the Date object
  return localString ? tomorrowDate.toISOString() : tomorrowDate;
}

export function getAPIBaseUrl() {
  return baseURL.replace(/\/$/, "") + "/";
}

/**
 * Generates a Cloudinary image URL with the specified transformation options.
 * @param url - The original Cloudinary image URL.
 * @param options - Transformation options (e.g., { width: 300, height: 200, crop: "fill" }).
 * @returns The transformed Cloudinary image URL.
 *
 * @example
 * cloudinaryUrl("https://res.cloudinary.com/demo/image/upload/v123456789/sample.jpg", { width: 300, height: 200, crop: "fill" })
 */
export function cloudinaryUrl(
  url?: string,
  options: {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "crop" | "thumb" | "scale" | "pad";
    quality?: "auto" | number;
    format?: "auto" | "jpg" | "png" | "webp" | "gif";
    gravity?: "face" | "auto" | string;
    effect?: string; // e.g., 'blur:300', 'grayscale'
    radius?: number | "max";
    dpr?: number | "auto";
    flags?: string[]; // e.g., ['progressive', 'lossy']
  } = {}
): string {
  if (!url) return "";

  const urlParts = url.split("/upload/");
  if (urlParts.length !== 2) return url;

  const transformations: string[] = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);
  if (options.gravity) transformations.push(`g_${options.gravity}`);
  if (options.effect) transformations.push(`e_${options.effect}`);
  if (options.radius !== undefined) transformations.push(`r_${options.radius}`);
  if (options.dpr) transformations.push(`dpr_${options.dpr}`);
  if (options.flags?.length)
    transformations.push(`fl_${options.flags.join(".")}`);

  const transformationString = transformations.join(",");

  return transformationString
    ? `${urlParts[0]}/upload/${transformationString}/${urlParts[1]}`
    : url;
}

/**
 * Returns the base public path for serving static assets.
 * Uses VITE_PUBLIC_BASE_PATH if defined, otherwise defaults to "/".
 * all ways end with "/"
 */
export function getPublicPath(): string {
  const path = import.meta.env.VITE_PUBLIC_BASE_PATH;
  if (typeof path === "string" && path.trim() !== "") {
    return path.endsWith("/") ? path : path + "/";
  }
  return "/";
}

/**
 * Joins the public base path with a given file path in the public directory.
 * Ensures there is exactly one slash between them.
 * @param filePath - The file path relative to the public directory (e.g., "images/logo.png").
 * @returns The full URL path with the base public path.
 *
 * @example
 * publicPath("images/logo.png") // "/images/logo.png" or "/base/images/logo.png"
 */
export function publicPath(filePath: string): string {
  const base = getPublicPath();
  return base + filePath.replace(/^\/+/, "");
}

/**
 * Converts a string to a URL-friendly slug.
 * Example: "Hello World!" => "hello-world"
 */
export function slugify(text: string): string {
  if (!text) return "";
  return text
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "") // Remove accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Safely parses a JSON string, returning a fallback value if parsing fails.
 * @param value - The JSON string to parse.
 * @param fallback - The value to return if parsing fails (default: null).
 * @returns The parsed object or the fallback value.
 *
 * @example
 * jsonSafeParse('{"a":1}') // { a: 1 }
 * jsonSafeParse('invalid', {}) // {}
 */
export function jsonSafeParse<T = unknown>(
  value: string,
  fallback: T | null = null
): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

/**
 * Generates a URL-friendly slug from a given title string.
 *
 * The function trims whitespace, converts the string to lowercase,
 * removes non-word characters (except spaces and hyphens), replaces
 * spaces with hyphens, and collapses multiple hyphens into one.
 *
 * @param title - The input string to generate a slug from.
 * @returns The generated slug as a lowercase, hyphen-separated string.
 */
export const generateSlug = (title: string): string => {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/((^-)|(-$))/, "");
};

/**
 * Parses URL hash values in the format #key1:value1|key2:value2
 * @param hash - The URL hash string (with or without #)
 * @returns Object with parsed key-value pairs
 *
 * @example
 * parseHash("#activeMenu:order|activeButton:price")
 * // Returns: { activeMenu: "order", activeButton: "price" }
 */
export function parseHash(hash: string): Record<string, string> {
  const result: Record<string, string> = {};

  // Remove # if present
  const cleanHash = hash.startsWith("#") ? hash.slice(1) : hash;

  if (!cleanHash) return result;

  // Split by | to get key-value pairs
  const pairs = cleanHash.split("|");

  pairs.forEach((pair) => {
    const [key, value] = pair.split(":");
    if (key && value) {
      result[key.trim()] = value.trim();
    }
  });

  return result;
}

/**
 * Builds a URL hash string from key-value pairs
 * @param params - Object with key-value pairs
 * @returns Hash string in format #key1:value1|key2:value2
 *
 * @example
 * buildHash({ activeMenu: "order", activeButton: "price" })
 * // Returns: "#activeMenu:order|activeButton:price"
 */
export function buildHash(params: Record<string, string>): string {
  const pairs = Object.entries(params)
    .filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([__data, value]) => value !== undefined && value !== null && value !== ""
    )
    .map(([key, value]) => `${key}:${value}`);

  return pairs.length > 0 ? `#${pairs.join("|")}` : "";
}

/**
 * Updates URL hash with new key-value pairs while preserving existing ones
 * @param newParams - New key-value pairs to add/update
 * @returns Updated hash string
 *
 * @example
 * updateHash({ activeTab: "orders" }, "#activeMenu:order|activeButton:price")
 * // Returns: "#activeMenu:order|activeButton:price|activeTab:orders"
 */
export function updateHash(
  newParams: Record<string, string>,
  currentHash?: string
): string {
  const currentParams = parseHash(currentHash || window.location.hash);
  const updatedParams = { ...currentParams, ...newParams };
  return buildHash(updatedParams);
}

/**
 * Gets the current URL hash as parsed key-value pairs
 * @returns Object with current hash parameters
 */
export function getCurrentHash(): Record<string, string> {
  return parseHash(window.location.hash);
}

/**
 * Sets URL hash with new parameters
 * @param params - Key-value pairs to set in hash
 * @param replace - Whether to replace current history entry (default: false)
 */
export function setHash(
  params: Record<string, string>,
  replace: boolean = false
): void {
  const hash = buildHash(params);
  if (replace) {
    window.history.replaceState(null, "", hash);
  } else {
    window.history.pushState(null, "", hash);
  }
}

/**
 * Updates specific hash parameters while preserving others
 * @param newParams - New key-value pairs to add/update
 * @param replace - Whether to replace current history entry (default: false)
 */
export function updateHashParams(
  newParams: Record<string, string>,
  replace: boolean = false
): void {
  const currentParams = getCurrentHash();
  const updatedParams = { ...currentParams, ...newParams };
  setHash(updatedParams, replace);
}

/**
 * Generates a UUID v4 with fallback for older browsers or non-secure contexts
 * @returns {string} A UUID v4 string
 */
export function generateUUID() {
  // Check if crypto.randomUUID is available (modern browsers, secure context)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback 1: Use crypto.getRandomValues if available
  return uuidV4WithCrypto();
}

/**
 * Generate UUID v4 using crypto.getRandomValues
 * @returns {string} A UUID v4 string
 */
export function uuidV4WithCrypto() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);

  // Set version (4) and variant bits
  array[6] = (array[6] & 0x0f) | 0x40; // Version 4
  array[8] = (array[8] & 0x3f) | 0x80; // Variant 10

  // Convert to hex string with dashes
  const hex = Array.from(array, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

/**
 *function that removes any properties from an object that are null, undefined, or empty strings
 * @param obj object to filter
 * @returns obj
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeEmpty<T>(obj: Record<string, any>): T {
  return Object.fromEntries(
    Object.entries(obj).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, v]) => v !== null && v !== undefined && v !== ""
    )
  ) as T;
}

/**
 * Make format as YYYY-MM-DD eg: 2025-08-15
 * @param date Date object
 * @returns date string like 2025-08-15
 */
export function formatDateYYYYMMDD(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
}

export const langRegexForURL = /(\/en|\/ar)(|\/)$/;

export const formatCurrency = ({
  price,
  fractionDigits = 2,
}: {
  currency?: string;
  price: number;
  fractionDigits?: number;
}) => {
  return new Intl.NumberFormat("en-AE", {
    style: "decimal",
    minimumFractionDigits: fractionDigits, // no decimals if you don't want them
  }).format(price);
};

// Helper function to check if URL is a video
export const isVideoUrl = (url: string): boolean => {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
  const lowerUrl = url.toLowerCase();
  return (
    videoExtensions.some((ext) => lowerUrl.includes(ext)) ||
    lowerUrl.includes("video")
  );
};

// Helper function to get MIME type from URL
export const getMimeType = (url: string): string => {
  const lowerUrl = url.toLowerCase();

  // Video MIME types
  if (lowerUrl.includes(".mp4")) return "video/mp4";
  if (lowerUrl.includes(".webm")) return "video/webm";
  if (lowerUrl.includes(".ogg") || lowerUrl.includes(".ogv"))
    return "video/ogg";
  if (lowerUrl.includes(".mov")) return "video/quicktime";
  if (lowerUrl.includes(".avi")) return "video/x-msvideo";
  if (lowerUrl.includes(".wmv")) return "video/x-ms-wmv";
  if (lowerUrl.includes(".flv")) return "video/x-flv";
  if (lowerUrl.includes(".mkv")) return "video/x-matroska";

  // Image MIME types
  if (lowerUrl.includes(".jpg") || lowerUrl.includes(".jpeg"))
    return "image/jpeg";
  if (lowerUrl.includes(".png")) return "image/png";
  if (lowerUrl.includes(".gif")) return "image/gif";
  if (lowerUrl.includes(".bmp")) return "image/bmp";
  if (lowerUrl.includes(".svg")) return "image/svg+xml";
  if (lowerUrl.includes(".webp")) return "image/webp";
  if (lowerUrl.includes(".ico")) return "image/x-icon";
  if (lowerUrl.includes(".tiff") || lowerUrl.includes(".tif"))
    return "image/tiff";

  // Check URL path patterns (e.g., Cloudinary)
  if (lowerUrl.includes("/video/")) return "video/mp4";
  if (lowerUrl.includes("/image/")) return "image/jpeg";

  // Default to image/jpeg if cannot determine
  return "image/jpeg";
};

// Helper function to get media type from URL
export const getMediaType = (url: string): "image" | "video" => {
  const videoExtensions = [
    ".mp4",
    ".webm",
    ".ogg",
    ".mov",
    ".avi",
    ".wmv",
    ".flv",
    ".mkv",
  ];
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".svg",
    ".webp",
  ];
  const lowerUrl = url.toLowerCase();

  // Check for video extensions or 'video' in URL path
  if (
    videoExtensions.some((ext) => lowerUrl.includes(ext)) ||
    lowerUrl.includes("/video/")
  ) {
    return "video";
  }

  // Check for image extensions or 'image' in URL path
  if (
    imageExtensions.some((ext) => lowerUrl.includes(ext)) ||
    lowerUrl.includes("/image/")
  ) {
    return "image";
  }

  // Default to image if cannot determine
  return "image";
};

let maxLoopDepth = 50_000;
/**
 * Function to find the first error in zod error object
 */
export function getFirstError<T extends Record<string, unknown>>(
  errors: FieldErrors<T>,
  withKey = true
): string {
  if (!errors) return "";
  maxLoopDepth--;

  // To avoid infinite loop if there is a circular dependency
  if (maxLoopDepth < 0)
    return "Maximum Validation Depth Exceeded. Please refresh the page.";
  const errorValues = Object.values(errors);
  const errorKeys = Object.keys(errors);

  const firstError = errorValues[0];
  if (errorKeys.length) {
    if (Array.isArray(firstError)) {
      const removeEmpty = firstError.filter(Boolean) as unknown as FieldErrors<
        Record<string, unknown>
      >[];
      if (!removeEmpty) return "";

      return getFirstError(removeEmpty[0]);
    }
    if (errorValues[0]?.message == undefined) {
      return getFirstError(
        errorValues[0] as FieldErrors<Record<string, unknown>>
      );
    }
    return (withKey ? errorKeys[0] + " : " : "") + errorValues[0]?.message;
  }
  return "";
}
