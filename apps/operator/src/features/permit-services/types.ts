export type PermitServiceCategory = "permit" | "certificate";
export type AllowedApplicantType = "physical" | "legal" | "both";

export interface ManagedPermitService {
  id: number;
  code: string;
  name: string;
  short_name: string;
  slug: string;
  category: PermitServiceCategory;
  category_label: string;
  allowed_applicant_types: AllowedApplicantType;
  is_active: boolean;
  icon_url: string | null;
  legal_basis: string | null;
  required_documents: string | null;
  suspension_basis: string | null;
  review_duration_days: number | null;
  state_fee: string | number | null;
  document_count: number | null;
}

export interface PermitServicesResponse {
  status: string;
  data: ManagedPermitService[];
}

export interface PermitServiceResponse {
  status: string;
  message?: string;
  data: ManagedPermitService;
}

export interface PermitServiceFormValues {
  name: string;
  short_name: string;
  category: PermitServiceCategory;
  allowed_applicant_types: AllowedApplicantType;
  is_active: boolean;
  icon: File | null;
  legal_basis: string;
  required_documents: string;
  suspension_basis: string;
  review_duration_days: string;
  state_fee: string;
  document_count: string;
}
