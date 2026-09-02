import { GetApi } from "@/features/http";
import type { MeResponse, MyGovRedirectUrlResponse } from "./types";

export function getMyGovRedirectUrl() {
  const redirectBase = new URL("/login", window.location.origin).toString();

  return GetApi<MyGovRedirectUrlResponse>(
    "/auth/mygov/redirect-url",
    { redirect_base: redirectBase },
  );
}

export function getMe(token?: string | null) {
  return GetApi<MeResponse>("/me", undefined, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
