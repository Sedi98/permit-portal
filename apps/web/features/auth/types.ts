export interface MyGovRedirectUrlResponse {
  status: "success";
  data: {
    url: string;
  };
}

export interface MeUser {
  fin: string;
  first_name: string;
  last_name: string;
  father_name: string;
  address: string | null;
  birth_date: string | null;
  id_series: string | null;
  citizenship: string | null;
  voens: Voen[];
}

export interface Voen {
  id: number;
  voen: string;
  company_name: string;
  position: string;
  is_legal_representative: 0 | 1;
}

export interface MeResponse {
  status: "success";
  data: MeUser;
}
