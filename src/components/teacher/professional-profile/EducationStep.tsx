
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2 } from "lucide-react";

type FormItem = {
  id: string;
  value: string;
  details?: string;
};

type EducationStepProps = {
  education: FormItem[];
  setEducation: React.Dispatch<React.SetStateAction<FormItem[]>>;
};

const EducationStep = ({ education, setEducation }: EducationStepProps) => {
  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      value: "",
      details: ""
    };
    setEducation([...education, newItem]);
  };

  const removeItem = (id: string) => {
    if (education.length === 1) return;
    setEducation(education.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: 'value' | 'details', value: string) => {
    setEducation(education.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="space-y-4">
      {education.map((edu, index) => (
        <div key={edu.id} className="p-4 border rounded-md bg-white">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-sm">Education {index + 1}</h4>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => removeItem(edu.id)}
              disabled={education.length === 1}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor={`edu-institution-${edu.id}`}>Institution/Degree</Label>
              <Input 
                id={`edu-institution-${edu.id}`}
                value={edu.value}
                onChange={(e) => updateItem(edu.id, 'value', e.target.value)}
                placeholder="e.g., University of Nairobi, Bachelor of Education"
              />
            </div>
            
            <div>
              <Label htmlFor={`edu-details-${edu.id}`}>Years & Details</Label>
              <Textarea
                id={`edu-details-${edu.id}`}
                value={edu.details || ""}
                onChange={(e) => updateItem(edu.id, 'details', e.target.value)}
                placeholder="e.g., 2015-2019, Graduated with honors, specialized in Mathematics"
              />
            </div>
          </div>
        </div>
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
