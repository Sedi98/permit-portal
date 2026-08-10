export type RatingPeriod = "daily" | "monthly" | "yearly";

export interface ServiceRatingsQueryParams {
  period: RatingPeriod;
  from?: string;
  to?: string;
}

export interface ServiceRatingsStatistics {
  totalRatings: number;
  averageRating: number;
  currentMonthAverage: number;
  ratings: Record<"1" | "2" | "3" | "4" | "5", number>;
  trend: Array<{ period: string; average: number }>;
}

export interface ServiceRatingsStatisticsResponse {
  status: string;
  data: ServiceRatingsStatistics;
}
