import React from "react";
import { useProfileJourney } from "../ProfileJourneyContext";
import { Separator } from "@/components/ui/separator";
import { BookOpen } from "lucide-react";
import { SubjectExpertiseStep as ProfessionalSubjectStep } from "../../professional-profile";

const SubjectExpertiseStep = () => {
  const { 
    subjects: { academic, afterSchool }, 
    setAcademicSubjects, 
    setAfterSchoolSubjects,
    completeStep 
  } = useProfileJourney();
  
  // Handle subject changes
  const handleAcademicSubjectsChange = (newSubjects: any[]) => {
    setAcademicSubjects(newSubjects);
    checkCompleteness(newSubjects, afterSchool);
  };
  
  const handleAfterSchoolSubjectsChange = (newSubjects: any[]) => {
    setAfterSchoolSubjects(newSubjects);
    checkCompleteness(academic, newSubjects);
  };
  
  // Check if step is complete
  const checkCompleteness = (academicSubjects: any[], afterSchoolSubjects: any[]) => {
    if (academicSubjects.length > 0 || afterSchoolSubjects.length > 0) {
      completeStep("expertise");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <BookOpen className="mr-2 h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-medium">Subject Expertise</h3>
      </div>
      
      <p className="text-sm text-gray-500">
        Select the subjects you're qualified and passionate about teaching.
        This helps match you with students looking for instruction in these areas.
      </p>
      
      {/* Subject expertise step from professional profile form */}
      <div className="mt-4">
        <ProfessionalSubjectStep 
          academicSubjects={academic}
          setAcademicSubjects={handleAcademicSubjectsChange}
          afterSchoolSubjects={afterSchool}
          setAfterSchoolSubjects={handleAfterSchoolSubjectsChange}
        />
      </div>
    </div>
  );
};

export default SubjectExpertiseStep;