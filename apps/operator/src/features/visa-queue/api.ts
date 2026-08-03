import { GetApi, PostApi } from "@/features/http";
import type {
  VisaDecisionPayload,
  VisaDecisionResponse,
  VisaQueueQueryParams,
  VisaQueueResponse,
} from "./types";

export function getVisaQueue(params?: VisaQueueQueryParams) {
  return GetApi<VisaQueueResponse>("/admin/visa-queue", params as Record<string, unknown>);
}

export function approveVisa(visaId: number, payload: VisaDecisionPayload) {
  return PostApi<VisaDecisionResponse, VisaDecisionPayload>(`/admin/visas/${visaId}/approve`, payload);
}

export function returnVisa(visaId: number, payload: VisaDecisionPayload) {
  return PostApi<VisaDecisionResponse, VisaDecisionPayload>(`/admin/visas/${visaId}/return`, payload);
}
