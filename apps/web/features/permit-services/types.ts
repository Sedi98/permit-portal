export interface PermitService {
  id: number;
  code: string;
  name: string;
  slug: string;
  category: string;
  category_label: string;
  is_active: boolean;
}

export interface PermitServiceDetail extends PermitService {
  short_name: string;
  allowed_applicant_types: string;
  icon_path: string | null;
  created_at: string;
  updated_at: string;
  legal_basis: string;
  required_documents: string | null;
  suspension_basis: string;
  review_duration_days: number;
  state_fee: string;
  document_count: number;
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
