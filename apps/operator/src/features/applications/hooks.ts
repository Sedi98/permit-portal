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
  getApplicationPreviewBlob,
  getAwaitingSignatureApplications,
  reviewApplicationFile,
  routeApplication,
  signApplication,
  updateTradeDetail,
} from "./api";
import type {
  ApplicationDetailResponse,
  ApplicationsQueryParams,
  CreateConfirmationSequencePayload,
  FileReviewPayload,
  RouteApplicationPayload,
  StatusChangePayload,
  UpdateTradeDetailPayload,
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

export function useUpdateTradeDetail(applicationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTradeDetailPayload) =>
      updateTradeDetail(applicationId, payload),
    onSuccess: (response, payload) => {
      queryClient.setQueryData<ApplicationDetailResponse>(
        ["applications", "detail", applicationId],
        (current) => {
          if (!current) return current;

          const existing =
            current.data.tradeDetail ?? current.data.trade_detail;
          const returnedTradeDetail =
            response.data.tradeDetail ?? response.data.trade_detail;
          const tradeChanges = Object.fromEntries(
            Object.entries(payload).filter(
              ([field]) => field !== "installed_capacity",
            ),
          ) as Partial<NonNullable<ApplicationDetailResponse["data"]["tradeDetail"]>>;
          const tradeDetail = existing
            ? { ...existing, ...tradeChanges, ...returnedTradeDetail }
            : returnedTradeDetail
              ? ({ ...returnedTradeDetail } as NonNullable<
                  ApplicationDetailResponse["data"]["tradeDetail"]
                >)
              : undefined;
          const installedCapacity =
            response.data.installed_capacity ?? payload.installed_capacity;

          return {
            ...current,
            data: {
              ...current.data,
              ...(tradeDetail ? { tradeDetail } : {}),
              ...(installedCapacity !== undefined
                ? { installed_capacity: installedCapacity }
                : {}),
            },
          };
        },
      );
    },
  });
}

export function useApplicationPreview() {
  return useCallback(async (applicationId: number) => {
    const blob = await getApplicationPreviewBlob(applicationId);
    return URL.createObjectURL(blob);
  }, []);
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
