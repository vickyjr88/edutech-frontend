
import { useState } from "react";
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
    if (item.currentlyStudying) return "Currently Studying";
    if (!item.institution || !item.startDate) return "Incomplete";
    return "Completed";
  };
  
  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  // Filter out items that have been saved and should be displayed in the table
  const completedEducation = education.filter(edu => edu.saved || 
    ((edu.institution || edu.institutionName) && 
    (edu.institution?.trim() !== "" || edu.institutionName?.trim() !== "")));
  
  // Show form only for items being edited
  const itemsToShow = education.filter(edu => editingId === edu._id);

  return (
    <div className="space-y-6">
      {completedEducation.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institution</TableHead>
                <TableHead>Degree</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedEducation.map((edu) => (
                <TableRow key={edu._id}>
                  <TableCell className="font-medium">{edu.institution || edu.institutionName}</TableCell>
                  <TableCell>{edu.degree || "—"}</TableCell>
                  <TableCell>
                    {edu.startDate ? 
                      edu.currentlyStudying ? 
                        `${edu.startDate} - Present` : 
                        `${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ''}` 
                      : "—"}
                  </TableCell>
                  <TableCell>{getStatus(edu)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(edu._id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(edu._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
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
