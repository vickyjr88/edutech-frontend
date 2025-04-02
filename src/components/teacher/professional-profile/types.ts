
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
  curriculum?: string;
  grade?: string;
  subjects: string[];
  reportingManager?: {
    name: string;
    email: string;
  };
};
