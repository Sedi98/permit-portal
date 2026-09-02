import { GetApi, PostApi } from "@/features/http";

import type {
  CreateDocumentTypePayload,
  DocumentTypeResponse,
  DocumentTypesResponse,
} from "./types";

export function getDocumentTypes() {
  return GetApi<DocumentTypesResponse>("/admin/document-types");
}

export function createDocumentType(payload: CreateDocumentTypePayload) {
  return PostApi<DocumentTypeResponse, CreateDocumentTypePayload>(
    "/admin/document-types",
    payload,
  );
}
