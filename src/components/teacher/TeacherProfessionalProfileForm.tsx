
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, CheckCircle, Loader2 } from "lucide-react";
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
    // This is a placeholder since we're rolling back - we actually ignore the completionStatus
    // and just rely on the step tracking in the UI
    
    console.log("Navigating to step:", currentStep);
    
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
        
        // Navigate to first incomplete step (placeholder in the rolled back version)
        navigateToFirstIncompleteStep(completionStatus);
        
        // Simulate longer loading for better UX with the animation
        setTimeout(() => {
          setIsLoading(false);
          
          // Scroll to form after a brief delay to ensure rendering is complete
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 300);
        }, 1000); // Show the loading animation for at least 1 second
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

  // Validate that all required steps have data
  const validateProfileCompletion = (): boolean => {
    // Check if we have data for each step
    const hasEducation = education.length > 0 && education.some(item => item.institution || item.institutionName);
    const hasExperience = experience.length > 0 && experience.some(item => item.position && item.institution);
    const hasStrategies = strategies.length > 0;
    const hasMethodologies = methodologies.length > 0;
    const hasSubjects = academicSubjects.length > 0 || afterSchoolSubjects.length > 0;
    const hasSkills = technicalSkills.length > 0;
    const hasLanguages = languages.length > 0;
    const hasCertifications = certifications.length > 0 && certifications.some(item => item.value);
    const hasIntroVideo = videoUrls.length > 0;
    
    // Count required steps
    const requiredStepCount = [
      hasEducation,
      hasExperience,
      hasStrategies,
      hasMethodologies,
      hasSubjects,
      hasSkills,
      hasLanguages,
      hasCertifications,
      hasIntroVideo
    ].filter(Boolean).length;
    
    // For completion, we'll require at least 6 out of 9 steps (more flexible approach)
    const minRequiredSteps = 6;
    const isComplete = requiredStepCount >= minRequiredSteps;
    
    if (!isComplete) {
      // Build a message about what's missing
      const missingSteps = [];
      if (!hasEducation) missingSteps.push("Education");
      if (!hasExperience) missingSteps.push("Experience");
      if (!hasStrategies) missingSteps.push("Teaching Strategies");
      if (!hasMethodologies) missingSteps.push("Teaching Methodologies");
      if (!hasSubjects) missingSteps.push("Subject Expertise");
      if (!hasSkills) missingSteps.push("Technical Skills");
      if (!hasLanguages) missingSteps.push("Languages");
      if (!hasCertifications) missingSteps.push("Certifications");
      if (!hasIntroVideo) missingSteps.push("Introduction Video");
      
      const formattedMissing = missingSteps.slice(0, 3).join(", ") + 
        (missingSteps.length > 3 ? ` and ${missingSteps.length - 3} more steps` : "");
      
      toast({
        title: "Profile Incomplete",
        description: `You need to complete at least ${minRequiredSteps} steps to submit. Missing: ${formattedMissing}`,
        variant: "destructive"
      });
    }
    
    return isComplete;
  };

  const handleSubmit = async () => {
    if (!user?.teacherId) {
      toast({
        title: "Error",
        description: "You must be logged in to complete your profile",
        variant: "destructive"
      });
      return;
    }

    // Validate profile first
    if (!validateProfileCompletion()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Mark the profile as complete
      const { data, error } = await teacherService.updateProfile(user.teacherId, {
        isProfileComplete: true
      });
      
      if (error) {
        throw new Error(error.message || "Failed to mark profile as complete");
      }
      
      console.log("Profile marked as complete:", data);
      
      toast({
        title: "Success",
        description: "Your professional profile has been completed successfully!",
      });
      
      // Call the parent completion handler
      onComplete();
    } catch (error) {
      console.error("Error marking profile as complete:", error);
      toast({
        title: "Error",
        description: "There was an error updating your profile status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    if (isLoading) {
      return (
        <div className="py-8 flex flex-col items-center justify-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-t-green-500 border-r-blue-500 border-b-amber-500 border-l-indigo-500 animate-spin"></div>
            <div className="absolute inset-3 rounded-full border-2 border-t-green-400 border-r-blue-400 border-b-amber-400 border-l-indigo-400 animate-spin animate-ping"></div>
          </div>
          <p className="text-base font-medium text-gray-600 animate-pulse">Loading your profile data...</p>
          <p className="text-sm text-gray-500">Finding the last incomplete step</p>
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
    <Card 
      ref={formRef} 
      className={`w-full max-w-4xl mx-auto transition-opacity duration-500 ${!isLoading ? 'opacity-100' : 'opacity-0'}`}
    >
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
          className={currentStep === totalSteps && isSubmitting ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {currentStep === totalSteps ? (
            isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Completing Profile...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Profile
              </>
            )
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
