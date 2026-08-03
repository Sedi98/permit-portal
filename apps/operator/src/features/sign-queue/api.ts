import { GetApi, PostApi } from "@/features/http";
import type { SignDocumentResponse, SignQueueQueryParams, SignQueueResponse } from "./types";

export function getSignQueue(params?: SignQueueQueryParams) {
  return GetApi<SignQueueResponse>("/admin/sign-queue", params as Record<string, unknown>);
}

export function signDocument(documentId: number) {
  return PostApi<SignDocumentResponse, undefined>(`/admin/documents/${documentId}/sign`, undefined);
}
