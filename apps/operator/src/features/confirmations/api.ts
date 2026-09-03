import { GetApi, PostApi } from "@/features/http";

import type {
  ApproveConfirmationPayload,
  ConfirmationHistoryResponse,
  ConfirmationQueueParams,
  ConfirmationQueueResponse,
} from "./types";

export function getConfirmationQueue(params: ConfirmationQueueParams) {
  return GetApi<ConfirmationQueueResponse>(
    "/admin/confirmation-sequences/my-queue",
    params as unknown as Record<string, unknown>,
  );
}

export function getConfirmationHistory(perPage = 20) {
  return GetApi<ConfirmationHistoryResponse>("/service-reports/history", {
    per_page: perPage,
  });
}

export function approveConfirmationParticipant(
  participantId: number,
  payload: ApproveConfirmationPayload,
) {
  return PostApi<
    { status: string; message: string },
    ApproveConfirmationPayload
  >(`/admin/confirmation-participants/${participantId}/approve`, payload);
}
