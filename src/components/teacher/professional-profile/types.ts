
export type InstitutionType = "primary" | "secondary" | "college" | "university" | "vocational" | "other";

export type EducationItem = {
  _id: string;
  value?: string;
  institution?: string;
  institutionName?: string;
  degree?: string;
  additionalDetails?: string;
  startDate: string;
  endDate: string;
  currentlyStudying: boolean;
  institutionType: InstitutionType | "";
  isSaving?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
  saved?: boolean;
};

export type ExperienceItem = {
  _id: string;
  position: string;  // Changed from 'value' to 'position'
  institution: string; // Added separate institution field
  institutionType: InstitutionType | ""; // Added institution type
  additionalDetails?: string;
  saved?: boolean;
  startDate: string;
  endDate: string;
  isCurrentlyWorking: boolean;
  curriculums: string[];
  grades: string[];
  subjects: string[];
  reportingManager?: {
    name: string;
    phoneNumber: string;
  };
};
