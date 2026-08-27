import axios, { type AxiosRequestConfig, isAxiosError } from "axios";

import { apiUrl } from "@/lib/api";

export const Http = axios.create({
  baseURL: apiUrl(""),
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  proxy: false,
});

Http.interceptors.request.use((config) => {
  if (typeof document === "undefined" || config.headers?.Authorization) {
    return config;
  }

  const token = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith("permit_portal_token="))
    ?.split("=")
    .slice(1)
    .join("=");

  if (token) {
    const authorization = `Bearer ${decodeURIComponent(token)}`;

    if (typeof config.headers.set === "function") {
      config.headers.set("Authorization", authorization);
    } else {
      config.headers.Authorization = authorization;
    }
  }

  return config;
});

export const GetApi = async <T = unknown>(
  endpoint: string,
  params?: Record<string, unknown>,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const res = await Http.get<T>(endpoint, { ...config, params });
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

export const PatchApi = async <T = unknown, T2 = unknown>(
  endpoint: string,
  data: T2,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const res = await Http.patch<T>(endpoint, data, config);
    return res.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("PATCH error:", error.message);
    } else if (error instanceof Error) {
      console.error("PATCH error:", error.message);
    }
    throw error;
  }
};

export const PutApi = async <T = unknown, T2 = unknown>(
  endpoint: string,
  data: T2,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const res = await Http.put<T>(endpoint, data, config);
    return res.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("PUT error:", error.message);
    } else if (error instanceof Error) {
      console.error("PUT error:", error.message);
    }
    throw error;
  }
};

export const DeleteApi = async <T = unknown>(
  endpoint: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const res = await Http.delete<T>(endpoint, config);
    return res.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("DELETE error:", error.message);
    } else if (error instanceof Error) {
      console.error("DELETE error:", error.message);
    }
    throw error;
  }
};
