import { GetApi } from "@/features/http";
import type { MeResponse, MyGovRedirectUrlResponse } from "./types";

const localTestRedirectUrl =
  "https://permit-back.secop.az/api/auth/mygov/redirect-url?redirect_base=http://localhost:3000/login";

export function getMyGovRedirectUrl() {
  const useLocalTestMode = process.env.NEXT_PUBLIC_AUTH_TEST_MODE === "true";

  return GetApi<MyGovRedirectUrlResponse>(
    useLocalTestMode ? localTestRedirectUrl : "/auth/mygov/redirect-url",
  );
}

export function getMe(token?: string | null) {
  return GetApi<MeResponse>("/me", undefined, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
