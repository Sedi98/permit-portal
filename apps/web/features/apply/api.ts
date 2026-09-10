import { GetApi, PostApi, PutApi } from "@/features/http";
import type {
  ConfiguredDocumentType,
  DocumentType,
} from "@/features/permit-services/types";
import type { CitizenApplicationDocument } from "@/features/applications/types";

export type PhysicalApplicant = {
  id: number;
  status: string;
  fin: string | null;
  first_name: string | null;
  last_name: string | null;
  father_name: string | null;
};

export type ApplicantType = "physical" | "legal";

type CreatedApplication = {
  id: number;
  status: string;
  applicant_type: ApplicantType;
  voen?: string | null;
  legal_entity_name?: string | null;
};

export type ApplicationFile = {
  id: number;
  document_type_id: number;
  document_type?: string;
  mime_type?: string;
  original_name: string;
  path: string;
  review_note?: string | null;
  review_status?: string;
  review_status_label?: string;
  size: number;
};

export type ApplicationDetails = PhysicalApplicant & {
  applicant_type?: ApplicantType;
  application_no?: string;
  applicant_full_name?: string | null;
  email?: string | null;
  legal_entity_name?: string | null;
  legal_address?: string | null;
  director_first_name?: string | null;
  director_last_name?: string | null;
  director_father_name?: string | null;
  phones?: Array<{ phone: string }>;
  permit_service?: {
    id: number;
    name: string;
    code?: string;
    documentTypes?: DocumentType[];
    document_types?: ConfiguredDocumentType[];
  };
  documentTypes?: DocumentType[];
  files?: ApplicationFile[];
  invoice_no?: string | null;
  payment_amount?: number | string | null;
  paid_at?: string | null;
  documents?: CitizenApplicationDocument[];
  voen?: string | null;
  trade_detail?: {
    operation_type?: TradeDetailPayload["trade_detail"]["operation_type"];
    goods_category?: string;
    goods_name_volume?: string;
  } | null;
};

type ApiResponse<T> = {
  data: T;
};

export async function getApplication(applicationId: number) {
  return GetApi<ApiResponse<ApplicationDetails>>(`/permit-applications/${applicationId}`);
}

export type ServiceRating = {
  id: number;
  permit_application_id: number;
  rating: number;
};

export type ContactInformationPayload = {
  email: string;
  phones: Array<{ phone: string }>;
};

export type TradeDetailPayload = {
  trade_detail: {
    operation_type: "export" | "import" | "re_export" | "re_import" | "transit";
    goods_category: string;
    goods_name_volume: string;
  };
};

export async function createApplication(
  permitServiceId: number,
  applicantType: ApplicantType,
) {
  return PostApi<ApiResponse<CreatedApplication>, {
    permit_service_id: number;
    applicant_type: ApplicantType;
  }>("/permit-applications", {
    permit_service_id: permitServiceId,
    applicant_type: applicantType,
  });
}

export type LegalEntityPayload = {
  voen?: string;
  legal_address?: string;
};

export async function updateApplicationLegalEntity(
  applicationId: number,
  payload: LegalEntityPayload,
) {
  return PutApi<ApiResponse<ApplicationDetails>, LegalEntityPayload>(
    `/permit-applications/${applicationId}`,
    payload,
  );
}

export async function updateApplicationContact(
  applicationId: number,
  payload: ContactInformationPayload,
) {
  return PutApi<ApiResponse<unknown>, ContactInformationPayload>(
    `/permit-applications/${applicationId}`,
    payload,
  );
}

export async function updateApplicationTradeDetail(
  applicationId: number,
  payload: TradeDetailPayload,
) {
  return PutApi<ApiResponse<unknown>, TradeDetailPayload>(
    `/permit-applications/${applicationId}`,
    payload,
  );
}

export async function uploadApplicationFile(
  applicationId: number,
  documentTypeId: number,
  file: File,
) {
  const formData = new FormData();
  formData.append("document_type_id", documentTypeId.toString());
  formData.append("file", file);

  return PostApi<ApiResponse<ApplicationFile>, FormData>(
    `/permit-applications/${applicationId}/files`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
}

export async function replaceApplicationFile(
  applicationId: number,
  fileId: number,
  file: File,
) {
  const formData = new FormData();
  formData.append("_method", "PUT");
  formData.append("file", file);

  return PostApi<ApiResponse<ApplicationFile>, FormData>(
    `/permit-applications/${applicationId}/files/${fileId}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
}

export async function submitApplication(applicationId: number) {
  const formData = new FormData();

  return PostApi<
    ApiResponse<{ status: string; application_no: string }>,
    FormData
  >(
    `/permit-applications/${applicationId}/submit`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
}

export async function resubmitApplication(applicationId: number) {
  return PostApi<
    ApiResponse<{ id: number; status: string; application_no?: string }>,
    undefined
  >(`/permit-applications/${applicationId}/resubmit`, undefined);
}

export async function submitServiceRating(applicationId: number, rating: number, comment?: string) {
  const payload: { permit_application_id: number; rating: number; comment?: string } = {
    permit_application_id: applicationId,
    rating,
  };

  if (comment?.trim()) {
    payload.comment = comment.trim();
  }

  return PostApi<
    ApiResponse<ServiceRating>,
    typeof payload
  >("/service-ratings", payload);
}
