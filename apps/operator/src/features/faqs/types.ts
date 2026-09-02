export interface AdminFaq {
  id: number;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
}

export interface AdminFaqsResponse {
  data: AdminFaq[];
}

export interface CreateFaqPayload {
  question: string;
  answer: string;
  display_order?: number;
  is_active?: boolean;
}

export type UpdateFaqPayload = Partial<CreateFaqPayload>;

export interface FaqMutationResponse {
  status?: string;
  message?: string;
  data?: AdminFaq;
}
