
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AcademicSubjectsStep from "./AcademicSubjectsStep";
import AfterSchoolSubjectsStep from "./AfterSchoolSubjectsStep";
import { AcademicSubjectItem } from "./utils/academicSubjectUtils";
import { AfterSchoolSubjectItem } from "./utils/afterSchoolSubjectUtils";
import ResourceUploader from "../ResourceUploader";
import { FileText, BookOpen, Palette } from "lucide-react";

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
  const [resources, setResources] = useState({
    files: [],
    links: []
  });

  const handleResourcesChange = (newResources) => {
    setResources(newResources);
  };

  return (
    <Tabs defaultValue="academic" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="academic" className="flex items-center">
          <BookOpen className="mr-2 h-4 w-4" />
          Academic Subjects
        </TabsTrigger>
        <TabsTrigger value="afterschool" className="flex items-center">
          <Palette className="mr-2 h-4 w-4" />
          After-School Subjects
        </TabsTrigger>
        {/*<TabsTrigger value="resources" className="flex items-center">*/}
        {/*  <FileText className="mr-2 h-4 w-4" />*/}
        {/*  Resources*/}
        {/*</TabsTrigger>*/}
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
      <TabsContent value="resources" className="mt-4">
        <ResourceUploader
          onResourcesChange={handleResourcesChange}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SubjectExpertiseStep;
