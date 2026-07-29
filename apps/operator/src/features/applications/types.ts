import type { User } from "@/features/auth/types";

export type ApplicationStatus =
  | "registered"
  | "assigned"
  | "under_review"
  | "sent_for_approval"
  | "completed"
  | "rejected"
  | "suspended";

export type ApplicantType = "physical" | "legal";

export interface ApplicationsQueryParams {
  status?: ApplicationStatus;
  permit_service_id?: number;
  search?: string;
  applicant_type?: ApplicantType;
  per_page?: number;
  page?: number;
}

export interface AssignPayload {
  assigned_to: number;
}

export interface StatusChangePayload {
  status: Exclude<ApplicationStatus, "registered" | "assigned">;
  rejection_reason?: string;
}

export interface PermitService {
  id: number;
  category_label: string;
  code: string;
  name: string;
  slug: string;
  category?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Executor {
  id: number;
  name: string;
  email: string;
}

export interface AppPhone {
  id: number;
  permit_application_id: number;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface AppFile {
  id: number;
  permit_application_id: number;
  document_type: string;
  original_name: string;
  stored_name: string;
  path: string;
  mime_type: string;
  size: number;
  created_at: string;
  updated_at: string;
}

export interface AppDocument {
  id: number;
  document_number: string;
  url: string;
  created_at: string;
}

export interface StatusHistory {
  from_status: string;
  to_status: string;
  changed_by_user: User;
  created_at: string;
}

export interface ApplicationListItem {
  id: number;
  permit_service_id: number;
  user_id: number | null;
  application_no: string;
  applicant_type: ApplicantType;
  status: ApplicationStatus;
  email: string;
  id_series: string;
  fin: string;
  first_name: string;
  last_name: string;
  father_name: string;
  voen: string | null;
  tin: string | null;
  legal_entity_name: string | null;
  legal_address: string | null;
  organization_type: string | null;
  director_first_name: string | null;
  director_last_name: string | null;
  director_father_name: string | null;
  submitted_at: string;
  assigned_to: number | null;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  files_count: number;
  permit_service: PermitService;
  assigned_user: User | null;
  applicant_full_name: string;
}

export interface ApplicationDetail {
  id: number;
  permit_service_id: number;
  user_id: number | null;
  application_no: string;
  applicant_type: ApplicantType;
  status: ApplicationStatus;
  email: string;

  id_series: string;
  fin: string;
  first_name: string;
  last_name: string;
  father_name: string;
  voen: string | null;
  tin: string | null;
  legal_entity_name: string | null;
  legal_address: string | null;
  organization_type: string | null;
  director_first_name: string | null;
  director_last_name: string | null;
  director_father_name: string | null;
  submitted_at: string;
  assigned_to: User | null;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  permit_service: PermitService;
  phones: AppPhone[];
  trade_detail: Record<string, unknown> | null;
  files: AppFile[];
  documents: AppDocument[];
  status_histories: StatusHistory[];
  assigned_user: User | null;
  user: User | null;
}

export interface PaginatedApplicationsResponse {
  status: string;
  data: {
    current_page: number;
    data: ApplicationListItem[];
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApplicationDetailResponse {
  status: string;
  data: ApplicationDetail;
}

export interface ExecutorsResponse {
  status: string;
  data: Executor[];
}

export interface StatusChangeResponse {
  status: string;
  message: string;
  data?: {
    documents?: AppDocument[];
  };
}
