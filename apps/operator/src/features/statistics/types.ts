export interface StatisticsData {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  rejected: number;
  suspended: number;
  unprocessed: number;
  pending_visa: number;
  pending_signature: number;
}

export interface StatisticsResponse {
  status: "success";
  data: StatisticsData;
}
