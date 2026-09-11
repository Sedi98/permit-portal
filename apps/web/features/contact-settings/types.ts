export interface ContactSettings {
  id: number | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  social_links: Record<string, string> | null;
}

export interface ContactSettingsResponse {
  status: string;
  data: ContactSettings;
}
