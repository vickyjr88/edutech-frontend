
import { CurrencyType, EarningsType } from './types';

// Format currency based on selected currency
export const formatCurrency = (amount: number, currentCurrency: CurrencyType, isMobile = false): string => {
  // Round the amount for mobile display
  const displayAmount = isMobile ? Math.round(amount / 1000) * 1000 : amount;
  
  // Format based on current currency
  if (currentCurrency.code === "KSH") {
    // Format for KSh with a space and "/=" suffix
    return `${currentCurrency.symbol} ${displayAmount.toLocaleString('en-KE', { maximumFractionDigits: 0 })} ${isMobile ? 'K' : '/='}`;
  } else {
    // Format for other currencies
    if (isMobile && displayAmount >= 1000) {
      return `${currentCurrency.symbol}${Math.round(displayAmount/1000)}K`;
    }
    return `${currentCurrency.symbol}${displayAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
};

// Calculate earnings based on inputs
export const calculateEarnings = (
  teachingFormat: string,
  ratePerHour: number, 
  hoursPerWeek: number, 
  students: number,
  currentCurrency: CurrencyType,
  isMobile = false
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
      daily: formatCurrency(dailyEarnings, currentCurrency, isMobile),
      weekly: formatCurrency(weeklyEarnings, currentCurrency, isMobile),
      monthly: formatCurrency(monthlyEarnings, currentCurrency, isMobile),
      yearly: formatCurrency(yearlyEarnings, currentCurrency, isMobile)
    };
  } else {
    // For group teaching
    const dailyEarnings = rate * (hoursPerWeek / 5) * students; // Convert weekly hours to daily
    const weeklyEarnings = rate * hoursPerWeek * students;
    const monthlyEarnings = weeklyEarnings * 4; // Approximating 4 weeks per month
    const yearlyEarnings = monthlyEarnings * 12;

    return {
      daily: formatCurrency(dailyEarnings, currentCurrency, isMobile),
      weekly: formatCurrency(weeklyEarnings, currentCurrency, isMobile),
      monthly: formatCurrency(monthlyEarnings, currentCurrency, isMobile),
      yearly: formatCurrency(yearlyEarnings, currentCurrency, isMobile)
    };
  }
};
