import type { ApplicationDetail, Department, PermitService } from "@/features/applications/types";

export interface VisaQueueQueryParams {
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

export interface VisaQueueDocument {
  id: number;
  type: string;
  body: string;
  application: {
    id: number;
    application_no: string;
    permit_service: Pick<PermitService, "name">;
  };
}

export interface VisaQueueItem {
  id: number;
  status: "pending" | "approved" | "returned" | string;
  document: VisaQueueDocument;
  department: Department;
}

export interface VisaQueueResponse {
  status: string;
  data: { data: VisaQueueItem[]; current_page?: number; last_page?: number; total?: number };
}

export interface VisaDecisionPayload {
  note?: string;
}

export interface VisaDecisionResponse {
  status: string;
  message: string;
  data: VisaQueueItem;
}

export type VisaApplicationDetail = ApplicationDetail;
