import type { User } from "@/features/auth/types";

export type ApplicationStatus =
  | "registered"
  | "forwarded"
  | "assigned"
  | "under_review"
  | "in_document_flow"
  | "deficiency_confirmation"
  | "report_confirmation"
  | "payment_confirmation"
  | "awaiting_payment"
  | "payment_review"
  | "awaiting_revision"
  | "awaiting_signature"
  | "sent_for_approval"
  | "completed"
  | "rejected"
  | "suspended";

export type ApplicantType = "physical" | "legal";

export interface ApplicationsQueryParams {
  status?: ApplicationStatus | string;
  status_group?: string;
  permit_service_id?: number;
  search?: string;
  applicant_type?: ApplicantType;
  date_from?: string;
  date_to?: string;
  per_page?: number;
  page?: number;
}

export interface RouteApplicationPayload {
  main_user_id: number;
  joint_user_ids: number[];
  note?: string;
}

export type AssignmentRole = "main" | "joint" | "observer";

export interface StatusChangePayload {
  status: ApplicationStatus;
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

export interface RoutingCandidate {
  id: number;
  name: string;
  email: string;
  fin?: string;
  department_id?: number;
  role?: User["role"];
  department?: Pick<Department, "id" | "name"> | null;
}

export interface Department {
  id: number;
  name: string;
  code: string;
}

export interface DepartmentsResponse {
  status: string;
  data: Department[];
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
  review_status?: "pending" | "accepted" | "rejected" | null;
  review_note?: string | null;
}

export interface AppDocument {
  id: number;
  type?: string;
  status?: string;
  body?: string;
  document_number?: string;
  url?: string;
  signed_at?: string;
  created_at?: string;
  visas?: DocumentVisa[];
}

export interface DocumentVisa {
  id?: number;
  status?: string;
  note?: string | null;
  acted_at?: string | null;
  department: Department;
}

export interface FileReviewPayload {
  review_status: "accepted" | "rejected";
  review_note?: string;
}

export type ConfirmationSequenceType = "deficiency" | "report" | "payment";
export type ConfirmationParticipantRole = "visa" | "sign" | "approve";

export interface ConfirmationParticipantPayload {
  user_id: number;
  role: ConfirmationParticipantRole;
}

export interface CreateConfirmationSequencePayload {
  type: ConfirmationSequenceType;
  title?: string;
  body: string;
  amount?: number;
  participants: ConfirmationParticipantPayload[];
}

export interface ConfirmationParticipant {
  id: number;
  user_id: number;
  role: ConfirmationParticipantRole;
  status?: string;
  note?: string | null;
  user?: Pick<User, "id" | "name">;
}

export interface ConfirmationSequence {
  id: number;
  type: ConfirmationSequenceType;
  title?: string | null;
  body?: string | null;
  amount?: number | string | null;
  status?: string;
  participants?: ConfirmationParticipant[];
}

export interface StatusHistory {
  old_status?: string | null;
  new_status?: string;
  from_status?: string | null;
  to_status?: string;
  note?: string | null;
  changed_by?: User | null;
  changed_by_user?: User | null;
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
  payment_amount?: number | string | null;
  invoice_no?: string | null;
  paid_at?: string | null;
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
  payment_amount?: number | string | null;
  invoice_no?: string | null;
  paid_at?: string | null;
  created_at: string;
  updated_at: string;
  applicant_full_name: string;
  permit_service: PermitService;
  phones: AppPhone[];
  trade_detail: Record<string, unknown> | null;
  files: AppFile[];
  documents: AppDocument[];
  status_histories: StatusHistory[];
  confirmationSequences?: ConfirmationSequence[];
  confirmation_sequences?: ConfirmationSequence[];
  assignees: ApplicationAssignee[];
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

export interface ApplicationsCollectionResponse {
  status: string;
  data:
    | ApplicationListItem[]
    | PaginatedApplicationsResponse["data"];
}

export interface RoutingCandidatesResponse {
  status: string;
  data: RoutingCandidate[];
}

export interface StatusChangeResponse {
  status: string;
  message: string;
  data?: {
    id?: number;
    status?: string;
    review_status?: string;
    review_note?: string | null;
    department?: Department;
    assignees?: ApplicationAssignee[];
    documents?: AppDocument[];
    visas?: DocumentVisa[];
  };
}

export interface ApplicationAssignee {
  id?: number;
  user_id: number;
  assignment_role: AssignmentRole;
  assignment_role_label?: string;
  created_at?: string;
  updated_at?: string;
  user?: User;
}
