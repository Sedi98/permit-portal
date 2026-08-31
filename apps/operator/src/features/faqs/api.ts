import { DeleteApi, GetApi, PostApi, PutApi } from "@/features/http";
import type {
  AdminFaqsResponse,
  CreateFaqPayload,
  FaqMutationResponse,
  UpdateFaqPayload,
} from "./types";

export function getAdminFaqs() {
  return GetApi<AdminFaqsResponse>("/admin/faqs");
}

export function createFaq(payload: CreateFaqPayload) {
  return PostApi<FaqMutationResponse, CreateFaqPayload>("/admin/faqs", payload);
}

export function updateFaq(id: number, payload: UpdateFaqPayload) {
  return PutApi<FaqMutationResponse, UpdateFaqPayload>(
    `/admin/faqs/${encodeURIComponent(String(id))}`,
    payload,
  );
}

export function deleteFaq(id: number) {
  return DeleteApi<FaqMutationResponse>(
    `/admin/faqs/${encodeURIComponent(String(id))}`,
  );
}
