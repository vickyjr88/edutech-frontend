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
      return "Weekly";
    case "twice-weekly":
      return "Twice Weekly";
    case "custom":
      return "Custom Schedule";
    default:
      return "Weekly";
  }
};

/**
 * Maps backend RepeatPattern enum values to internal pattern values
 * @param apiPattern - Backend pattern value ('Weekly', 'Twice Weekly', 'Custom Schedule')
 * @returns Internal pattern value ('weekly', 'twice-weekly', 'custom')
 */
export const getLocalRepeatPatternValue = (apiPattern: string): string => {
  switch (apiPattern) {
    case "Weekly":
      return "weekly";
    case "Twice Weekly":
      return "twice-weekly";
    case "Custom Schedule":
      return "custom";
    default:
      return "weekly";
  }
};