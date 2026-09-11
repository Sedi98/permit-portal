import { isAxiosError } from "axios";

interface ConfirmationErrorResponse {
  message?: string;
}

export function getConfirmationErrorMessage(
  error: unknown,
  fallback: string,
) {
  if (!isAxiosError<ConfirmationErrorResponse>(error)) return fallback;
  return error.response?.data?.message ?? fallback;
}
