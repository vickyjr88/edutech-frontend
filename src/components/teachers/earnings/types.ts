
// Define currency types and exchange rates
export type CurrencyType = {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number; // Rate relative to USD
};

export type EarningsType = {
  daily: string;
  weekly: string;
  monthly: string;
  yearly: string;
};
