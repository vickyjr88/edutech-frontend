// Real API response structure for payout preferences
export interface ApiPayoutPreferencesResponse {
  period: 'monthly' | 'weekly' | 'biweekly' | 'daily' | 'instant';
  minimumPayoutAmount: number;
  currency: string;
  autoPayoutEnabled: boolean;
  payoutDay: number;
  suspendPayouts: boolean;
  nextScheduledPayout: string; // ISO date string
}

// For requests/updates
export interface ApiUpdatePayoutPreferencesRequest {
  period?: 'monthly' | 'weekly' | 'biweekly' | 'daily' | 'instant';
  minimumPayoutAmount?: number;
  autoPayoutEnabled?: boolean;
  payoutDay?: number;
  suspendPayouts?: boolean;
}