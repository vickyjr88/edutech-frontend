
import { supabase } from "@/integrations/supabase/client";

export type TechnicalSkillItem = {
  id: string;
  skill: string;
  description?: string;
  isCertified: boolean;
};

// Predefined list of technical skills
export const TECHNICAL_SKILLS = [
  "Microsoft Office",
  "Google Workspace",
  "Learning Management Systems (LMS)",
  "Video Conferencing Tools",
  "Digital Assessment Tools",
  "Interactive Whiteboard",
  "Educational Apps",
  "Coding/Programming",
  "Web Design",
  "Graphic Design",
  "Video Editing",
  "Audio Production",
  "Data Analysis",
  "Cybersecurity",
  "Cloud Computing"
];

export const fetchTechnicalSkills = async (userId: string): Promise<TechnicalSkillItem[]> => {
  try {
    const { data, error } = await supabase
      .from('teacher_technical_skills')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching technical skills:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      skill: item.skill,
      description: item.description || undefined,
      isCertified: item.is_certified || false
    }));
  } catch (error) {
    console.error('Error in fetchTechnicalSkills:', error);
    return [];
  }
};

export const saveTechnicalSkill = async (
  userId: string,
  skill: TechnicalSkillItem
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('teacher_technical_skills')
      .insert({
        user_id: userId,
        skill: skill.skill,
        description: skill.description || null,
        is_certified: skill.isCertified
      })
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return { success: true, id: data.id };
  } catch (error: any) {
    console.error('Error saving technical skill:', error);
    return { success: false, error: error.message };
  }
};

export const updateTechnicalSkill = async (
  skill: TechnicalSkillItem
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('teacher_technical_skills')
      .update({
        skill: skill.skill,
        description: skill.description || null,
        is_certified: skill.isCertified
      })
      .eq('id', skill.id);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating technical skill:', error);
    return { success: false, error: error.message };
  }
};

export const deleteTechnicalSkill = async (
  skillId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('teacher_technical_skills')
      .delete()
      .eq('id', skillId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting technical skill:', error);
    return { success: false, error: error.message };
  }
};
