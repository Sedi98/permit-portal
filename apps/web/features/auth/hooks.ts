"use client";

import { useMutation } from "@tanstack/react-query";
import { getMyGovRedirectUrl } from "./api";

export function useMyGovLogin() {
  return useMutation({
    mutationKey: ["auth", "mygov-login"],
    mutationFn: getMyGovRedirectUrl,
  });
}
