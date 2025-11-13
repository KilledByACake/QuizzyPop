import axios from "axios";
import type { AxiosError } from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5239", // Changed from 5000 to 5239
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // Read token from localStorage (or any other storage you decide to use)
    const token = localStorage.getItem("token");

    // If a token exists, attach it to the Authorization header
    if (token) {
      // Ensure headers exist and are mutable
      if (!config.headers) {
        // We use `as any` here to avoid TypeScript complaining about AxiosHeaders
        config.headers = {} as any;
      }

      // Set the Authorization header (Bearer token)
      (config.headers as any).Authorization = `Bearer ${token}`;
    }

    // Always return the config so the request can continue
    return config;
  },
  (error: AxiosError) => {
    // If something goes wrong before the request is sent, forward the error
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    // For successful responses, just pass the response through
    return response;
  },
  (error: AxiosError) => {
    // If the server responded with an error status code
    if (error.response) {
      const status = error.response.status;

      console.error(
        "API error:",
        status,
        error.response.statusText || "Unknown error"
      );

      // Only redirect to /login if:
      // 1) The status code is 401 (Unauthorized)
      // 2) A token exists, meaning we *thought* the user was logged in
      const token = localStorage.getItem("token");

      if (status === 401 && token) {
        // Clear the invalid/expired token
        localStorage.removeItem("token");

        // Redirect to login page
        // Using location.href triggers a full page navigation
        window.location.href = "/login";
      }
    } else {
      // If there is no response from the server at all (network error, CORS, etc.)
      console.error("API error (no response from server):", error.message);
    }

    // Always forward the error so calling code can handle it as well
    return Promise.reject(error);
  }
);

export default api;