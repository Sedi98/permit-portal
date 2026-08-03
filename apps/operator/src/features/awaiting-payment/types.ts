import type { ApplicationListItem } from "@/features/applications/types";

export interface AwaitingPaymentQueryParams {
  search?: string;
  applicant_type?: "physical" | "legal";
  page?: number;
  per_page?: number;
}

export interface AwaitingPaymentResponse {
  status: string;
  data: {
    current_page: number;
    data: ApplicationListItem[];
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ConfirmPaymentPayload {
  amount?: number;
}

export interface ConfirmPaymentResponse {
  status: string;
  message: string;
  data: { id: number; visas: Array<{ department: { id: number; name: string } }> };
}
