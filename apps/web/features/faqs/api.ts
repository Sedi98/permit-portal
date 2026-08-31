import { GetApi } from "@/features/http";
import type { FaqsResponse } from "./types";

export function getFaqs() {
  return GetApi<FaqsResponse>("/faqs");
}
