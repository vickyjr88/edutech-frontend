
// Import all components and types from their respective files
import EducationStep from "./EducationStep";
import ExperienceStep from "./ExperienceStep";
import SimpleListStep from "./SimpleListStep";
import SubjectExpertiseStep from "./SubjectExpertiseStep";
import AcademicSubjectsStep from "./AcademicSubjectsStep";
import AfterSchoolSubjectsStep from "./AfterSchoolSubjectsStep";
import CertificationsStep from "./CertificationsStep";
import VideoStep from "./VideoStep";
import ProgressIndicator from "./ProgressIndicator";
import StrategiesStep from "./StrategiesStep";
import MethodologiesStep from "./MethodologiesStep";
import TechnicalSkillsStep from "./TechnicalSkillsStep";
import LanguagesStep from "./LanguagesStep";
import type { EducationItem, InstitutionType, ExperienceItem } from "./types";
import type { StrategyItem } from "./utils/strategyUtils";
import type { MethodologyItem } from "./utils/methodologyUtils";
import type { AcademicSubjectItem } from "./utils/academicSubjectUtils";
import type { AfterSchoolSubjectItem } from "./utils/afterSchoolSubjectUtils";
import type { TechnicalSkillItem } from "./utils/technicalSkillUtils";
import type { LanguageItem } from "./utils/languageUtils";

// Define CertificationItem type
export type CertificationItem = {
  _id: string;
  name: string;
  details?: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  certificateType?: string;
  description?: string;
  isVerifiable?: boolean;
  credentialUrl?: string;
};

// Export all components and types
export {
  EducationStep,
  ExperienceStep,
  SimpleListStep,
  SubjectExpertiseStep,
  AcademicSubjectsStep,
  AfterSchoolSubjectsStep,
  CertificationsStep,
  VideoStep,
  ProgressIndicator,
  StrategiesStep,
  MethodologiesStep,
  TechnicalSkillsStep,
  LanguagesStep
};

// Export types with the 'export type' syntax
export type { 
  EducationItem, 
  InstitutionType, 
  ExperienceItem, 
  StrategyItem, 
  MethodologyItem,
  AcademicSubjectItem,
  AfterSchoolSubjectItem,
  TechnicalSkillItem,
  LanguageItem
};
