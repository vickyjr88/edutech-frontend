
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MethodologyItem, fetchMethodologyRecords, saveMethodologyRecord, updateMethodologyRecord, deleteMethodologyRecord } from "./utils/methodologyUtils";
import MethodologiesTable from "./methodologies/MethodologiesTable";
import MethodologiesForm from "./methodologies/MethodologiesForm";

type MethodologiesStepProps = {
  methodologies: MethodologyItem[];
  setMethodologies: React.Dispatch<React.SetStateAction<MethodologyItem[]>>;
};

const MethodologiesStep = ({ methodologies, setMethodologies }: MethodologiesStepProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentItem, setCurrentItem] = useState<MethodologyItem>({
    id: "",
    methodology: "",
    description: "",
    is_certified: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMethodologies();
    }
  }, [user]);

  const fetchMethodologies = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await fetchMethodologyRecords(user.id);
      if (data.length > 0) {
        setMethodologies(data);
      }
    } catch (error) {
      console.error("Error fetching methodologies:", error);
      toast({
        title: "Error",
        description: "Failed to load teaching methodologies",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMethodologyChange = (value: string) => {
    setCurrentItem(prev => ({ ...prev, methodology: value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentItem(prev => ({ ...prev, description: e.target.value }));
  };

  const handleCertifiedChange = (checked: boolean) => {
    setCurrentItem(prev => ({ ...prev, is_certified: checked }));
  };

  const handleAddOrUpdateMethodology = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save methodologies",
        variant: "destructive"
      });
      return;
    }

    if (!currentItem.methodology) {
      toast({
        title: "Error",
        description: "Please select a teaching methodology",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing) {
        const success = await updateMethodologyRecord(currentItem);
        if (success) {
          setMethodologies(prev => 
            prev.map(m => 
              m.id === currentItem.id ? currentItem : m
            )
          );
          toast({
            title: "Success",
            description: "Teaching methodology updated successfully",
          });
        } else {
          throw new Error("Failed to update methodology");
        }
      } else {
        const newMethodology = await saveMethodologyRecord(user.id, currentItem);
        if (newMethodology) {
          setMethodologies(prev => [newMethodology, ...prev]);
          toast({
            title: "Success",
            description: "New teaching methodology added successfully",
          });
        } else {
          throw new Error("Failed to save methodology");
        }
      }
      
      // Reset form
      setCurrentItem({
        id: "",
        methodology: "",
        description: "",
        is_certified: false
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving methodology:", error);
      toast({
        title: "Error",
        description: "Failed to save teaching methodology",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: MethodologyItem) => {
    setCurrentItem(item);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teaching methodology?")) {
      return;
    }

    try {
      const success = await deleteMethodologyRecord(id);
      if (success) {
        setMethodologies(prev => prev.filter(m => m.id !== id));
        toast({
          title: "Success",
          description: "Teaching methodology deleted successfully",
        });
      } else {
        throw new Error("Failed to delete methodology");
      }
    } catch (error) {
      console.error("Error deleting methodology:", error);
      toast({
        title: "Error",
        description: "Failed to delete teaching methodology",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setCurrentItem({
      id: "",
      methodology: "",
      description: "",
      is_certified: false
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Methodologies Table */}
      {methodologies.length > 0 && (
        <MethodologiesTable 
          methodologies={methodologies}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add/Edit Methodology Form */}
      <MethodologiesForm
        currentItem={currentItem}
        isEditing={isEditing}
        isSaving={isSaving}
        onMethodologyChange={handleMethodologyChange}
        onDescriptionChange={handleDescriptionChange}
        onCertifiedChange={handleCertifiedChange}
        onSave={handleAddOrUpdateMethodology}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default MethodologiesStep;
