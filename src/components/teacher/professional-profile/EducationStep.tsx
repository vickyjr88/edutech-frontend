
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Trash2 } from "lucide-react";

type InstitutionType = "primary" | "secondary" | "college" | "university" | "vocational" | "other";

type FormItem = {
  id: string;
  value: string;
  details?: string;
  startDate: string;
  endDate: string;
  currentlyStudying: boolean;
  institutionType: InstitutionType | "";
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
      details: "",
      startDate: "",
      endDate: "",
      currentlyStudying: false,
      institutionType: ""
    };
    setEducation([...education, newItem]);
  };

  const removeItem = (id: string) => {
    if (education.length === 1) return;
    setEducation(education.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof FormItem, value: any) => {
    setEducation(education.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const toggleCurrentlyStudying = (id: string, checked: boolean) => {
    setEducation(education.map(item => 
      item.id === id 
        ? { ...item, currentlyStudying: checked, endDate: checked ? "" : item.endDate } 
        : item
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
              <Label htmlFor={`edu-type-${edu.id}`}>Institution Type</Label>
              <Select 
                value={edu.institutionType} 
                onValueChange={(value) => updateItem(edu.id, 'institutionType', value)}
              >
                <SelectTrigger id={`edu-type-${edu.id}`}>
                  <SelectValue placeholder="Select institution type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary School</SelectItem>
                  <SelectItem value="secondary">Secondary School</SelectItem>
                  <SelectItem value="college">College</SelectItem>
                  <SelectItem value="university">University</SelectItem>
                  <SelectItem value="vocational">Vocational Training</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`edu-start-${edu.id}`}>Start Date</Label>
                <Input 
                  id={`edu-start-${edu.id}`}
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => updateItem(edu.id, 'startDate', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor={`edu-end-${edu.id}`}>End Date</Label>
                <Input 
                  id={`edu-end-${edu.id}`}
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => updateItem(edu.id, 'endDate', e.target.value)}
                  disabled={edu.currentlyStudying}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`edu-current-${edu.id}`} 
                checked={edu.currentlyStudying}
                onCheckedChange={(checked) => toggleCurrentlyStudying(edu.id, checked === true)}
              />
              <Label 
                htmlFor={`edu-current-${edu.id}`}
                className="text-sm font-normal"
              >
                I am currently studying here
              </Label>
            </div>
            
            <div>
              <Label htmlFor={`edu-details-${edu.id}`}>Additional Details</Label>
              <Textarea
                id={`edu-details-${edu.id}`}
                value={edu.details || ""}
                onChange={(e) => updateItem(edu.id, 'details', e.target.value)}
                placeholder="e.g., Graduated with honors, specialized in Mathematics"
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
