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
