import React from "react";
import { useProfileJourney } from "./ProfileJourneyContext";
import { 
  PersonalInformationStep,
  LocationStep,
  EducationStep,
  ExperienceStep,
  SubjectExpertiseStep,
  TeachingStyleStep,
  VerificationStep,
  PlatformStep
} from "./steps";

const ProfileStepRenderer = () => {
  const { currentStep } = useProfileJourney();
  
  // Render the current step component
  switch (currentStep) {
    case "personal":
      return <PersonalInformationStep />;
    
    case "location":
      return <LocationStep />;
    
    case "education":
      return <EducationStep />;
    
    case "experience":
      return <ExperienceStep />;
    
    case "expertise":
      return <SubjectExpertiseStep />;
    
    case "teaching-style":
      return <TeachingStyleStep />;
    
    case "verification":
      return <VerificationStep />;
    
    case "platform":
      return <PlatformStep />;
      
    default:
      return <div>Unknown step</div>;
  }
};

export default ProfileStepRenderer;