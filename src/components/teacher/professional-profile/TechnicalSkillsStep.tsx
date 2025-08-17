
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import {
  TechnicalSkillItem,
  TECHNICAL_SKILLS,
  fetchTechnicalSkills,
  saveTechnicalSkill,
  updateTechnicalSkill,
  deleteTechnicalSkill
} from "./utils/technicalSkillUtils";
import SkillsTable from "./technical-skills/SkillsTable";
import SkillsForm from "./technical-skills/SkillsForm";

interface TechnicalSkillsStepProps {
  skills: TechnicalSkillItem[];
  setSkills: React.Dispatch<React.SetStateAction<TechnicalSkillItem[]>>;
}

const TechnicalSkillsStep = ({ skills, setSkills }: TechnicalSkillsStepProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<TechnicalSkillItem | null>(null);
  
  const form = useForm<TechnicalSkillItem>({
    defaultValues: {
      _id: "",
      name: "",
      description: "",
      isCertified: false
    }
  });

  // Filter out skills that are already added
  const availableSkills = TECHNICAL_SKILLS.filter(
    skill => !skills.some(s => s.name && s.name.toLowerCase() === skill.toLowerCase())
  );

  useEffect(() => {
    if (user) {
      loadTechnicalSkills();
    }
  }, [user]);

  useEffect(() => {
    if (currentSkill) {
      form.reset({
        _id: currentSkill._id,
        name: currentSkill.name,
        description: currentSkill.description || "",
        isCertified: currentSkill.isCertified
      });
    } else {
      form.reset({
        _id: "",
        name: "",
        description: "",
        isCertified: false
      });
    }
  }, [currentSkill, form]);

  const loadTechnicalSkills = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const loadedSkills = await fetchTechnicalSkills(user.teacherId);
      setSkills(loadedSkills);
    } catch (error) {
      console.error("Error loading technical skills:", error);
      toast({
        title: "Error",
        description: "Failed to load technical skills",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async (data: TechnicalSkillItem) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to save technical skills",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      let result;
      
      if (isEditing && currentSkill) {
        // Update existing skill
        result = await updateTechnicalSkill(user.teacherId ,{
          ...data,
          _id: currentSkill._id
        });
        
        if (result.success) {
          setSkills(prev => 
            prev.map(s => s._id === currentSkill._id ? {
              ...data,
              _id: currentSkill._id
            } : s)
          );
          
          toast({
            title: "Skill updated",
            description: `${data.name} has been updated`
          });
        }
      } else {
        // Create new skill
        result = await saveTechnicalSkill(user.teacherId, data);
        
        if (result.success && result._id) {
          const newSkill = {
            ...data,
            _id: result._id
          };
          
          setSkills(prev => [...prev, newSkill]);
          
          toast({
            title: "Skill added",
            description: `${data.name} has been added to your profile`
          });
        }
      }
      
      if (!result.success) {
        throw new Error(result.error || "Failed to save skill");
      }
      
      resetForm();
    } catch (error: any) {
      console.error("Error saving technical skill:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save technical skill",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (skillId: string, skillName: string) => {
    if (!confirm(`Are you sure you want to delete "${skillName}"?`)) {
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await deleteTechnicalSkill(user.teacherId,skillId);
      
      if (result.success) {
        setSkills(prev => prev.filter(s => s._id !== skillId));
        
        toast({
          title: "Skill deleted",
          description: `${skillName} has been removed from your profile`
        });
      } else {
        throw new Error(result.error || "Failed to delete skill");
      }
    } catch (error: any) {
      console.error("Error deleting technical skill:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete technical skill",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (skill: TechnicalSkillItem) => {
    setCurrentSkill(skill);
    setIsEditing(true);
  };

  const resetForm = () => {
    form.reset({
      _id: "",
      name: "",
      description: "",
      isCertified: false
    });
    setCurrentSkill(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <SkillsTable 
        skills={skills}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <SkillsForm
        form={form}
        isEditing={isEditing}
        isLoading={isLoading}
        availableSkills={availableSkills}
        onSubmit={handleCreateOrUpdate}
        onCancel={resetForm}
      />
    </div>
  );
};

export default TechnicalSkillsStep;
