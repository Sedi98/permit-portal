export type DetailItem = {
  text: string;
  emphasis?: boolean;
  children?: {
    ordered?: boolean;
    items: string[];
  };
};

export type DetailSectionData = {
  title: string;
  items: DetailItem[];
};

export type PermissionDetailData = {
  category: string;
  title: string;
  icon: string;
  type: string;
  reviewTime: string;
  fee: string;
  documentCount: string;
  requirements: string[];
  sections: DetailSectionData[];
};
