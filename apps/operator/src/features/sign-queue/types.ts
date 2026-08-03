import type { ApplicationAssignee, Department, PermitService } from "@/features/applications/types";

export interface SignQueueQueryParams {
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  per_page?: number;
}

export type SignableDocumentType = "service_letter" | "deficiency" | "rejection" | "permit" | string;

export interface SignQueueVisa {
  department: Pick<Department, "name">;
  status: string;
  note: string | null;
  acted_at?: string | null;
}

export interface SignQueueItem {
  id: number;
  type: SignableDocumentType;
  status: "pending_sign" | "sent" | string;
  body: string;
  application: {
    id: number;
    application_no: string;
    permit_service: Pick<PermitService, "name">;
  };
  prepared_by: Pick<ApplicationAssignee["user"] extends infer T ? NonNullable<T> : never, "id" | "name">;
  visas: SignQueueVisa[];
}

export interface SignQueueResponse {
  status: string;
  data: { data: SignQueueItem[]; current_page?: number; last_page?: number; total?: number };
}

export interface SignDocumentResponse {
  status: string;
  message: string;
  data: {
    id: number;
    status: string;
    document_number: string;
    signed_at: string;
  };
}
