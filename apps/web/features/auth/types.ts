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
  voens: string[];
}

export interface MeResponse {
  status: "success";
  data: MeUser;
}
