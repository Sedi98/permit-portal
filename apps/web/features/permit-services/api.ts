import { GetApi } from "@/features/http";
import type { PermitServicesResponse } from "./types";

export function getPermitServices() {
  return GetApi<PermitServicesResponse>("/permit-services");
}
