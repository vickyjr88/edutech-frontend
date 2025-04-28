
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
  _id?: string;
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
    
    // Log the API response to see what ID field it has
    console.log("API Strategy Records:", data);
    
    return data.map((record: any) => ({
      // Use record._id if it exists, otherwise fallback to record.id
      _id: record._id || record.id,
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
    
    console.log("API Response for addTeachingStrategy:", data);
    
    // Handle different response formats that might come from the API
    let newRecord;
    if (Array.isArray(data) && data.length > 0) {
      newRecord = data[0];
    } else if (data && typeof data === 'object') {
      newRecord = data;
    } else {
      console.error("Unexpected API response format:", data);
      // If we can't get the new record from the API response,
      // fetch all strategies to get the updated list
      const allStrategies = await fetchStrategyRecords(teacherId);
      if (allStrategies.length > 0) {
        // Return first strategy as a fallback
        return allStrategies[0];
      }
      throw new Error("Could not parse API response");
    }
    
    return {
      _id: newRecord._id || newRecord.id,
      strategy: newRecord.strategy || newRecord.name || item.strategy,
      description: newRecord.description || "",
      isCertified: newRecord.isCertified || false
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
    console.log("Updating strategy with item:", item);
    console.log("Item ID type:", typeof item._id, "Value:", item._id);
    
    const strategyToUpdate = {
      _id: item._id,
      description: item.description,
      strategy: item.strategy,
      isCertified: item.isCertified
    };
    
    console.log("Strategy object for API:", strategyToUpdate);
    
    const { error } = await teacherService.updateTeachingStrategy(teacherId, strategyToUpdate);
    if (error) {
      console.error("API error response:", error);
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
