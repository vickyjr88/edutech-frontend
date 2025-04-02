
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

type ExperienceStepProps = {
  experience: FormItem[];
  setExperience: React.Dispatch<React.SetStateAction<FormItem[]>>;
};

const ExperienceStep = ({ experience, setExperience }: ExperienceStepProps) => {
  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      value: "",
      details: ""
    };
    setExperience([...experience, newItem]);
  };

  const removeItem = (id: string) => {
    if (experience.length === 1) return;
    setExperience(experience.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: 'value' | 'details', value: string) => {
    setExperience(experience.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="space-y-4">
      {experience.map((exp, index) => (
        <div key={exp.id} className="p-4 border rounded-md bg-white">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-sm">Experience {index + 1}</h4>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => removeItem(exp.id)}
              disabled={experience.length === 1}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor={`exp-position-${exp.id}`}>Position/Institution</Label>
              <Input 
                id={`exp-position-${exp.id}`}
                value={exp.value}
                onChange={(e) => updateItem(exp.id, 'value', e.target.value)}
                placeholder="e.g., Mathematics Teacher at ABC School"
              />
            </div>
            
            <div>
              <Label htmlFor={`exp-details-${exp.id}`}>Years & Details</Label>
              <Textarea
                id={`exp-details-${exp.id}`}
                value={exp.details || ""}
                onChange={(e) => updateItem(exp.id, 'details', e.target.value)}
                placeholder="e.g., 2019-2022, Taught Grade 9-12 Mathematics, improved class average by 15%"
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
        Add Another Experience
      </Button>
    </div>
  );
};

export default ExperienceStep;
