import { GetApi } from "@/features/http";
import type { ContactSettingsResponse } from "./types";

export function getContactSettings() {
  return GetApi<ContactSettingsResponse>("/contact-settings");
}
