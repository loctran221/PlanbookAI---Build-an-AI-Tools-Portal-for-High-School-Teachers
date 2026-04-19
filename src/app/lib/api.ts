import axios, { type AxiosError } from "axios";
import { getAccessToken } from "./session";

const rawBase = import.meta.env.VITE_API_URL?.trim();
const baseURL =
  rawBase && rawBase.length > 0 ? rawBase.replace(/\/+$/, "") : "http://localhost:8080";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getApiErrorMessage(error: unknown, fallback = "Request failed"): string {
  const ax = error as AxiosError<{ message?: string }>;
  const data = ax.response?.data;
  if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
    return data.message;
  }
  if (ax.message) {
    return ax.message;
  }
  return fallback;
}
