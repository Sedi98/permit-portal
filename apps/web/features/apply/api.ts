import { GetApi, PostApi, PutApi } from "@/features/http";
import type { DocumentType } from "@/features/permit-services/types";

export type PhysicalApplicant = {
  id: number;
  status: string;
  fin: string | null;
  first_name: string | null;
  last_name: string | null;
  father_name: string | null;
};

export type ApplicationDetails = PhysicalApplicant & {
  email?: string | null;
  phones?: Array<{ phone: string }>;
  permit_service?: { id: number; name: string; code?: string };
  documentTypes?: DocumentType[];
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

export async function createPhysicalApplication(permitServiceId: number) {
  return PostApi<ApiResponse<PhysicalApplicant>, {
    permit_service_id: number;
    applicant_type: "physical";
  }>("/permit-applications", {
    permit_service_id: permitServiceId,
    applicant_type: "physical",
  });
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

  return PostApi<ApiResponse<unknown>, FormData>(
    `/permit-applications/${applicationId}/files`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
}

export async function submitApplication(applicationId: number) {
  return PostApi<ApiResponse<{ status: string; application_no: string }>, undefined>(
    `/permit-applications/${applicationId}/submit`,
    undefined,
  );
}

export async function submitServiceRating(applicationId: number, rating: number, comment?: string) {
  const payload: { application_id: number; rating: number; comment?: string } = {
    application_id: applicationId,
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
