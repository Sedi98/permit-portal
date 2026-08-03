import { DeleteApi, GetApi, PostApi, PutApi } from "@/features/http";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserResponse,
  UsersQueryParams,
  UsersResponse,
} from "./types";

export function getUsers(params?: UsersQueryParams) {
  return GetApi<UsersResponse>("/admin/users", params as Record<string, unknown>);
}

export function getUserById(id: number) {
  return GetApi<UserResponse>(`/admin/users/${id}`);
}

export function createUser(payload: CreateUserPayload) {
  return PostApi<UserResponse, CreateUserPayload>("/admin/users", payload);
}

export function updateUser(id: number, payload: UpdateUserPayload) {
  return PutApi<UserResponse, UpdateUserPayload>(`/admin/users/${id}`, payload);
}

export function deleteUser(id: number) {
  return DeleteApi<{ status: string; message: string }>(`/admin/users/${id}`);
}
