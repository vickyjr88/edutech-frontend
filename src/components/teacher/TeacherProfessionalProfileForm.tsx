
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { 
  EducationStep, 
  ExperienceStep,
  SimpleListStep,
  SubjectExpertiseStep,
  CertificationsStep,
  ProgressIndicator,
  EducationItem,
  InstitutionType,
  ExperienceItem,
  StrategiesStep,
  MethodologiesStep,
  StrategyItem,
  MethodologyItem,
  AcademicSubjectItem,
  AfterSchoolSubjectItem,
  TechnicalSkillsStep,
  TechnicalSkillItem,
  LanguagesStep,
  LanguageItem
} from "./professional-profile";
import VideoStep from "./professional-profile/VideoStep";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { fetchExperienceRecords } from "./professional-profile/utils/experienceUtils";
import {teacherService} from "@/integrations/api/services/teacher.service.ts";

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
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [education, setEducation] = useState<EducationItem[]>([{ 
    _id: "1", 
    value: "", 
    institutionName: "",
    degree: "",
    additionalDetails: "",
    startDate: "",
    endDate: "",
    currentlyStudying: false,
    institutionType: "" as const
  }]);
  const [experience, setExperience] = useState<ExperienceItem[]>([{ 
    _id: "1", 
    position: "", 
    institution: "",
    institutionType: "",
    additionalDetails: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    subjects: [],
    curriculums: [],
    grades: []
  }]);
  const [strategies, setStrategies] = useState<StrategyItem[]>([]);
  const [methodologies, setMethodologies] = useState<MethodologyItem[]>([]);
  const [academicSubjects, setAcademicSubjects] = useState<AcademicSubjectItem[]>([]);
  const [afterSchoolSubjects, setAfterSchoolSubjects] = useState<AfterSchoolSubjectItem[]>([]);
  const [technicalSkills, setTechnicalSkills] = useState<TechnicalSkillItem[]>([]);
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [certifications, setCertifications] = useState<FormItem[]>([{ id: "1", value: "", details: "" }]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchEducationRecords();
      fetchTeacherExperience();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchEducationRecords = async () => {
    try {
      setIsLoading(true);

// Get all education records for this teacher
      const { data, error } = await teacherService.getTeacherEducation(user.teacherId);

      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const educationItems: EducationItem[] = data.map(record => ({
          _id: record._id,
          value: record.value,
          institutionName: record.institutionName,
          degree: record.degree || "",
          details: record.additionalDetails || "",
          startDate: record.startDate ? new Date(record.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "",
          endDate: record.endDate ? new Date(record.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "",
          currentlyStudying: record.currentlyStudying,
          institutionType: record.institutionType as InstitutionType
        }));
        
        setEducation(educationItems);
        console.log("Loaded education records:", educationItems);
      }
    } catch (error) {
      console.error("Error fetching education records:", error);
      toast({
        title: "Error",
        description: "Failed to load existing education records",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeacherExperience = async () => {
    try {
      if (!user) return;
      
      const experienceRecords = await fetchExperienceRecords(user.teacherId);
      
      if (experienceRecords.length > 0) {
        setExperience(experienceRecords);
        console.log("Loaded experience records:", experienceRecords);
      }
    } catch (error) {
      console.error("Error fetching experience records:", error);
      toast({
        title: "Error",
        description: "Failed to load existing experience records",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    if (isLoading) {
      return (
        <div className="py-8 flex justify-center">
          <p>Loading...</p>
        </div>
      );
    }
    
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
        return <StrategiesStep 
          strategies={strategies} 
          setStrategies={setStrategies} 
        />;
      case 4: 
        return <MethodologiesStep 
          methodologies={methodologies} 
          setMethodologies={setMethodologies} 
        />;
      case 5: 
        return <SubjectExpertiseStep 
          academicSubjects={academicSubjects} 
          setAcademicSubjects={setAcademicSubjects}
          afterSchoolSubjects={afterSchoolSubjects}
          setAfterSchoolSubjects={setAfterSchoolSubjects}
        />;
      case 6: 
        return <TechnicalSkillsStep 
          skills={technicalSkills} 
          setSkills={setTechnicalSkills} 
        />;
      case 7: 
        return <LanguagesStep 
          languages={languages} 
          setLanguages={setLanguages} 
        />;
      case 8: 
        return <CertificationsStep 
          certifications={certifications} 
          setCertifications={setCertifications} 
        />;
      case 9: 
        return <VideoStep 
          videoUrls={videoUrls} 
          setVideoUrls={setVideoUrls}
          photoUrls={photoUrls}
          setPhotoUrls={setPhotoUrls}
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
