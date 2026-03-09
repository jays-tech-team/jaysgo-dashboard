import axios from "axios";
import { toast } from "sonner";
import { ErrorLogger } from "../unities/ErrorLog/ErrorLogger";
import { getAPIBaseUrl } from "./utils";

const baseURL = import.meta.env.VITE_API_ENGIN_URL;

if (!baseURL) {
  throw new Error("VITE_API_ENGIN_URL is not defined in .env file");
}

/**
 * Axios instance with a base URL and interceptors for request and response handling.
 *
 * Call API without the base URL
 * Eg: apiEngine.get("users")
 * Eg: apiEngine.post("users/auth/login", data)
 */
const apiEngine = axios.create({
  baseURL: getAPIBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiEngine.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiEngine.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      console.warn("Request canceled on interceptors", error.message);
    } else if (error.response) {
      const { status, data } = error.response;

      ErrorLogger.log(
        error,
        data.message,
        error.response?.request?.responseURL || "unknown",
        data,
        error?.config?.data || ""
      );

      // By passing the toast false in fetchOptions will ignore the toast message
      const IsToastEnabled =
        typeof error.config?.fetchOptions?.toast == "undefined"
          ? true
          : error.config?.fetchOptions?.toast;

      // Handle 401 Unauthorized
      if (status === 401) {
        localStorage.removeItem("authToken");
        sessionStorage.clear();

        const currentPath = window.location.pathname;
        if (currentPath !== "/signin") {
          window.sessionStorage.setItem("redirectPath", currentPath);
        }
        window.location.href = "/signin";
        return Promise.reject(error);
      }

      if (
        (status === 422 || status === 400) &&
        data.errors &&
        Object.values(data.errors).length > 0
      ) {
        const firstError = Object.values(data.errors)[0] as
          | string[]
          | string
          | undefined;
        if (IsToastEnabled)
          if (Array.isArray(firstError)) {
            toast.error(firstError?.join(", ") || "Validation error");
          } else {
            toast.error(firstError || "Validation error");
          }
        return Promise.reject(error);
      }

      // Show error message in toaster
      const errorMessage = data.message || "An error occurred";

      if (IsToastEnabled) toast.error(errorMessage);
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("An unexpected error occurred");
    }

    return Promise.reject(error);
  }
);

export default apiEngine;
