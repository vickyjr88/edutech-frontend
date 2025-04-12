
import { CurrencyType, EarningsType } from './types';

// Format currency based on selected currency
export const formatCurrency = (amount: number, currentCurrency: CurrencyType): string => {
  // Format based on current currency
  if (currentCurrency.code === "KSH") {
    // Format for KSh with a space and "/=" suffix
    return `${currentCurrency.symbol} ${amount.toLocaleString('en-KE', { maximumFractionDigits: 0 })} /=`;
  } else {
    // Format for other currencies
    return `${currentCurrency.symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
};

// Calculate earnings based on inputs
export const calculateEarnings = (
  teachingFormat: string,
  ratePerHour: number, 
  hoursPerWeek: number, 
  students: number,
  currentCurrency: CurrencyType
): EarningsType => {
  const rate = ratePerHour;
  
  // Adjust rate based on teaching format
  if (teachingFormat === "one-on-one") {
    // For one-on-one, we calculate per student directly
    const dailyEarnings = rate * (hoursPerWeek / 5); // Convert weekly hours to daily (5 working days)
    const weeklyEarnings = rate * hoursPerWeek;
    const monthlyEarnings = weeklyEarnings * 4; // Approximating 4 weeks per month
    const yearlyEarnings = monthlyEarnings * 12;

    return {
      daily: formatCurrency(dailyEarnings, currentCurrency),
      weekly: formatCurrency(weeklyEarnings, currentCurrency),
      monthly: formatCurrency(monthlyEarnings, currentCurrency),
      yearly: formatCurrency(yearlyEarnings, currentCurrency)
    };
  } else {
    // For group teaching
    const dailyEarnings = rate * (hoursPerWeek / 5) * students; // Convert weekly hours to daily
    const weeklyEarnings = rate * hoursPerWeek * students;
    const monthlyEarnings = weeklyEarnings * 4; // Approximating 4 weeks per month
    const yearlyEarnings = monthlyEarnings * 12;

    return {
      daily: formatCurrency(dailyEarnings, currentCurrency),
      weekly: formatCurrency(weeklyEarnings, currentCurrency),
      monthly: formatCurrency(monthlyEarnings, currentCurrency),
      yearly: formatCurrency(yearlyEarnings, currentCurrency)
    };
  }
};
