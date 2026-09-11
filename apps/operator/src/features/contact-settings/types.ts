export interface ContactSettings {
  id: number | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  social_links: Record<string, string> | null;
}

export interface ContactSettingsResponse {
  status: string;
  message?: string;
  data: ContactSettings;
}

export interface UpdateContactSettingsPayload {
  phone: string;
  email: string;
  address: string;
  social_links: Record<string, string>;
}
