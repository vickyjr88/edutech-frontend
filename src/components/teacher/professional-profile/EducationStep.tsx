
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { EducationItem } from "./types";
import EducationItemComponent from "./education/EducationItemComponent";

type EducationStepProps = {
  education: EducationItem[];
  setEducation: React.Dispatch<React.SetStateAction<EducationItem[]>>;
};

const EducationStep = ({ education, setEducation }: EducationStepProps) => {
  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      value: "",
      institution: "",
      degree: "",
      details: "",
      startDate: "",
      endDate: "",
      currentlyStudying: false,
      institutionType: "" as const
    };
    setEducation([...education, newItem]);
  };

  const removeItem = (id: string) => {
    if (education.length === 1) return;
    setEducation(education.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof EducationItem, value: any) => {
    setEducation(education.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="space-y-4">
      {education.map((edu, index) => (
        <EducationItemComponent
          key={edu.id}
          item={edu}
          index={index}
          onRemove={removeItem}
          onUpdate={updateItem}
          isRemoveDisabled={education.length === 1}
        />
      ))}
      
      <Button
        variant="outline"
        className="w-full"
        onClick={addItem}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Another Education
      </Button>
    </div>
  );
};

export default EducationStep;
