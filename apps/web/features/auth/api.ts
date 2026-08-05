import { GetApi } from "@/features/http";
import type { MyGovRedirectUrlResponse } from "./types";

export function getMyGovRedirectUrl() {
  return GetApi<MyGovRedirectUrlResponse>("/auth/mygov/redirect-url");
}
