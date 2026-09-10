import type { DocumentType } from "@/features/document-types/types";

export type PermitServiceCategory = "permit" | "certificate";
export type AllowedApplicantType = "physical" | "legal" | "both";
export type DocumentApplicantType = "physical" | "legal" | null;
export type DocumentTypeApplicantTypes = Record<string, DocumentApplicantType>;

export interface ManagedPermitServiceDocumentType extends DocumentType {
  created_at: string;
  updated_at: string;
  pivot: {
    permit_service_id: number;
    document_type_id: number;
    display_order: number;
    applicant_type: DocumentApplicantType;
  };
}

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
  document_types?: ManagedPermitServiceDocumentType[];
  documentTypes?: ManagedPermitServiceDocumentType[];
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
  document_type_ids: number[];
  document_type_applicant_types: DocumentTypeApplicantTypes;
}
