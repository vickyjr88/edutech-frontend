
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
  position: string;  // Changed from 'value' to 'position'
  institution: string; // Added separate institution field
  institutionType: InstitutionType | ""; // Added institution type
  details?: string;
  saved?: boolean;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  curriculums: string[];
  grades: string[];
  subjects: string[];
  reportingManager?: {
    name: string;
    phoneNumber: string;
  };
};
