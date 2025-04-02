
import { SimpleListStep } from "./index";

type FormItem = {
  id: string;
  value: string;
  details?: string;
};

type SubjectExpertiseStepProps = {
  academicSubjects: FormItem[];
  setAcademicSubjects: React.Dispatch<React.SetStateAction<FormItem[]>>;
  afterSchoolSubjects: FormItem[];
  setAfterSchoolSubjects: React.Dispatch<React.SetStateAction<FormItem[]>>;
};

const SubjectExpertiseStep = ({ 
  academicSubjects, 
  setAcademicSubjects, 
  afterSchoolSubjects, 
  setAfterSchoolSubjects 
}: SubjectExpertiseStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-sm mb-3">Academic Subjects</h4>
        <SimpleListStep
          items={academicSubjects} 
          setItems={setAcademicSubjects} 
          label="Academic Subject" 
          placeholder="e.g., Mathematics, Science, English"
        />
      </div>
      
      <div>
        <h4 className="font-medium text-sm mb-3">After-School Subjects</h4>
        <SimpleListStep
          items={afterSchoolSubjects} 
          setItems={setAfterSchoolSubjects} 
          label="After-School Subject" 
          placeholder="e.g., Art, Music, Coding"
        />
      </div>
    </div>
  );
};

export default SubjectExpertiseStep;
