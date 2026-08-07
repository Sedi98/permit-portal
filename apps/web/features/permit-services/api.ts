import { GetApi } from "@/features/http";
import type { PermitServiceDetailResponse, PermitServicesResponse } from "./types";

export function getPermitServices() {
  return GetApi<PermitServicesResponse>("/permit-services");
}

export function getPermitService(id: number | string) {
  return GetApi<PermitServiceDetailResponse>(`/permit-services/${encodeURIComponent(String(id))}`);
}
