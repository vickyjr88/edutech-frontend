
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash, PlusCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  TechnicalSkillItem,
  TECHNICAL_SKILLS,
  fetchTechnicalSkills,
  saveTechnicalSkill,
  updateTechnicalSkill,
  deleteTechnicalSkill
} from "./utils/technicalSkillUtils";

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
  
  // Filter out skills that are already added
  const availableSkills = TECHNICAL_SKILLS.filter(
    skill => !skills.some(s => s.skill.toLowerCase() === skill.toLowerCase())
  );

  const form = useForm<TechnicalSkillItem>({
    defaultValues: {
      id: "",
      skill: "",
      description: "",
      isCertified: false
    }
  });

  useEffect(() => {
    if (user) {
      loadTechnicalSkills();
    }
  }, [user]);

  useEffect(() => {
    if (currentSkill) {
      form.reset({
        id: currentSkill.id,
        skill: currentSkill.skill,
        description: currentSkill.description || "",
        isCertified: currentSkill.isCertified
      });
    } else {
      form.reset({
        id: "",
        skill: "",
        description: "",
        isCertified: false
      });
    }
  }, [currentSkill, form]);

  const loadTechnicalSkills = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const loadedSkills = await fetchTechnicalSkills(user.id);
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
        result = await updateTechnicalSkill({
          ...data,
          id: currentSkill.id
        });
        
        if (result.success) {
          setSkills(prev => 
            prev.map(s => s.id === currentSkill.id ? {
              ...data,
              id: currentSkill.id
            } : s)
          );
          
          toast({
            title: "Skill updated",
            description: `${data.skill} has been updated`
          });
        }
      } else {
        // Create new skill
        result = await saveTechnicalSkill(user.id, data);
        
        if (result.success && result.id) {
          const newSkill = {
            ...data,
            id: result.id
          };
          
          setSkills(prev => [...prev, newSkill]);
          
          toast({
            title: "Skill added",
            description: `${data.skill} has been added to your profile`
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
      const result = await deleteTechnicalSkill(skillId);
      
      if (result.success) {
        setSkills(prev => prev.filter(s => s.id !== skillId));
        
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
      id: "",
      skill: "",
      description: "",
      isCertified: false
    });
    setCurrentSkill(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {skills.length > 0 && (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Skill</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Certified</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skills.map(skill => (
                <TableRow key={skill.id}>
                  <TableCell className="font-medium">{skill.skill}</TableCell>
                  <TableCell>{skill.description || "-"}</TableCell>
                  <TableCell>{skill.isCertified ? "Yes" : "No"}</TableCell>
                  <TableCell className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleEdit(skill)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDelete(skill.id, skill.skill)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="border rounded-md p-4">
        <h3 className="text-lg font-medium mb-4">
          {isEditing ? "Edit Technical Skill" : "Add Technical Skill"}
        </h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateOrUpdate)} className="space-y-4">
            <FormField
              control={form.control}
              name="skill"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technical Skill</FormLabel>
                  {isEditing ? (
                    <div className="p-2 border rounded-md">{field.value}</div>
                  ) : (
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a technical skill" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSkills.map(skill => (
                          <SelectItem key={skill} value={skill}>
                            {skill}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Why you enjoy using this skill)</FormLabel>
                  <Textarea
                    placeholder="Describe how you use this skill in your teaching..."
                    disabled={isLoading}
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isCertified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Certified</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Do you have a certification for this skill?
                    </div>
                  </div>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-2">
              <Button type="submit" disabled={isLoading}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {isEditing ? "Update Skill" : "Add Skill"}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm} disabled={isLoading}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TechnicalSkillsStep;
