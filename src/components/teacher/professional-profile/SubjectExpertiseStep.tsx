
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AcademicSubjectsStep from "./AcademicSubjectsStep";
import AfterSchoolSubjectsStep from "./AfterSchoolSubjectsStep";
import { AcademicSubjectItem } from "./utils/academicSubjectUtils";
import { AfterSchoolSubjectItem } from "./utils/afterSchoolSubjectUtils";

type SubjectExpertiseStepProps = {
  academicSubjects: AcademicSubjectItem[];
  setAcademicSubjects: React.Dispatch<React.SetStateAction<AcademicSubjectItem[]>>;
  afterSchoolSubjects: AfterSchoolSubjectItem[];
  setAfterSchoolSubjects: React.Dispatch<React.SetStateAction<AfterSchoolSubjectItem[]>>;
};

const SubjectExpertiseStep = ({ 
  academicSubjects, 
  setAcademicSubjects, 
  afterSchoolSubjects, 
  setAfterSchoolSubjects 
}: SubjectExpertiseStepProps) => {
  const [activeTab, setActiveTab] = useState("academic");

  return (
    <Tabs defaultValue="academic" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="academic">Academic Subjects</TabsTrigger>
        <TabsTrigger value="afterschool">After-School Subjects</TabsTrigger>
      </TabsList>
      <TabsContent value="academic" className="mt-4">
        <AcademicSubjectsStep 
          subjects={academicSubjects}
          setSubjects={setAcademicSubjects}
        />
      </TabsContent>
      <TabsContent value="afterschool" className="mt-4">
        <AfterSchoolSubjectsStep 
          subjects={afterSchoolSubjects}
          setSubjects={setAfterSchoolSubjects}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SubjectExpertiseStep;
