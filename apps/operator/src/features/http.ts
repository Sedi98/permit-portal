import axios, { type AxiosRequestConfig, isAxiosError } from "axios";
import { getToken, removeToken } from "@/lib/cookies";

const EXCLUDED_401 = ["/admin/login"];

export const Http = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  proxy: false,
});

Http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

Http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config?.url &&
      !EXCLUDED_401.some((path) => error.config!.url!.startsWith(path))
    ) {
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const GetApi = async <T = unknown>(
  endpoint: string,
  params?: Record<string, unknown>,
): Promise<T> => {
  try {
    const res = await Http.get<T>(endpoint, { params });
    return res.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("GET error:", error.message);
    } else if (error instanceof Error) {
      console.error("GET error:", error.message);
    }
    throw error;
  }
};

export const PostApi = async <T = unknown, T2 = unknown>(
  endpoint: string,
  data: T2,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const res = await Http.post<T>(endpoint, data, config);
    return res.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("POST error:", error.message);
    } else if (error instanceof Error) {
      console.error("POST error:", error.message);
    }
    throw error;
  }
};
