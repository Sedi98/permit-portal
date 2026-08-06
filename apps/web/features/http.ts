import axios, { type AxiosRequestConfig, isAxiosError } from "axios";

export const Http = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  proxy: false,
});

const testMode = process.env.NEXT_APP_TEST_MODE === "true";
const testToken = process.env.NEXT_APP_TEST_TOKEN?.trim();

if (testMode && testToken) {
  Http.defaults.headers.common.Authorization = `Bearer ${testToken}`;
}

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
