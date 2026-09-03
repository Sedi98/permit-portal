export type ReportStatus =
  | "completed"
  | "registered"
  | "assigned"
  | "awaiting_revision"
  | "awaiting_payment"
  | "rejected"
  | "unprocessed";

export interface ReportParams {
  permit_service_id?: number;
  date_from?: string;
  date_to?: string;
  status: ReportStatus;
  per_page: 20 | 50 | 100;
  page: number;
}

export type ReportExportParams = Pick<
  ReportParams,
  "permit_service_id" | "date_from" | "date_to"
>;

export interface ReportItem {
  row_number: number;
  issuing_authority: string;
  owner_info: string;
  voen: string | null;
  issued_info: string;
  validity_period: string;
  action: string;
  addendum_info: string;
  reissued_info: string;
  duplicate_info: string;
  suspension_info: string;
  cancellation_info: string;
}

export interface ReportsResponse {
  status: string;
  data: {
    data: ReportItem[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}
