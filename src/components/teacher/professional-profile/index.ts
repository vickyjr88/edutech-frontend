
// Import all components and types from their respective files
import EducationStep from "./EducationStep";
import ExperienceStep from "./ExperienceStep";
import SimpleListStep from "./SimpleListStep";
import SubjectExpertiseStep from "./SubjectExpertiseStep";
import CertificationsStep from "./CertificationsStep";
import VideoStep from "./VideoStep";
import ProgressIndicator from "./ProgressIndicator";
import StrategiesStep from "./StrategiesStep";
import MethodologiesStep from "./MethodologiesStep";
import type { EducationItem, InstitutionType, ExperienceItem } from "./types";
import type { StrategyItem } from "./utils/strategyUtils";
import type { MethodologyItem } from "./utils/methodologyUtils";

// Export all components and types
export {
  EducationStep,
  ExperienceStep,
  SimpleListStep,
  SubjectExpertiseStep,
  CertificationsStep,
  VideoStep,
  ProgressIndicator,
  StrategiesStep,
  MethodologiesStep
};

// Export types with the 'export type' syntax
export type { EducationItem, InstitutionType, ExperienceItem, StrategyItem, MethodologyItem };
