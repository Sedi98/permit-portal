import { GetApi, PostApi } from "@/features/http";
import type {
  AwaitingPaymentQueryParams,
  AwaitingPaymentResponse,
  ConfirmPaymentPayload,
  ConfirmPaymentResponse,
} from "./types";

export function getAwaitingPayments(params?: AwaitingPaymentQueryParams) {
  return GetApi<AwaitingPaymentResponse>("/admin/permit-applications", {
    ...params,
    status: "awaiting_payment",
  });
}

export function confirmPayment(applicationId: number, payload: ConfirmPaymentPayload) {
  return PostApi<ConfirmPaymentResponse, ConfirmPaymentPayload>(
    `/admin/permit-applications/${applicationId}/confirm-payment`,
    payload,
  );
}
