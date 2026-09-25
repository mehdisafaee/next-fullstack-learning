import axios from "axios";
import type { ApiError } from "./types";

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
  (response) => {
    return response;
  },

  (error) => {
    if (axios.isAxiosError<ApiError>(error)) {
      if (error.response) {
        console.log("API error:", error.response.data.error.message);
      }
    }

    return Promise.reject(error);
  },
);
