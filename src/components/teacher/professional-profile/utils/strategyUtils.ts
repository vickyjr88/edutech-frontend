
import { supabase } from "@/integrations/api/client.ts";
import { useToast } from "@/hooks/use-toast";

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
  id: string;
  strategy: string;
  description?: string;
  is_certified: boolean;
  isSaving?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
};

export const fetchStrategyRecords = async (userId: string): Promise<StrategyItem[]> => {
  try {
    const { data, error } = await supabase
      .from('teacher_strategies' as any)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map((record: any) => ({
      id: record.id,
      strategy: record.strategy,
      description: record.description || "",
      is_certified: record.is_certified || false
    }));
  } catch (error) {
    console.error("Error fetching strategy records:", error);
    return [];
  }
};

export const saveStrategyRecord = async (
  userId: string,
  item: Omit<StrategyItem, 'isSaving' | 'isError' | 'isSuccess'>
): Promise<StrategyItem | null> => {
  try {
    const { data, error } = await supabase
      .from('teacher_strategies' as any)
      .insert({
        user_id: userId,
        strategy: item.strategy,
        description: item.description || null,
        is_certified: item.is_certified
      })
      .select();
    
    if (error) {
      throw error;
    }
    
    const newRecord = data[0] as any;
    return {
      id: newRecord.id,
      strategy: newRecord.strategy,
      description: newRecord.description || "",
      is_certified: newRecord.is_certified
    };
  } catch (error) {
    console.error("Error saving strategy record:", error);
    return null;
  }
};

export const updateStrategyRecord = async (
  item: Omit<StrategyItem, 'isSaving' | 'isError' | 'isSuccess'>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('teacher_strategies' as any)
      .update({
        strategy: item.strategy,
        description: item.description || null,
        is_certified: item.is_certified
      })
      .eq('id', item.id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating strategy record:", error);
    return false;
  }
};

export const deleteStrategyRecord = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('teacher_strategies' as any)
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting strategy record:", error);
    return false;
  }
};
