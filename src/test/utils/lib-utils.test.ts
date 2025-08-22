import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cn, getUserInitials, getNextClassTime, describeAvailability } from '@/lib/utils';

describe('lib/utils', () => {
  describe('cn (class-variance-authority helper)', () => {
    it('should merge class names correctly', () => {
      const result = cn('text-base', 'text-red-500');
      expect(result).toBe('text-base text-red-500'); // tailwind-merge should keep the last one
    });

    it('should handle conditional classes', () => {
      const result = cn(
        'text-base',
        true && 'text-red-500',
        false && 'text-blue-500'
      );
      expect(result).toBe('text-base text-red-500');
    });

    it('should handle empty/null/undefined inputs', () => {
      const result = cn('text-base', null, undefined, '');
      expect(result).toBe('text-base');
    });

    it('should merge conflicting tailwind classes correctly', () => {
      // tailwind-merge should keep the last conflicting class
      const result = cn('p-4 px-6', 'py-8');
      expect(result).toBe('p-4 px-6 py-8');
    });

    it('should handle arrays and objects', () => {
      const result = cn(['text-base', 'font-bold'], {
        'text-red-500': true,
        'text-blue-500': false
      });
      expect(result).toBe('text-base font-bold text-red-500');
    });
  });

  describe('getUserInitials', () => {
    it('should extract initials from full name', () => {
      expect(getUserInitials('John Doe')).toBe('JD');
    });

    it('should handle single name', () => {
      expect(getUserInitials('John')).toBe('J');
    });

    it('should handle three names', () => {
      expect(getUserInitials('John Michael Doe')).toBe('JMD');
    });

    it('should handle names with extra spaces', () => {
      expect(getUserInitials('  John   Doe  ')).toBe('JD');
    });

    it('should handle empty string', () => {
      expect(getUserInitials('')).toBe('');
    });

    it('should convert to uppercase', () => {
      expect(getUserInitials('john doe')).toBe('JD');
    });

    it('should handle special characters in names', () => {
      expect(getUserInitials('Jean-Claude Van Damme')).toBe('JCVD');
    });
  });

  describe('getNextClassTime', () => {
    const mockSchedule = {
      daysOfWeek: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
      startTime: '14:30'
    };

    beforeEach(() => {
      // Mock current time to Monday 10:00 AM
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T10:00:00Z')); // Monday
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return next class time on same day if not yet passed', () => {
      const result = getNextClassTime(mockSchedule);
      expect(result).toBe('Monday, 14:30');
    });

    it('should return next class day if current day class has passed', () => {
      // Set time to after class time
      vi.setSystemTime(new Date('2024-01-15T16:00:00Z')); // Monday 4 PM
      const result = getNextClassTime(mockSchedule);
      expect(result).toBe('Wednesday, 14:30');
    });

    it('should handle weekend scheduling', () => {
      vi.setSystemTime(new Date('2024-01-13T10:00:00Z')); // Saturday
      const result = getNextClassTime(mockSchedule);
      expect(result).toBe('Monday, 14:30');
    });

    it('should handle case insensitive day names', () => {
      const schedule = {
        daysOfWeek: ['monday', 'wednesday'],
        startTime: '09:00'
      };
      const result = getNextClassTime(schedule);
      expect(result).toBe('Wednesday, 09:00');
    });

    it('should handle edge case at end of week', () => {
      vi.setSystemTime(new Date('2024-01-19T16:00:00Z')); // Friday after class
      const result = getNextClassTime(mockSchedule);
      expect(result).toBe('Monday, 14:30'); // Next week
    });
  });

  describe('describeAvailability', () => {
    it('should describe availability with single day and time', () => {
      const availability = {
        days: ['monday'],
        times: { morning: true, afternoon: false, evening: false }
      };
      
      const result = describeAvailability(availability);
      expect(result).toBe('Monday in the morning');
    });

    it('should describe availability with multiple days and times', () => {
      const availability = {
        days: ['monday', 'wednesday', 'friday'],
        times: { morning: true, afternoon: true, evening: false }
      };
      
      const result = describeAvailability(availability);
      expect(result).toBe('Monday, Wednesday and Friday in the morning and afternoon');
    });

    it('should handle two days', () => {
      const availability = {
        days: ['tuesday', 'thursday'],
        times: { evening: true }
      };
      
      const result = describeAvailability(availability);
      expect(result).toBe('Tuesday and Thursday in the evening');
    });

    it('should handle no availability', () => {
      const result = describeAvailability(null);
      expect(result).toBe('No availability provided.');
    });

    it('should handle missing days', () => {
      const availability = {
        times: { morning: true }
      };
      
      const result = describeAvailability(availability);
      expect(result).toBe('No availability provided.');
    });

    it('should handle no selected times', () => {
      const availability = {
        days: ['monday'],
        times: { morning: false, afternoon: false, evening: false }
      };
      
      const result = describeAvailability(availability);
      expect(result).toBe('Monday in the no specific time');
    });

    it('should capitalize day names correctly', () => {
      const availability = {
        days: ['TUESDAY'],
        times: { morning: true }
      };
      
      const result = describeAvailability(availability);
      expect(result).toBe('Tuesday in the morning');
    });
  });
});
