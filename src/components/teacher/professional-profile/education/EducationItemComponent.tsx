
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Save } from "lucide-react";
import { InstitutionType, EducationItem } from "../types";
import { saveEducationRecord, validateEducationData } from "../utils/educationUtils";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface EducationItemProps {
  item: EducationItem;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof EducationItem, value: any) => void;
  isRemoveDisabled: boolean;
}

const EducationItemComponent = ({ 
  item, 
  index, 
  onRemove, 
  onUpdate, 
  isRemoveDisabled 
}: EducationItemProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const toggleCurrentlyStudying = (checked: boolean) => {
    onUpdate(item.id, 'currentlyStudying', checked);
    if (checked) {
      onUpdate(item.id, 'endDate', '');
    }
  };

  const handleSave = async () => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You need to be logged in to save education records",
          variant: "destructive"
        });
        return;
      }

      // Validate required fields
      const validationErrors = validateEducationData(
        item.institutionType, 
        item.institution || '', 
        item.startDate
      );
      
      if (validationErrors.length > 0) {
        toast({
          title: "Validation Error",
          description: validationErrors[0],
          variant: "destructive"
        });
        return;
      }

      // Set saving state
      onUpdate(item.id, 'isSaving', true);
      setIsSaving(true);
      
      await saveEducationRecord(user.id, {
        id: item.id,
        institutionType: item.institutionType as InstitutionType,
        institution: item.institution || '',
        degree: item.degree,
        details: item.details,
        startDate: item.startDate,
        endDate: item.endDate,
        currentlyStudying: item.currentlyStudying
      });
      
      toast({
        title: "Success",
        description: "Education record saved successfully",
      });
      
      // Update state with success indicator
      onUpdate(item.id, 'isSuccess', true);
      onUpdate(item.id, 'isError', false);
      
      // Reset the form after successful save by clearing fields
      // This will effectively reset the form to button state in the parent component
      setTimeout(() => {
        onUpdate(item.id, 'isSuccess', false);
        onUpdate(item.id, 'isSaving', false);
        setIsSaving(false);
        onRemove(item.id);
      }, 1500);
    } catch (error) {
      console.error("Error saving education:", error);
      
      // Update state with error indicator
      onUpdate(item.id, 'isError', true);
      onUpdate(item.id, 'isSuccess', false);
      
      toast({
        title: "Error",
        description: "Failed to save education record. Please try again.",
        variant: "destructive"
      });
      
      // Reset saving state
      onUpdate(item.id, 'isSaving', false);
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-white">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-medium text-sm">Add Education</h4>
        {!isRemoveDisabled && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor={`edu-type-${item.id}`}>Institution Type</Label>
          <Select 
            value={item.institutionType} 
            onValueChange={(value: InstitutionType | "") => onUpdate(item.id, 'institutionType', value)}
          >
            <SelectTrigger id={`edu-type-${item.id}`}>
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
          <Label htmlFor={`edu-institution-${item.id}`}>Institution Name</Label>
          <Input 
            id={`edu-institution-${item.id}`}
            value={item.institution || ""}
            onChange={(e) => onUpdate(item.id, 'institution', e.target.value)}
            placeholder="e.g., University of Nairobi"
          />
        </div>
        
        <div>
          <Label htmlFor={`edu-degree-${item.id}`}>Degree/Certification</Label>
          <Input 
            id={`edu-degree-${item.id}`}
            value={item.degree || ""}
            onChange={(e) => onUpdate(item.id, 'degree', e.target.value)}
            placeholder="e.g., Bachelor of Education"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`edu-start-${item.id}`}>Start Date</Label>
            <Input 
              id={`edu-start-${item.id}`}
              type="month"
              value={item.startDate}
              onChange={(e) => onUpdate(item.id, 'startDate', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor={`edu-end-${item.id}`}>End Date</Label>
            <Input 
              id={`edu-end-${item.id}`}
              type="month"
              value={item.endDate}
              onChange={(e) => onUpdate(item.id, 'endDate', e.target.value)}
              disabled={item.currentlyStudying}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id={`edu-current-${item.id}`} 
            checked={item.currentlyStudying}
            onCheckedChange={(checked) => toggleCurrentlyStudying(checked === true)}
          />
          <Label 
            htmlFor={`edu-current-${item.id}`}
            className="text-sm font-normal cursor-pointer"
          >
            I am currently studying here
          </Label>
        </div>
        
        <div>
          <Label htmlFor={`edu-details-${item.id}`}>Additional Details</Label>
          <Textarea
            id={`edu-details-${item.id}`}
            value={item.details || ""}
            onChange={(e) => onUpdate(item.id, 'details', e.target.value)}
            placeholder="e.g., Graduated with honors, specialized in Mathematics"
          />
        </div>
        
        <Button 
          onClick={handleSave}
          className={`w-full mt-2 ${item.isSuccess ? 'bg-green-500 hover:bg-green-600' : item.isError ? 'bg-red-500 hover:bg-red-600' : ''}`}
          disabled={isSaving}
        >
          {isSaving ? (
            <>Saving...</>
          ) : item.isSuccess ? (
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
  );
};

export default EducationItemComponent;
