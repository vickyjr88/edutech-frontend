
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Trash2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type InstitutionType = "primary" | "secondary" | "college" | "university" | "vocational" | "other";

export type EducationItem = {
  id: string;
  value: string;
  institution?: string;
  degree?: string;
  details?: string;
  startDate: string;
  endDate: string;
  currentlyStudying: boolean;
  institutionType: InstitutionType | "";
  isSaving?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
};

type EducationStepProps = {
  education: EducationItem[];
  setEducation: React.Dispatch<React.SetStateAction<EducationItem[]>>;
};

const EducationStep = ({ education, setEducation }: EducationStepProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
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

  const toggleCurrentlyStudying = (id: string, checked: boolean) => {
    setEducation(education.map(item => 
      item.id === id 
        ? { ...item, currentlyStudying: checked, endDate: checked ? "" : item.endDate } 
        : item
    ));
  };

  // Function to format date from YYYY-MM to YYYY-MM-DD
  const formatDateForDatabase = (dateString: string): string => {
    if (!dateString) return "";
    // Append day "01" to make it a valid date for PostgreSQL
    return `${dateString}-01`;
  };

  const handleSave = async (id: string) => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You need to be logged in to save education records",
          variant: "destructive"
        });
        return;
      }

      const eduItem = education.find(item => item.id === id);
      
      if (!eduItem) {
        throw new Error("Education item not found");
      }
      
      if (!eduItem.institutionType) {
        toast({
          title: "Validation Error",
          description: "Institution type is required",
          variant: "destructive"
        });
        return;
      }
      
      if (!eduItem.institution) {
        toast({
          title: "Validation Error",
          description: "Institution name is required",
          variant: "destructive"
        });
        return;
      }
      
      if (!eduItem.startDate) {
        toast({
          title: "Validation Error",
          description: "Start date is required",
          variant: "destructive"
        });
        return;
      }

      // Set saving state
      updateItem(id, 'isSaving', true);
      
      // Format data for database
      const educationData = {
        user_id: user.id,
        institution_type: eduItem.institutionType,
        institution_name: eduItem.institution,
        degree: eduItem.degree || null,
        details: eduItem.details || null,
        start_date: formatDateForDatabase(eduItem.startDate),
        end_date: eduItem.currentlyStudying ? null : (eduItem.endDate ? formatDateForDatabase(eduItem.endDate) : null),
        currently_studying: eduItem.currentlyStudying
      };
      
      console.log("Saving education data:", educationData);
      
      // Insert or update record in database
      const { data, error } = await supabase
        .from('teacher_education')
        .upsert(educationData)
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Education record saved successfully",
      });
      
      // Update state with success indicator
      updateItem(id, 'isSuccess', true);
      updateItem(id, 'isError', false);
      
      console.log("Education saved successfully:", data);
      
    } catch (error) {
      console.error("Error saving education:", error);
      
      // Update state with error indicator
      updateItem(id, 'isError', true);
      updateItem(id, 'isSuccess', false);
      
      toast({
        title: "Error",
        description: "Failed to save education record. Please try again.",
        variant: "destructive"
      });
    } finally {
      // Reset saving state
      updateItem(id, 'isSaving', false);
      
      // Reset success indicator after a delay
      if (!education.find(item => item.id === id)?.isError) {
        setTimeout(() => {
          updateItem(id, 'isSuccess', false);
        }, 3000);
      }
    }
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
              <Label htmlFor={`edu-type-${edu.id}`}>Institution Type</Label>
              <Select 
                value={edu.institutionType} 
                onValueChange={(value: InstitutionType | "") => updateItem(edu.id, 'institutionType', value)}
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
            
            <div>
              <Label htmlFor={`edu-institution-${edu.id}`}>Institution Name</Label>
              <Input 
                id={`edu-institution-${edu.id}`}
                value={edu.institution || ""}
                onChange={(e) => updateItem(edu.id, 'institution', e.target.value)}
                placeholder="e.g., University of Nairobi"
              />
            </div>
            
            <div>
              <Label htmlFor={`edu-degree-${edu.id}`}>Degree/Certification</Label>
              <Input 
                id={`edu-degree-${edu.id}`}
                value={edu.degree || ""}
                onChange={(e) => updateItem(edu.id, 'degree', e.target.value)}
                placeholder="e.g., Bachelor of Education"
              />
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
            
            <Button 
              onClick={() => handleSave(edu.id)}
              className={`w-full mt-2 ${edu.isSuccess ? 'bg-green-500 hover:bg-green-600' : edu.isError ? 'bg-red-500 hover:bg-red-600' : ''}`}
              disabled={edu.isSaving}
            >
              {edu.isSaving ? (
                <>Saving...</>
              ) : edu.isSuccess ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Education
                </>
              )}
            </Button>
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
