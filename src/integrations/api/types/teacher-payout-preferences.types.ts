export interface TeacherPayoutPreferences {
  _id: string;
  teacherId: string;
  frequency: PayoutFrequency;
  minimumAmount: number;
  automaticPayouts: boolean;
  preferredPayoutDay?: number; // Day of month (1-31) for monthly, day of week (1-7) for weekly
  taxWithholdingPercentage?: number;
  priorityBankAccountId?: string;
  savingsPercentage?: number; // Percentage to send to savings account
  advancedRules: PayoutRule[];
  createdAt: string;
  updatedAt: string;
}

export interface PayoutFrequency {
  type: 'instant' | 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';
  customInterval?: number; // For custom frequencies (in days)
  description: string;
  processingTime: string; // e.g., "Same day", "1-2 business days"
  minimumTierRequired?: TeacherTier;
}

export interface PayoutRule {
  _id: string;
  name: string;
  condition: PayoutRuleCondition;
  action: PayoutRuleAction;
  isActive: boolean;
}

export interface PayoutRuleCondition {
  type: 'amount_threshold' | 'date_based' | 'performance_based';
  value: number | string;
  operator: '>' | '<' | '=' | '>=' | '<=';
}

export interface PayoutRuleAction {
  type: 'change_frequency' | 'adjust_percentage' | 'hold_payout' | 'priority_processing';
  value: number | string;
  targetAccountId?: string;
}

export interface TeacherTier {
  level: 'standard' | 'advanced' | 'super' | 'elite';
  name: string;
  benefits: string[];
  requirements: {
    minEarnings?: number;
    minRating?: number;
    minStudents?: number;
    minClasses?: number;
  };
}

export interface PayoutRecommendation {
  frequency: PayoutFrequency;
  minimumAmount: number;
  reasoning: string;
  potentialSavings: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number; // 0-100
}

export interface PayoutAnalytics {
  averageEarningsPerWeek: number;
  averageEarningsPerMonth: number;
  optimalFrequency: PayoutFrequency;
  cashFlowPrediction: CashFlowPrediction[];
  taxOptimizationSuggestions: TaxSuggestion[];
}

export interface CashFlowPrediction {
  date: string;
  predictedEarnings: number;
  confidence: number;
  factors: string[];
}

export interface TaxSuggestion {
  description: string;
  estimatedSavings: number;
  implementationSteps: string[];
  deadlines?: string[];
}

export interface UpdatePayoutPreferencesRequest {
  frequency?: Partial<PayoutFrequency>;
  minimumAmount?: number;
  automaticPayouts?: boolean;
  preferredPayoutDay?: number;
  taxWithholdingPercentage?: number;
  priorityBankAccountId?: string;
  savingsPercentage?: number;
  advancedRules?: PayoutRule[];
}

// Backend API format (with payoutDay)
export interface BackendPayoutPreferencesRequest {
  period: "weekly" | "biweekly" | "monthly" | "daily" | "instant";
  payoutDay: number;
  minimumPayoutAmount: number;
  autoPayoutEnabled: boolean;
}

// Transformation functions
export const mapToBackendFormat = (frontendData: UpdatePayoutPreferencesRequest): BackendPayoutPreferencesRequest => {
  return {
    period: frontendData.frequency?.type || "weekly",
    payoutDay: frontendData.preferredPayoutDay || 1,
    minimumPayoutAmount: frontendData.minimumAmount || 50,
    autoPayoutEnabled: frontendData.automaticPayouts !== false
  };
};

export const mapFromBackendFormat = (backendData: BackendPayoutPreferencesRequest): Partial<TeacherPayoutPreferences> => {
  const frequencyMap: Record<string, PayoutFrequency> = {
    instant: {
      type: 'instant',
      description: 'Instant payouts',
      processingTime: 'Same day'
    },
    daily: {
      type: 'daily',
      description: 'Daily payouts',
      processingTime: '1-2 business days'
    },
    weekly: {
      type: 'weekly',
      description: 'Weekly payouts',
      processingTime: '2-3 business days'
    },
    biweekly: {
      type: 'biweekly',
      description: 'Bi-weekly payouts',
      processingTime: '2-3 business days'
    },
    monthly: {
      type: 'monthly',
      description: 'Monthly payouts',
      processingTime: '2-3 business days'
    }
  };

  return {
    frequency: frequencyMap[backendData.period] || frequencyMap.weekly,
    minimumAmount: backendData.minimumPayoutAmount,
    automaticPayouts: backendData.autoPayoutEnabled,
    preferredPayoutDay: backendData.payoutDay
  };
};

// Predefined frequency options based on teacher tier
export const PAYOUT_FREQUENCIES: Record<string, PayoutFrequency[]> = {
  standard: [
    {
      type: 'weekly',
      description: 'Weekly (every Monday)',
      processingTime: '2-3 business days'
    },
    {
      type: 'biweekly',
      description: 'Bi-weekly (every other Monday)',
      processingTime: '2-3 business days'
    },
    {
      type: 'monthly',
      description: 'Monthly (1st of each month)',
      processingTime: '2-3 business days'
    }
  ],
  advanced: [
    {
      type: 'daily',
      description: 'Daily (business days only)',
      processingTime: '1-2 business days',
      minimumTierRequired: { level: 'advanced', name: 'Advanced Teacher', benefits: [], requirements: {} }
    },
    {
      type: 'weekly',
      description: 'Weekly (your choice of day)',
      processingTime: '1-2 business days'
    },
    {
      type: 'custom',
      description: 'Custom schedule',
      processingTime: '1-2 business days'
    }
  ],
  super: [
    {
      type: 'instant',
      description: 'Instant payouts',
      processingTime: 'Same day',
      minimumTierRequired: { level: 'super', name: 'Super Teacher', benefits: [], requirements: {} }
    },
    {
      type: 'daily',
      description: 'Daily (including weekends)',
      processingTime: 'Same day'
    },
    {
      type: 'custom',
      description: 'Fully customizable schedule',
      processingTime: 'Same day'
    }
  ]
};