export type ConfirmationType = "deficiency" | "report" | "payment";
export type ConfirmationRole = "visa" | "sign" | "approve";

export interface ConfirmationQueueParams {
  type: ConfirmationType;
  role: ConfirmationRole;
}

export interface ConfirmationApplicationSummary {
  id: number;
  application_no?: string;
  applicant_full_name?: string;
  permit_service?: { name?: string };
}

export interface ConfirmationSequenceSummary {
  id: number;
  type: ConfirmationType;
  title?: string | null;
  body?: string | null;
  permit_application?: ConfirmationApplicationSummary;
  application?: ConfirmationApplicationSummary;
}

export interface ConfirmationQueueItem {
  id: number;
  participant_id?: number;
  role?: ConfirmationRole;
  status?: string;
  sequence?: ConfirmationSequenceSummary;
  confirmation_sequence?: ConfirmationSequenceSummary;
  permit_application?: ConfirmationApplicationSummary;
  application?: ConfirmationApplicationSummary;
}

export interface ConfirmationQueueResponse {
  status: string;
  data:
    | ConfirmationQueueItem[]
    | {
        data: ConfirmationQueueItem[];
        current_page?: number;
        last_page?: number;
        total?: number;
      };
}

export interface ApproveConfirmationPayload {
  note?: string;
}
