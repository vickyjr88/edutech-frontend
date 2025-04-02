
export type InstitutionType = "primary" | "secondary" | "college" | "university" | "vocational" | "other";

export type EducationItem = {
  id: string;
  value: string;
  institution?: string;
  degree?: string;
  details?: string;
  startDate: string;
  endDate: string;
  currentlyStudying: boolean;
  institutionType: InstitutionType | "";
  isSaving?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
};

export type ExperienceItem = {
  id: string;
  value: string;
  details?: string;
  saved?: boolean;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  curriculums: string[];  // Changed from single curriculum to array
  grades: string[];       // Changed from single grade to array
  subjects: string[];
  reportingManager?: {
    name: string;
    phone: string;  // Changed from email to phone
  };
};
