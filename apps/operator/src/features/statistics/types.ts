export interface StatisticsData {
  total: number;
  in_progress: number;
  pending: number;
  completed: number;
  rejected: number;
  suspended: number;
}

export interface StatisticsResponse {
  status: string;
  data: StatisticsData;
}
