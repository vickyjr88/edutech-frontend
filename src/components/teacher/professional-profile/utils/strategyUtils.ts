
import { useToast } from "@/hooks/use-toast";
import {teacherService} from "@/integrations/api/services/teacher.service.ts";

export const TEACHING_STRATEGIES = [
  "Differentiated Instruction",
  "Project-Based Learning",
  "Cooperative Learning",
  "Inquiry-Based Learning",
  "Blended Learning",
  "Flipped Classroom",
  "Gamification",
  "Direct Instruction",
  "Problem-Based Learning",
  "Socratic Method"
];

export type StrategyItem = {
  id?: string;
  strategy: string;
  description?: string;
  isCertified: boolean;
  isSaving?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
}

export const fetchStrategyRecords = async (teacherId: string): Promise<StrategyItem[]> => {
  try {
    const { data, error } = await teacherService.getTeachingStrategies(teacherId);

    if (error) {
      throw error;
    }
    
    return data.map((record: any) => ({
      id: record.id,
      strategy: record.strategy,
      description: record.description || "",
      isCertified: record.isCertified || false
    }));
  } catch (error) {
    console.error("Error fetching strategy records:", error);
    return [];
  }
};

export const saveStrategyRecord = async (
    teacherId: string,
  item: Omit<StrategyItem, 'isSaving' | 'isError' | 'isSuccess'>
): Promise<StrategyItem | null> => {
  try {
    const { data, error } = await teacherService.addTeachingStrategy(teacherId,
        {
          strategy: item.strategy,
          description: item.description || null,
          "isCertified": item.isCertified
        }
    );
    
    if (error) {
      throw error;
    }
    
    const newRecord = data[0] as any;
    return {
      id: newRecord._id,
      strategy: newRecord.strategy,
      description: newRecord.description || "",
      isCertified: newRecord.isCertified
    };
  } catch (error) {
    console.error("Error saving strategy record:", error);
    return null;
  }
};

export const updateStrategyRecord = async (
    teacherId: string, item: Omit<StrategyItem, 'isSaving' | 'isError' | 'isSuccess'>
): Promise<boolean> => {
  try {
    const { error } = await teacherService.updateTeachingStrategy(teacherId, {
      id:item.id,
      description:item.description,
      strategy:item.strategy,
      isCertified: item.isCertified
    })
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating strategy record:", error);
    return false;
  }
};

export const deleteStrategyRecord = async (teacherId: string, id: string): Promise<boolean> => {
  try {
    const { error } = await teacherService.deleteTeachingStrategy(teacherId, id)
    if (error) {
      throw error;
    }
    return true;
  } catch (error) {
    console.error("Error deleting strategy record:", error);
    return false;
  }
};
