export type Faq = {
  id: number;
  question: string;
  answer: string;
};

export type FaqsResponse = {
  status: "success";
  data: Faq[];
};
