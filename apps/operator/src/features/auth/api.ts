import { GetApi, PostApi } from "@/features/http";
import type { LoginPayload, LoginResponse, LogoutResponse, UserResponse } from "./types";

export function loginUser(payload: LoginPayload) {
  return PostApi<LoginResponse, LoginPayload>("/admin/login", payload);
}

export function getMe() {
  return GetApi<UserResponse>("/admin/me");
}

export function logoutUser() {
  return PostApi<LogoutResponse, never>("/admin/logout", undefined as never);
}
