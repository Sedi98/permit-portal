import { GetApi, PutApi } from "@/features/http";
import type {
  ContactSettingsResponse,
  UpdateContactSettingsPayload,
} from "./types";

export function getAdminContactSettings() {
  return GetApi<ContactSettingsResponse>("/admin/contact-settings");
}

export function updateAdminContactSettings(payload: UpdateContactSettingsPayload) {
  return PutApi<ContactSettingsResponse, UpdateContactSettingsPayload>(
    "/admin/contact-settings",
    payload,
  );
}
