
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Trash2, Save, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type FormItem = {
  id: string;
  value: string;
  details?: string;
  saved?: boolean;
};

type ExperienceStepProps = {
  experience: FormItem[];
  setExperience: React.Dispatch<React.SetStateAction<FormItem[]>>;
};

const ExperienceStep = ({ experience, setExperience }: ExperienceStepProps) => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<FormItem>({
    id: Date.now().toString(),
    value: "",
    details: ""
  });

  const addItem = () => {
    setEditingId(null);
    setCurrentItem({
      id: Date.now().toString(),
      value: "",
      details: ""
    });
  };

  const removeItem = (id: string) => {
    setExperience(experience.filter(item => item.id !== id));
    toast({
      title: "Experience removed",
      description: "Experience entry has been removed successfully",
    });
    
    // If we're removing the item we're currently editing, reset the form
    if (editingId === id) {
      setEditingId(null);
      setCurrentItem({
        id: Date.now().toString(),
        value: "",
        details: ""
      });
    }
  };

  const updateCurrentItem = (field: 'value' | 'details', value: string) => {
    setCurrentItem(prev => ({ ...prev, [field]: value }));
  };

  const saveItem = () => {
    if (!currentItem.value.trim()) {
      toast({
        title: "Error",
        description: "Position/Institution is required",
        variant: "destructive"
      });
      return;
    }
    
    if (editingId) {
      // Update existing item
      setExperience(experience.map(item => 
        item.id === editingId 
          ? { ...currentItem, id: editingId, saved: true } 
          : item
      ));
      toast({
        title: "Experience updated",
        description: "Experience entry has been updated successfully",
      });
    } else {
      // Add new item
      setExperience([...experience, { ...currentItem, saved: true }]);
      toast({
        title: "Experience added",
        description: "New experience entry has been added successfully",
      });
    }
    
    // Reset the form
    setEditingId(null);
    setCurrentItem({
      id: Date.now().toString(),
      value: "",
      details: ""
    });
  };

  const editItem = (id: string) => {
    const itemToEdit = experience.find(item => item.id === id);
    if (itemToEdit) {
      setEditingId(id);
      setCurrentItem(itemToEdit);
    }
  };
  
  // Filter saved and unsaved items
  const savedExperiences = experience.filter(item => item.saved);
  
  return (
    <div className="space-y-6">
      {/* Table of saved experiences */}
      {savedExperiences.length > 0 && (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full bg-white text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Position/Institution</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Details</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {savedExperiences.map((exp) => (
                <tr key={exp.id} className="border-b">
                  <td className="px-4 py-3">{exp.value}</td>
                  <td className="px-4 py-3">
                    {exp.details && exp.details.length > 50 
                      ? `${exp.details.substring(0, 50)}...` 
                      : exp.details}
                  </td>
                  <td className="px-4 py-3 flex justify-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => editItem(exp.id)}
                    >
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeItem(exp.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Experience Form */}
      <div className="p-4 border rounded-md bg-white">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-medium text-sm">
            {editingId ? "Edit Experience" : "Add New Experience"}
          </h4>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="exp-position">Position/Institution</Label>
            <Input 
              id="exp-position"
              value={currentItem.value}
              onChange={(e) => updateCurrentItem('value', e.target.value)}
              placeholder="e.g., Mathematics Teacher at ABC School"
            />
          </div>
          
          <div>
            <Label htmlFor="exp-details">Years & Details</Label>
            <Textarea
              id="exp-details"
              value={currentItem.details || ""}
              onChange={(e) => updateCurrentItem('details', e.target.value)}
              placeholder="e.g., 2019-2022, Taught Grade 9-12 Mathematics, improved class average by 15%"
              rows={4}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            {editingId && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setCurrentItem({
                    id: Date.now().toString(),
                    value: "",
                    details: ""
                  });
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={saveItem}
            >
              <Save className="mr-2 h-4 w-4" />
              {editingId ? "Update Experience" : "Save Experience"}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Add New Experience Button */}
      {editingId && (
        <Button
          variant="outline"
          className="w-full"
          onClick={addItem}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Another Experience
        </Button>
      )}
    </div>
  );
};

export default ExperienceStep;
