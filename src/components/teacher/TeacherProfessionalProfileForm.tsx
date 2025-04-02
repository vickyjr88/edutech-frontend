import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { 
  EducationStep, 
  ExperienceStep,
  SimpleListStep,
  SubjectExpertiseStep,
  CertificationsStep,
  VideoStep,
  ProgressIndicator
} from "./professional-profile";
import { EducationItem, InstitutionType } from "./professional-profile/EducationStep";

type FormItem = {
  id: string;
  value: string;
  details?: string;
};

const TeacherProfessionalProfileForm = ({ 
  onComplete,
  onCancel 
}: { 
  onComplete: () => void;
  onCancel: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [education, setEducation] = useState<EducationItem[]>([{ 
    id: "1", 
    value: "", 
    institution: "",
    degree: "",
    details: "",
    startDate: "",
    endDate: "",
    currentlyStudying: false,
    institutionType: "" as const
  }]);
  const [experience, setExperience] = useState<FormItem[]>([{ id: "1", value: "", details: "" }]);
  const [strategies, setStrategies] = useState<FormItem[]>([{ id: "1", value: "" }]);
  const [methodologies, setMethodologies] = useState<FormItem[]>([{ id: "1", value: "" }]);
  const [academicSubjects, setAcademicSubjects] = useState<FormItem[]>([{ id: "1", value: "" }]);
  const [afterSchoolSubjects, setAfterSchoolSubjects] = useState<FormItem[]>([{ id: "1", value: "" }]);
  const [technicalSkills, setTechnicalSkills] = useState<FormItem[]>([{ id: "1", value: "" }]);
  const [languages, setLanguages] = useState<FormItem[]>([{ id: "1", value: "" }]);
  const [certifications, setCertifications] = useState<FormItem[]>([{ id: "1", value: "", details: "" }]);
  const [videoUrl, setVideoUrl] = useState("");

  const totalSteps = 9;

  const stepLabels = [
    "Education",
    "Experience",
    "Strategies",
    "Methodologies",
    "Subjects",
    "Skills",
    "Languages",
    "Certifications",
    "Video"
  ];

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Education Background";
      case 2: return "Teaching Experience";
      case 3: return "Teaching Strategies";
      case 4: return "Teaching Methodologies";
      case 5: return "Subject Expertise";
      case 6: return "Technical Skills";
      case 7: return "Teaching Languages";
      case 8: return "Certifications & Credentials";
      case 9: return "Introductory Video";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Add your educational qualifications and background";
      case 2: return "Share your previous teaching experiences";
      case 3: return "What teaching strategies do you employ?";
      case 4: return "What teaching methodologies do you follow?";
      case 5: return "What subjects are you an expert in?";
      case 6: return "What technical skills do you possess?";
      case 7: return "What languages can you teach in?";
      case 8: return "Add your teaching certifications and credentials";
      case 9: return "Upload a short video introducing yourself to potential students";
      default: return "";
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onComplete();
    }, 1000);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: 
        return <EducationStep 
          education={education} 
          setEducation={setEducation} 
        />;
      case 2: 
        return <ExperienceStep 
          experience={experience} 
          setExperience={setExperience} 
        />;
      case 3: 
        return <SimpleListStep 
          items={strategies} 
          setItems={setStrategies} 
          label="Strategy" 
          placeholder="e.g., Collaborative Learning" 
        />;
      case 4: 
        return <SimpleListStep 
          items={methodologies} 
          setItems={setMethodologies} 
          label="Methodology" 
          placeholder="e.g., Project-based Learning" 
        />;
      case 5: 
        return <SubjectExpertiseStep 
          academicSubjects={academicSubjects} 
          setAcademicSubjects={setAcademicSubjects}
          afterSchoolSubjects={afterSchoolSubjects}
          setAfterSchoolSubjects={setAfterSchoolSubjects}
        />;
      case 6: 
        return <SimpleListStep 
          items={technicalSkills} 
          setItems={setTechnicalSkills} 
          label="Technical Skill" 
          placeholder="e.g., Microsoft Office, Programming" 
        />;
      case 7: 
        return <SimpleListStep 
          items={languages} 
          setItems={setLanguages} 
          label="Language" 
          placeholder="e.g., English, Swahili" 
        />;
      case 8: 
        return <CertificationsStep 
          certifications={certifications} 
          setCertifications={setCertifications} 
        />;
      case 9: 
        return <VideoStep 
          videoUrl={videoUrl} 
          setVideoUrl={setVideoUrl} 
        />;
      default: return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{getStepTitle()}</CardTitle>
        <CardDescription>{getStepDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ProgressIndicator 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          stepLabels={stepLabels} 
        />
        {renderCurrentStep()}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={currentStep === 1 ? onCancel : handleBack}
        >
          {currentStep === 1 ? 'Cancel' : (
            <>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </>
          )}
        </Button>
        <Button 
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {currentStep === totalSteps ? (
            isSubmitting ? 'Submitting...' : 'Complete Profile'
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeacherProfessionalProfileForm;
