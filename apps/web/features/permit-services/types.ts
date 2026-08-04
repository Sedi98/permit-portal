export interface PermitService {
  id: number;
  code: string;
  name: string;
  slug: string;
  category: string;
  category_label: string;
  is_active: boolean;
}

export interface PermitServicesResponse {
  status: "success";
  data: PermitService[];
}
