import { isAxiosError } from "axios";

export function getAuthErrorDetails(error: unknown) {
  if (isAxiosError(error)) {
    return {
      name: error.name,
      message: error.message,
      code: error.code,
      status: error.response?.status,
      response: error.response?.data,
    };
  }

  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }

  return { error };
}
