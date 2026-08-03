import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "./api";
import type {
  CreateUserPayload,
  UpdateUserPayload,
  UsersQueryParams,
} from "./types";

export function useUsers(params?: UsersQueryParams) {
  return useQuery({
    queryKey: ["users", "list", params],
    queryFn: () => getUsers(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserById(id: number | undefined) {
  return useQuery({
    queryKey: ["users", "detail", id],
    queryFn: () => getUserById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users", "list"] }),
  });
}

export function useUpdateUser(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", "list"] });
      queryClient.invalidateQueries({ queryKey: ["users", "detail", id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users", "list"] }),
  });
}
