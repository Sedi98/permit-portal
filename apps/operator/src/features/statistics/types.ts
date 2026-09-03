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

export interface DashboardStatisticsParams {
  startDate?: string;
  endDate?: string;
  startYear?: number;
  endYear?: number;
}

export interface PermitServiceStatistic {
  permit_service_id: number;
  permit_service_name: string;
  count: number;
  percentage: number;
}

export interface YearStatistic {
  year: number;
  issued: number;
  applications: number;
}

export interface DashboardStatisticsSummary {
  total_issued: number;
  total_applications: number;
  execution_rate: number;
  top_year: number | null;
  top_year_count: number;
}

export interface DashboardStatisticsData {
  by_permit_service: PermitServiceStatistic[];
  by_year: YearStatistic[];
  summary: DashboardStatisticsSummary;
}

export interface DashboardStatisticsResponse {
  status: "success";
  data: DashboardStatisticsData;
}
