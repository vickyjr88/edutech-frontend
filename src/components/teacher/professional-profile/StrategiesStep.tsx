
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { StrategyItem, fetchStrategyRecords, saveStrategyRecord, updateStrategyRecord, deleteStrategyRecord } from "./utils/strategyUtils";
import StrategiesTable from "./strategies/StrategiesTable";
import StrategiesForm from "./strategies/StrategiesForm";

type StrategiesStepProps = {
  strategies: StrategyItem[];
  setStrategies: React.Dispatch<React.SetStateAction<StrategyItem[]>>;
};

const StrategiesStep = ({ strategies, setStrategies }: StrategiesStepProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentItem, setCurrentItem] = useState<StrategyItem>({
    id: "",
    strategy: "",
    description: "",
    is_certified: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchStrategies();
    }
  }, [user]);

  const fetchStrategies = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await fetchStrategyRecords(user.id);
      if (data.length > 0) {
        setStrategies(data);
      }
    } catch (error) {
      console.error("Error fetching strategies:", error);
      toast({
        title: "Error",
        description: "Failed to load teaching strategies",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStrategyChange = (value: string) => {
    setCurrentItem(prev => ({ ...prev, strategy: value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentItem(prev => ({ ...prev, description: e.target.value }));
  };

  const handleCertifiedChange = (checked: boolean) => {
    setCurrentItem(prev => ({ ...prev, is_certified: checked }));
  };

  const handleAddOrUpdateStrategy = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save strategies",
        variant: "destructive"
      });
      return;
    }

    if (!currentItem.strategy) {
      toast({
        title: "Error",
        description: "Please select a teaching strategy",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing) {
        const success = await updateStrategyRecord(currentItem);
        if (success) {
          setStrategies(prev => 
            prev.map(s => 
              s.id === currentItem.id ? currentItem : s
            )
          );
          toast({
            title: "Success",
            description: "Teaching strategy updated successfully",
          });
        } else {
          throw new Error("Failed to update strategy");
        }
      } else {
        const newStrategy = await saveStrategyRecord(user.id, currentItem);
        if (newStrategy) {
          setStrategies(prev => [newStrategy, ...prev]);
          toast({
            title: "Success",
            description: "New teaching strategy added successfully",
          });
        } else {
          throw new Error("Failed to save strategy");
        }
      }
      
      // Reset form
      setCurrentItem({
        id: "",
        strategy: "",
        description: "",
        is_certified: false
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving strategy:", error);
      toast({
        title: "Error",
        description: "Failed to save teaching strategy",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: StrategyItem) => {
    setCurrentItem(item);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teaching strategy?")) {
      return;
    }

    try {
      const success = await deleteStrategyRecord(id);
      if (success) {
        setStrategies(prev => prev.filter(s => s.id !== id));
        toast({
          title: "Success",
          description: "Teaching strategy deleted successfully",
        });
      } else {
        throw new Error("Failed to delete strategy");
      }
    } catch (error) {
      console.error("Error deleting strategy:", error);
      toast({
        title: "Error",
        description: "Failed to delete teaching strategy",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setCurrentItem({
      id: "",
      strategy: "",
      description: "",
      is_certified: false
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Strategies Table */}
      {strategies.length > 0 && (
        <StrategiesTable
          strategies={strategies}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add/Edit Strategy Form */}
      <StrategiesForm
        currentItem={currentItem}
        isEditing={isEditing}
        isSaving={isSaving}
        onStrategyChange={handleStrategyChange}
        onDescriptionChange={handleDescriptionChange}
        onCertifiedChange={handleCertifiedChange}
        onSave={handleAddOrUpdateStrategy}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default StrategiesStep;
