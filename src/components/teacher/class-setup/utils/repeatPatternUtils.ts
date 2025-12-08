/**
 * Utility functions for handling repeat pattern conversions between API and UI formats
 */

/**
 * Maps internal pattern values to backend RepeatPattern enum values
 * @param pattern - Internal pattern value ('weekly', 'twice-weekly', 'custom')
 * @returns Backend pattern value ('Weekly', 'Twice Weekly', 'Custom Schedule')
 */
export const getApiRepeatPatternValue = (pattern: string): string => {
  switch (pattern) {
    case "weekly":
      return "weekly";
    case "twice-weekly":
      return "bi_weekly";
    case "custom":
      return "custom";
    default:
      return "weekly";
  }
};

/**
 * Maps backend RepeatPattern enum values to internal pattern values
 * @param apiPattern - Backend pattern value ('weekly', 'bi_weekly', 'custom')
 * @returns Internal pattern value ('weekly', 'twice-weekly', 'custom')
 */
export const getLocalRepeatPatternValue = (apiPattern: string): string => {
  // Handle both old formats (Capitalized) and new formats (lowercase enum) just in case
  const normalized = apiPattern?.toLowerCase();

  if (normalized === "weekly" || normalized === "weekly") return "weekly";
  if (normalized === "bi_weekly" || normalized === "twice weekly") return "twice-weekly";
  if (normalized === "custom" || normalized === "custom schedule") return "custom";

  return "weekly";
};