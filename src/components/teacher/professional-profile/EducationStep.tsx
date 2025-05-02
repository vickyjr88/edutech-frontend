
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { EducationItem } from "./types";
import EducationItemComponent from "./education/EducationItemComponent";
import { 
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";

type EducationStepProps = {
  education: EducationItem[];
  setEducation: React.Dispatch<React.SetStateAction<EducationItem[]>>;
};

const EducationStep = ({ education, setEducation }: EducationStepProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const addItem = () => {
    const newItem = {
      _id: Date.now().toString(),
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
    setEditingId(newItem._id);
  };

  const removeItem = (id: string) => {
    if (education.length === 1 && editingId === id) return;
    setEducation(education.filter(item => item._id !== id));
    if (editingId === id) setEditingId(null);
  };

  const updateItem = (id: string, field: keyof EducationItem, value: any) => {
    setEducation(education.map(item => 
      item._id === id ? { ...item, [field]: value } : item
    ));
  };
  
  const getStatus = (item: EducationItem): string => {
    if (item.isCurrentlyStudying) return "Currently Studying";
    if (!item.institution || !item.startDate) return "Incomplete";
    return "Completed";
  };
  
  const handleEdit = (id: string) => {
    setEditingId(id);
  };
  
  // Add event listeners for external edit and delete requests
  useEffect(() => {
    const handleExternalEdit = (event: any) => {
      const { id, institutionName, institution } = event.detail;
      
      // First try by ID
      if (id) {
        const itemToEdit = education.find(item => item._id === id);
        if (itemToEdit) {
          setEditingId(id);
          return;
        }
      }
      
      // Fallback to institution name
      if (institutionName || institution) {
        const itemToEdit = education.find(
          item => (item.institutionName === institutionName || item.institution === institution)
        );
        if (itemToEdit) {
          setEditingId(itemToEdit._id);
        }
      }
    };
    
    const handleExternalDelete = (event: any) => {
      const { id, institutionName, institution } = event.detail;
      
      // First try by ID
      if (id) {
        removeItem(id);
        return;
      }
      
      // Fallback to institution name
      if (institutionName || institution) {
        const itemToDelete = education.find(
          item => (item.institutionName === institutionName || item.institution === institution)
        );
        if (itemToDelete) {
          removeItem(itemToDelete._id);
        }
      }
    };
    
    document.addEventListener('edit-education', handleExternalEdit);
    document.addEventListener('delete-education', handleExternalDelete);
    
    return () => {
      document.removeEventListener('edit-education', handleExternalEdit);
      document.removeEventListener('delete-education', handleExternalDelete);
    };
  }, [education]);

  // Filter out items that have been saved and should be displayed in the table
  const completedEducation = education.filter(edu => edu.saved || 
    ((edu.institution || edu.institutionName) && 
    (edu.institution?.trim() !== "" || edu.institutionName?.trim() !== "")));
  
  // Show form only for items being edited
  const itemsToShow = education.filter(edu => editingId === edu._id);

  return (
    <div className="space-y-6 professional-education-form">
      {/* Table of education entries has been removed to avoid duplication - 
          the parent component will handle displaying the education items */}
      
      <div className="space-y-4">
        {itemsToShow.map((edu, index) => (
          <EducationItemComponent
            key={edu._id}
            item={edu}
            index={index}
            onRemove={removeItem}
            onUpdate={updateItem}
            isRemoveDisabled={education.length === 1 && completedEducation.length === 0}
          />
        ))}
        
        {editingId === null && (
          <Button
            variant="outline"
            className="w-full"
            onClick={addItem}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Education
          </Button>
        )}
      </div>
    </div>
  );
};

export default EducationStep;
