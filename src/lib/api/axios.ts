import axios from "axios";
import type { ApiError } from "./types";
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
  (error) => {
    if (
      axios.isAxiosError<ApiError>(error) &&
      error.response?.status === 401 &&
      error.response.data?.error?.code === "UNAUTHORIZED" &&
      !isHandlingSessionExpiration
    ) {
      isHandlingSessionExpiration = true;
      window.dispatchEvent(new Event("session-expired"));
    }

    return Promise.reject(error);
  },
);
