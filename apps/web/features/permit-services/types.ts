export interface PermitService {
  id: number;
  code: string;
  name: string;
  slug: string;
  category: string;
  category_label: string;
  is_active: boolean;
  icon_url: string | null;
  review_duration_days: number;
}

export interface DocumentType {
  id: number;
  name: string;
}

export interface ConfiguredDocumentType extends DocumentType {
  pivot?: {
    display_order: number;
  };
}

export interface PermitServiceDetail extends PermitService {
  short_name: string;
  document_count: number;
  allowed_applicant_types: string;
  icon_path: string | null;
  created_at: string;
  updated_at: string;
  legal_basis: string;
  required_documents: string | null;
  suspension_basis: string;
  review_duration_days: number;
  state_fee: string;
  documentTypes?: DocumentType[];
  document_types?: ConfiguredDocumentType[];
  icon_url: string | null;
}

export interface PermitServicesResponse {
  status: "success";
  data: PermitService[];
}

export interface PermitServiceDetailResponse {
  status: "success";
  data: PermitServiceDetail;
}
