import { ClassFormValues, CohortData, TeamMember } from "../types";

const STORAGE_KEYS = {
  FORM_DATA: 'class_form_data',
  COHORTS: 'class_cohorts',
  TEAM_MEMBERS: 'class_team_members',
  LAST_ACTIVE_TAB: 'class_last_active_tab',
  FORM_METADATA: 'class_form_metadata',
};

interface FormMetadata {
  lastSaved: number;
  classId: string | null;
  teacherId: string | null;
  completedSteps: string[];
  formDataVersion: number;
}

/**
 * Save form values to local storage
 */
export const saveFormToStorage = (
  formValues: Partial<ClassFormValues>, 
  cohorts: CohortData[], 
  teamMembers: TeamMember[],
  activeTab: string,
  classId: string | null,
  teacherId: string | null
): void => {
  try {
    // Save form values
    localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formValues));
    
    // Save cohorts
    localStorage.setItem(STORAGE_KEYS.COHORTS, JSON.stringify(cohorts));
    
    // Save team members
    localStorage.setItem(STORAGE_KEYS.TEAM_MEMBERS, JSON.stringify(teamMembers));
    
    // Save active tab
    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVE_TAB, activeTab);
    
    // Update metadata
    const existingMetadata = getFormMetadata();
    const completedSteps = [...new Set([...existingMetadata.completedSteps, activeTab])];
    
    const metadata: FormMetadata = {
      lastSaved: Date.now(),
      classId,
      teacherId,
      completedSteps,
      formDataVersion: 1, // Increment this when form structure changes
    };
    
    localStorage.setItem(STORAGE_KEYS.FORM_METADATA, JSON.stringify(metadata));
    
    // Form data saved to local storage
  } catch (error) {
    console.error('Failed to save form data to local storage:', error);
  }
};

/**
 * Get saved form values from local storage
 */
export const getFormFromStorage = (): {
  formValues: Partial<ClassFormValues> | null;
  cohorts: CohortData[];
  teamMembers: TeamMember[];
  activeTab: string;
} => {
  try {
    // Get form values
    const formValuesJson = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
    const formValues = formValuesJson ? JSON.parse(formValuesJson) : null;
    
    // Get cohorts
    const cohortsJson = localStorage.getItem(STORAGE_KEYS.COHORTS);
    const cohorts = cohortsJson ? JSON.parse(cohortsJson) : [];
    
    // Get team members
    const teamMembersJson = localStorage.getItem(STORAGE_KEYS.TEAM_MEMBERS);
    const teamMembers = teamMembersJson ? JSON.parse(teamMembersJson) : [];
    
    // Get active tab
    const activeTab = localStorage.getItem(STORAGE_KEYS.LAST_ACTIVE_TAB) || 'basic';
    
    return {
      formValues,
      cohorts,
      teamMembers,
      activeTab,
    };
  } catch (error) {
    console.error('Failed to get form data from local storage:', error);
    return {
      formValues: null,
      cohorts: [],
      teamMembers: [],
      activeTab: 'basic',
    };
  }
};

/**
 * Get form metadata from local storage
 */
export const getFormMetadata = (): FormMetadata => {
  try {
    const metadataJson = localStorage.getItem(STORAGE_KEYS.FORM_METADATA);
    const metadata = metadataJson ? JSON.parse(metadataJson) : null;
    
    if (metadata) {
      return metadata;
    }
  } catch (error) {
    console.error('Failed to get form metadata from local storage:', error);
  }
  
  // Default metadata
  return {
    lastSaved: 0,
    classId: null,
    teacherId: null,
    completedSteps: [],
    formDataVersion: 1,
  };
};

/**
 * Check if there's a draft in local storage
 */
export const hasDraft = (): boolean => {
  try {
    const formValuesJson = localStorage.getItem(STORAGE_KEYS.FORM_DATA);
    const metadata = getFormMetadata();
    
    // Check if we have form data and it was saved within the last 7 days
    if (formValuesJson && metadata.lastSaved) {
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      return metadata.lastSaved > sevenDaysAgo;
    }
  } catch (error) {
    console.error('Failed to check for draft:', error);
  }
  
  return false;
};

/**
 * Clear form data from local storage
 */
export const clearStoredForm = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.FORM_DATA);
    localStorage.removeItem(STORAGE_KEYS.COHORTS);
    localStorage.removeItem(STORAGE_KEYS.TEAM_MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVE_TAB);
    localStorage.removeItem(STORAGE_KEYS.FORM_METADATA);
    // Form data cleared from local storage
  } catch (error) {
    console.error('Failed to clear form data from local storage:', error);
  }
};

/**
 * Format date for display
 */
export const formatLastSavedDate = (timestamp: number): string => {
  if (!timestamp) return 'Never';
  
  const date = new Date(timestamp);
  return date.toLocaleString();
};