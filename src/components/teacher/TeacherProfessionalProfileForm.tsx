
import React, { useState, useEffect, useRef } from "react";
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
  const [stepsCompletion, setStepsCompletion] = useState<boolean[]>(Array(9).fill(false));
  const formRef = React.useRef<HTMLDivElement>(null);
  
  const [education, setEducation] = useState<EducationItem[]>([{ 
    _id: "1", 
    value: "", 
    institutionName: "",
    degree: "",
    additionalDetails: "",
    startDate: "",
    endDate: "",
    isCurrentlyStudying: false,
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
    isCurrentlyWorking: false,
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
      fetchAllStepsData();
    } else {
      setIsLoading(false);
    }
  }, [user]);
  
  // Log changes to currentStep and completion status for debugging
  useEffect(() => {
    console.log("Current step:", currentStep);
    console.log("Steps completion status:", stepsCompletion);
  }, [currentStep, stepsCompletion]);
  
  // Function to check completion status for each step
  const checkStepsCompletion = () => {
    // Initialize with default values for each step
    let completionStatus = Array(totalSteps).fill(false);
    
    // Mark each step as complete based on data presence
    if (education.length > 0 && education[0].institutionName) {
      completionStatus[0] = true; // Education
    }
    
    if (experience.length > 0 && experience[0].position) {
      completionStatus[1] = true; // Experience
    }
    
    if (strategies.length > 0) {
      completionStatus[2] = true; // Strategies
    }
    
    if (methodologies.length > 0) {
      completionStatus[3] = true; // Methodologies
    }
    
    if (academicSubjects.length > 0 || afterSchoolSubjects.length > 0) {
      completionStatus[4] = true; // Subjects
    }
    
    if (technicalSkills.length > 0) {
      completionStatus[5] = true; // Skills
    }
    
    if (languages.length > 0) {
      completionStatus[6] = true; // Languages
    }
    
    if (certifications.length > 0 && certifications[0].value) {
      completionStatus[7] = true; // Certifications
    }
    
    if (videoUrls.length > 0) {
      completionStatus[8] = true; // Video
    }
    
    setStepsCompletion(completionStatus);
    return completionStatus;
  };
  
  // Navigate to the first incomplete step
  const navigateToFirstIncompleteStep = (completionStatus: boolean[]) => {
    const firstIncompleteIndex = completionStatus.findIndex(isComplete => !isComplete);
    
    // If all steps are complete, show the last step
    if (firstIncompleteIndex === -1) {
      setCurrentStep(totalSteps);
      return;
    }
    
    // Set to the first incomplete step (steps are 1-indexed)
    setCurrentStep(firstIncompleteIndex + 1);
    
    // Schedule a scroll after the component updates
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }
    }, 100);
  };
  
  // Fetch all step data
  const fetchAllStepsData = async () => {
    try {
      if (!user?.teacherId) return;
      
      setIsLoading(true);
      
      // Fetch strategies
      const { data: strategiesData } = await teacherService.getTeachingStrategies(user.teacherId);
      if (strategiesData && strategiesData.length > 0) {
        setStrategies(strategiesData);
      }
      
      // Fetch methodologies
      const { data: methodologiesData } = await teacherService.getTeachingMethology(user.teacherId);
      if (methodologiesData && methodologiesData.length > 0) {
        setMethodologies(methodologiesData);
      }
      
      // Fetch academic subjects
      const { data: academicSubjectsData } = await teacherService.getTeacherAcademicSubjects(user.teacherId);
      if (academicSubjectsData && academicSubjectsData.length > 0) {
        setAcademicSubjects(academicSubjectsData);
      }
      
      // Fetch after-school subjects
      const { data: afterSchoolSubjectsData } = await teacherService.getTeacherAfterSchoolSubjects(user.teacherId);
      if (afterSchoolSubjectsData && afterSchoolSubjectsData.length > 0) {
        setAfterSchoolSubjects(afterSchoolSubjectsData);
      }
      
      // Fetch technical skills
      const { data: skillsData } = await teacherService.getTechnicalSkills(user.teacherId);
      if (skillsData && skillsData.length > 0) {
        setTechnicalSkills(skillsData);
      }
      
      // Fetch languages
      const { data: languagesData } = await teacherService.getLanguageExpertise(user.teacherId);
      if (languagesData && languagesData.length > 0) {
        setLanguages(languagesData);
      }
      
      // Fetch certifications
      const { data: certificationsData } = await teacherService.getCertifications(user.teacherId);
      if (certificationsData && certificationsData.length > 0) {
        setCertifications(certificationsData.map(cert => ({ 
          id: cert._id, 
          value: cert.name, 
          details: cert.description || ''
        })));
      }
      
      // After all data is loaded, check completion status and navigate
      setTimeout(() => {
        const completionStatus = checkStepsCompletion();
        console.log("Steps completion status:", completionStatus);
        
        // Find the first incomplete step
        const firstIncompleteIndex = completionStatus.findIndex(isComplete => !isComplete);
        console.log("First incomplete step index:", firstIncompleteIndex);
        
        if (firstIncompleteIndex !== -1) {
          // +1 because steps are 1-indexed
          setCurrentStep(firstIncompleteIndex + 1);
          console.log("Navigating to step:", firstIncompleteIndex + 1);
        } else {
          // If all steps are complete, go to the last step
          setCurrentStep(totalSteps);
          console.log("All steps complete, navigating to last step");
        }
        
        setIsLoading(false);
        
        // Scroll to form after a brief delay to ensure rendering is complete
        setTimeout(() => {
          if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }, 1000);
      
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast({
        title: "Error",
        description: "Failed to load your profile data",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

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
          _id: record._id || record['id'],
          institution: record.institution || record.institutionName,
          institutionName: record.institutionName || record.institution,
          degree: record.degree || "",
          additionalDetails: record.additionalDetails || "",
          startDate: record.startDate ? new Date(record.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "",
          endDate: record.endDate ? new Date(record.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "",
          isCurrentlyStudying: record.isCurrentlyStudying || record.isCurrentlyStudying,
          institutionType: record.institutionType as InstitutionType,
          saved: true
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
    // Update completion status for the current step based on actual data presence
    const newCompletionStatus = [...stepsCompletion];
    
    // Mark current step as complete if it has data
    newCompletionStatus[currentStep - 1] = true;
    
    setStepsCompletion(newCompletionStatus);
    
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      
      // Scroll to the form after step change
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      
      // Scroll to the form after step change
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };
  
  // Function to jump to a specific step (for navigation from timeline)
  const jumpToStep = (stepIndex: number) => {
    // Only allow jumping to completed steps or the current incomplete step
    if (stepIndex >= 1 && stepIndex <= totalSteps) {
      // Always allow clicking on any step in the timeline
      console.log(`Jumping to step ${stepIndex}`);
      
      setCurrentStep(stepIndex);
      
      // Scroll to the form after step change
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
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
    <Card ref={formRef} className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{getStepTitle()}</CardTitle>
        <CardDescription>{getStepDescription()}</CardDescription>
      </CardHeader>
      <CardContent>
        <ProgressIndicator 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
          stepLabels={stepLabels}
          completionStatus={stepsCompletion}
          onStepClick={jumpToStep}
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
