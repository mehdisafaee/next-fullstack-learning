import axios from "axios";

import type { ApiError } from "./types";
import { dispatchApiError } from "./api-error-events";

let isHandlingSessionExpiration = false;

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError<ApiError>(error)) {
      const status = error.response?.status;
      const code = error.response?.data?.error?.code;
      // Handle expired or invalid sessions separately.
      if (
        status === 401 &&
        code === "UNAUTHORIZED" &&
        !isHandlingSessionExpiration
      ) {
        isHandlingSessionExpiration = true;
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("session-expired"));
        }
        return Promise.reject(error);
      }
      // Handle API errors with the global modal.
      if (error.response) {
        dispatchApiError({
          title: status && status >= 500 ? "Server Error" : "Request Failed",
          message:
            status && status >= 500
              ? "A server error occurred. Please try again later."
              : "We couldn't complete your request.",
        });
      } else {
        // No response usually means a network or connection failure.
        dispatchApiError({
          title: "Connection Error",
          message:
            "Unable to connect to the server. Check your connection and try again.",
        });
      }
    }
    return Promise.reject(error);
  },
);
