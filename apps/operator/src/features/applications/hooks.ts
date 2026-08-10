import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  confirmPaymentReceived,
  createConfirmationSequence,
  getApplications,
  getApplicationById,
  getDepartments,
  getRoutingCandidates,
  changeStatus,
  getFileBlob,
  getApplicationDocumentBlob,
  getAwaitingSignatureApplications,
  reviewApplicationFile,
  routeApplication,
  signApplication,
} from "./api";
import type {
  ApplicationsQueryParams,
  CreateConfirmationSequencePayload,
  FileReviewPayload,
  RouteApplicationPayload,
  StatusChangePayload,
} from "./types";

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

export function useRoutingCandidates(enabled = true) {
  return useQuery({
    queryKey: ["applications", "routing-candidates"],
    queryFn: getRoutingCandidates,
    enabled,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: ["applications", "departments"],
    queryFn: getDepartments,
    staleTime: 10 * 60 * 1000,
  });
}

export function useRouteApplication(applicationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RouteApplicationPayload) =>
      routeApplication(applicationId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["applications", "detail", applicationId],
      });
      queryClient.invalidateQueries({ queryKey: ["applications", "list"] });
    },
  });
}

function useInvalidateApplication(applicationId: number) {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: ["applications", "detail", applicationId],
    });
    queryClient.invalidateQueries({ queryKey: ["applications", "list"] });
    queryClient.invalidateQueries({
      queryKey: ["applications", "awaiting-signature"],
    });
  };
}

export function useCreateConfirmationSequence(applicationId: number) {
  const invalidate = useInvalidateApplication(applicationId);

  return useMutation({
    mutationFn: (payload: CreateConfirmationSequencePayload) =>
      createConfirmationSequence(applicationId, payload),
    onSuccess: invalidate,
  });
}

export function useConfirmPaymentReceived(applicationId: number) {
  const invalidate = useInvalidateApplication(applicationId);

  return useMutation({
    mutationFn: () => confirmPaymentReceived(applicationId),
    onSuccess: invalidate,
  });
}

export function useAwaitingSignatureApplications() {
  return useQuery({
    queryKey: ["applications", "awaiting-signature"],
    queryFn: getAwaitingSignatureApplications,
    staleTime: 60 * 1000,
  });
}

export function useSignApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: number) => signApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
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

export function useApplicationDocumentDownload() {
  return useCallback(async (applicationId: number, documentId: number) => {
    const blob = await getApplicationDocumentBlob(applicationId, documentId);
    return URL.createObjectURL(blob);
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

export function useReviewApplicationFile(applicationId: number, fileId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FileReviewPayload) => reviewApplicationFile(applicationId, fileId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "detail", applicationId] });
    },
  });
}
