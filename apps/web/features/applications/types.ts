export const applicationStatusOptions = [
  ["draft", "Qaralama"],
  ["registered", "Qeydiyyata alındı"],
  ["assigned", "İcraçıya həvalə edilib"],
  ["deficiency_confirmation", "Çatışmazlıq bildirişi hazırlanır"],
  ["awaiting_revision", "Düzəliş gözlənilir"],
  ["report_confirmation", "Baxılır"],
  ["payment_confirmation", "Ödəniş tapşırığı hazırlanır"],
  ["awaiting_payment", "Ödəniş gözlənilir"],
  ["payment_review", "Ödəniş yoxlanılır"],
  ["awaiting_signature", "Rəsmiləşdirilir"],
  ["completed", "İcazə verildi"],
] as const;

export type ApplicationStatus = (typeof applicationStatusOptions)[number][0];

export type ApplicationStatusGroup = "in_progress" | "payment_history";

export type ApplicationsQueryParams = {
  status?: ApplicationStatus;
  status_group?: ApplicationStatusGroup;
  search?: string;
};

export type CitizenApplicationListItem = {
  id: number;
  application_no: string | null;
  status: ApplicationStatus | string;
  submitted_at: string;
  permit_service: {
    id: number;
    name: string;
  };
  assigned_user?: {
    id: number;
    name: string;
  } | null;
};

export type DraftProgress = {
  percentage: number;
  completed_steps: number;
  total_steps: number;
};

export type CitizenDraftListItem = {
  id: number;
  status: "draft";
  applicant_type: string;
  permit_service: {
    id: number;
    name: string;
  };
  progress: DraftProgress;
};

export type ApplicationsResponse = {
  status: string;
  data: CitizenApplicationListItem[];
};

export type DraftApplicationsResponse = {
  status: "success";
  data: CitizenDraftListItem[];
};
