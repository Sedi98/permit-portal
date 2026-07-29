import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  getApplications,
  getApplicationById,
  getExecutors,
  assignExecutor,
  changeStatus,
  getFileBlob,
} from "./api";
import type { ApplicationsQueryParams, AssignPayload, StatusChangePayload } from "./types";

export function useApplications(params?: ApplicationsQueryParams) {
  return useQuery({
    queryKey: ["applications", "list", params],
    queryFn: () => getApplications(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useApplicationById(id: number | undefined) {
  return useQuery({
    queryKey: ["applications", "detail", id],
    queryFn: () => getApplicationById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useExecutors() {
  return useQuery({
    queryKey: ["applications", "executors"],
    queryFn: getExecutors,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useAssignExecutor(applicationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignPayload) => assignExecutor(applicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "detail", applicationId] });
      queryClient.invalidateQueries({ queryKey: ["applications", "list"] });
    },
  });
}

export function useFileDownload() {
  return useCallback(async (applicationId: number, fileId: number) => {
    const blob = await getFileBlob(applicationId, fileId);
    const url = URL.createObjectURL(blob);
    return url;
  }, []);
}

export function useChangeStatus(applicationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StatusChangePayload) => changeStatus(applicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "detail", applicationId] });
      queryClient.invalidateQueries({ queryKey: ["applications", "list"] });
    },
  });
}
