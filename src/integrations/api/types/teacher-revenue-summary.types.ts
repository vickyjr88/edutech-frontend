export interface RevenuePeriod {
  period: string; // "2024-01"
  label: string; // "Jan 2024"
  earnings: number;
  payouts: number;
  netRevenue: number;
  transactionCount: number;
  studentCount: number;
  averageEarningPerTransaction: number;
}

export interface RevenueSummary {
  totalEarnings: number;
  totalPayouts: number;
  totalNetRevenue: number;
  averagePerPeriod: number;
  peakEarnings: number;
  peakPeriod: string;
  growthRate: number;
}

export interface RevenueQueryParams {
  startDate: string; // "2024-01-01"
  endDate: string; // "2024-12-31"
  groupBy: string; // "month"
  periodsIncluded: number;
}

export interface TeacherRevenueSummaryResponse {
  periods: RevenuePeriod[];
  summary: RevenueSummary;
  query: RevenueQueryParams;
  currency: string;
  generatedAt: string;
}

export interface RevenueSummaryRequestParams {
  startDate?: string;
  endDate?: string;
  limit?: number;
  groupBy?: 'month' | 'quarter' | 'year';
}