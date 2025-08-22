import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDateForDatabase } from '@/components/teacher/professional-profile/utils/experienceUtils';
import { formatDateForDatabase as formatEducationDate } from '@/components/teacher/professional-profile/utils/educationUtils';

// Mock date utilities for testing
const mockCurrentDate = new Date('2024-01-15T12:00:00Z');

describe('Date Utilities and date-fns Wrappers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockCurrentDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDateForDatabase (experienceUtils)', () => {
    it('should format YYYY-MM date correctly', () => {
      const result = formatDateForDatabase('2024-03');
      expect(result).toBe('2024-03-01');
    });

    it('should handle empty string', () => {
      const result = formatDateForDatabase('');
      expect(result).toBe('');
    });

    it('should handle null/undefined', () => {
      expect(formatDateForDatabase(null as any)).toBe('');
      expect(formatDateForDatabase(undefined as any)).toBe('');
    });

    it('should handle full date format and convert to YYYY-MM-01', () => {
      const result = formatDateForDatabase('2024-03-15');
      // Should normalize to YYYY-MM-01 format
      expect(result).toBe('2024-03-01');
    });

    it('should handle Date object input', () => {
      const date = new Date('2024-03-15T10:00:00Z');
      const result = formatDateForDatabase(date.toISOString());
      expect(result).toBe('2024-03-01');
    });

    it('should handle invalid date gracefully', () => {
      const result = formatDateForDatabase('invalid-date');
      expect(result).toBe('invalid-date');
    });

    it('should pad single digit month correctly', () => {
      const date = new Date('2024-01-15');
      const dateString = `${date.getFullYear()}-${date.getMonth() + 1}`; // '2024-1'
      const result = formatDateForDatabase(dateString);
      expect(result).toBe('2024-01-01');
    });
  });

  describe('formatDateForDatabase (educationUtils)', () => {
    it('should format YYYY-MM date correctly', () => {
      const result = formatEducationDate('2023-09');
      expect(result).toBe('2023-09-01');
    });

    it('should handle empty string', () => {
      const result = formatEducationDate('');
      expect(result).toBe('');
    });

    it('should handle different date formats consistently', () => {
      const formats = [
        '2024-01',
        '2024-1', 
        new Date('2024-01-15').toISOString(),
      ];

      formats.forEach(format => {
        const result = formatEducationDate(format);
        expect(result).toBe('2024-01-01');
      });
    });
  });

  describe('Date Calculation Utilities', () => {
    const calculateExpiryTime = (durationInDays: number): Date => {
      return new Date(Date.now() + durationInDays * 24 * 60 * 60 * 1000);
    };

    const isExpired = (expiryDate: Date): boolean => {
      return expiryDate.getTime() < Date.now();
    };

    const getDaysUntilExpiry = (expiryDate: Date): number => {
      const diffMs = expiryDate.getTime() - Date.now();
      return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
    };

    const formatRelativeTime = (date: Date): string => {
      const diffMs = date.getTime() - Date.now();
      const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays === -1) return 'Yesterday';
      if (diffDays > 0) return `In ${diffDays} days`;
      return `${Math.abs(diffDays)} days ago`;
    };

    it('should calculate expiry time correctly', () => {
      const expiryDate = calculateExpiryTime(30); // 30 days from now
      const expectedDate = new Date(mockCurrentDate.getTime() + 30 * 24 * 60 * 60 * 1000);
      expect(expiryDate.getTime()).toBe(expectedDate.getTime());
    });

    it('should detect expired dates', () => {
      const pastDate = new Date(mockCurrentDate.getTime() - 24 * 60 * 60 * 1000); // Yesterday
      const futureDate = new Date(mockCurrentDate.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
      
      expect(isExpired(pastDate)).toBe(true);
      expect(isExpired(futureDate)).toBe(false);
    });

    it('should calculate days until expiry', () => {
      const futureDate = new Date(mockCurrentDate.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days
      expect(getDaysUntilExpiry(futureDate)).toBe(5);
      
      const pastDate = new Date(mockCurrentDate.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
      expect(getDaysUntilExpiry(pastDate)).toBe(-2);
    });

    it('should format relative time correctly', () => {
      const today = mockCurrentDate;
      const tomorrow = new Date(mockCurrentDate.getTime() + 24 * 60 * 60 * 1000);
      const yesterday = new Date(mockCurrentDate.getTime() - 24 * 60 * 60 * 1000);
      const fiveDaysFromNow = new Date(mockCurrentDate.getTime() + 5 * 24 * 60 * 60 * 1000);
      const threeDaysAgo = new Date(mockCurrentDate.getTime() - 3 * 24 * 60 * 60 * 1000);

      expect(formatRelativeTime(today)).toBe('Today');
      expect(formatRelativeTime(tomorrow)).toBe('Tomorrow');
      expect(formatRelativeTime(yesterday)).toBe('Yesterday');
      expect(formatRelativeTime(fiveDaysFromNow)).toBe('In 5 days');
      expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago');
    });
  });

  describe('Date Validation Utilities', () => {
    const isValidDateString = (dateString: string): boolean => {
      const date = new Date(dateString);
      return !isNaN(date.getTime()) && dateString !== '';
    };

    const isValidYearMonth = (yearMonth: string): boolean => {
      return /^\d{4}-\d{2}$/.test(yearMonth);
    };

    const parseYearMonth = (yearMonth: string): { year: number; month: number } | null => {
      if (!isValidYearMonth(yearMonth)) return null;
      
      const [year, month] = yearMonth.split('-').map(Number);
      return { year, month };
    };

    const getMonthName = (monthNumber: number): string => {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return monthNames[monthNumber - 1] || 'Invalid Month';
    };

    it('should validate date strings', () => {
      expect(isValidDateString('2024-01-15')).toBe(true);
      expect(isValidDateString('invalid')).toBe(false);
      expect(isValidDateString('')).toBe(false);
      expect(isValidDateString('2024-02-30')).toBe(true); // JavaScript Date handles this
    });

    it('should validate YYYY-MM format', () => {
      expect(isValidYearMonth('2024-01')).toBe(true);
      expect(isValidYearMonth('2024-1')).toBe(false);
      expect(isValidYearMonth('24-01')).toBe(false);
      expect(isValidYearMonth('2024-13')).toBe(true); // Regex allows, but semantic validation would catch this
    });

    it('should parse year-month strings', () => {
      expect(parseYearMonth('2024-03')).toEqual({ year: 2024, month: 3 });
      expect(parseYearMonth('invalid')).toBeNull();
      expect(parseYearMonth('2024-1')).toBeNull();
    });

    it('should get month names', () => {
      expect(getMonthName(1)).toBe('January');
      expect(getMonthName(12)).toBe('December');
      expect(getMonthName(13)).toBe('Invalid Month');
      expect(getMonthName(0)).toBe('Invalid Month');
    });
  });

  describe('Date Range Utilities', () => {
    const isDateInRange = (date: Date, startDate: Date, endDate: Date): boolean => {
      return date >= startDate && date <= endDate;
    };

    const getDateRangeDays = (startDate: Date, endDate: Date): number => {
      const diffMs = endDate.getTime() - startDate.getTime();
      return Math.ceil(diffMs / (24 * 60 * 60 * 1000));
    };

    const addDays = (date: Date, days: number): Date => {
      return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
    };

    const subtractDays = (date: Date, days: number): Date => {
      return new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
    };

    it('should check if date is in range', () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const inRangeDate = new Date('2024-01-15');
      const outOfRangeDate = new Date('2024-02-01');

      expect(isDateInRange(inRangeDate, startDate, endDate)).toBe(true);
      expect(isDateInRange(outOfRangeDate, startDate, endDate)).toBe(false);
    });

    it('should calculate days between dates', () => {
      const start = new Date('2024-01-01');
      const end = new Date('2024-01-31');
      expect(getDateRangeDays(start, end)).toBe(30);
    });

    it('should add days to date', () => {
      const baseDate = new Date('2024-01-15');
      const result = addDays(baseDate, 10);
      expect(result.toDateString()).toBe(new Date('2024-01-25').toDateString());
    });

    it('should subtract days from date', () => {
      const baseDate = new Date('2024-01-15');
      const result = subtractDays(baseDate, 5);
      expect(result.toDateString()).toBe(new Date('2024-01-10').toDateString());
    });
  });

  describe('Timezone and Locale Utilities', () => {
    const formatDateLocale = (date: Date, locale = 'en-US'): string => {
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    };

    const getTimezoneOffset = (date: Date): number => {
      return date.getTimezoneOffset();
    };

    it('should format dates with locale', () => {
      const date = new Date('2024-01-15T12:00:00Z');
      const formatted = formatDateLocale(date, 'en-US');
      expect(formatted).toContain('January');
      expect(formatted).toContain('2024');
    });

    it('should get timezone offset', () => {
      const date = new Date();
      const offset = getTimezoneOffset(date);
      expect(typeof offset).toBe('number');
    });
  });
});
