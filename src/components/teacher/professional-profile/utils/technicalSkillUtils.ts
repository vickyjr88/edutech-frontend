import {teacherService} from "@/integrations/api/services/teacher.service.ts";
export type TechnicalSkillItem = {
  _id: string;
  name: string;
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

export const fetchTechnicalSkills = async (teacherId: string): Promise<TechnicalSkillItem[]> => {
  try {
    const {data, error} = await teacherService.getTechnicalSkills(teacherId);

    if (error) {
      console.error('Error fetching technical skills:', error);
      return [];
    }

    if (!data || !Array.isArray(data)) {
      console.error('Invalid technical skills data from API:', data);
      return [];
    }
    
    return data.map(item => ({
      _id: item._id || item.id || '',
      name: item.skill || item.name || '',
      description: item.description || undefined,
      isCertified:  item.isCertified || false
    }));
  } catch (error) {
    console.error('Error in fetchTechnicalSkills:', error);
    return [];
  }
};

export const saveTechnicalSkill = async (
  teacherId: string,
  skill: TechnicalSkillItem
): Promise<{ success: boolean; _id?: string; error?: string }> => {
  try {
    if (!teacherId) {
      throw new Error('Teacher ID is required');
    }
    
    // Format skill data for the API
    const skillData = {
      _id: skill._id,
      name: skill.name,        // API expects 'skill' not 'name'
      description: skill.description || '',
      isCertified: skill.isCertified  // API might expect is_certified
    };
    
    console.log("Saving technical skill:", skillData);
    const { data, error } = await teacherService.addTechnicalSkills(teacherId, skillData as any);

    if (error) {
      console.error("API error when saving skill:", error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from API');
    }

    console.log("API response for save skill:", data);
    return { success: true, _id: data._id || data.id };
  } catch (error: any) {
    console.error('Error saving technical skill:', error);
    return { success: false, error: error.message || 'Unknown error saving skill' };
  }
};

export const updateTechnicalSkill = async (
    teacherId: string,
    skill: TechnicalSkillItem
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!teacherId || !skill._id) {
      throw new Error('Teacher ID and Skill ID are required');
    }
    
    // Format skill data for the API
    const skillData = {
      _id: skill._id,
      name: skill.name,
      description: skill.description || '',
      isCertified: skill.isCertified
    };
    
    console.log("Updating technical skill:", skillData);
    const {data, error} = await teacherService.updateTechnicalSkill(teacherId, skillData as any);

    if (error) {
      console.error("API error when updating skill:", error);
      throw error;
    }

    console.log("API response for update skill:", data);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating technical skill:', error);
    return { success: false, error: error.message || 'Unknown error updating skill' };
  }
};

export const deleteTechnicalSkill = async (
    teacherId: string,
    skillId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!teacherId || !skillId) {
      throw new Error('Teacher ID and Skill ID are required');
    }
    
    console.log(`Deleting technical skill with ID ${skillId} for teacher ${teacherId}`);
    const {data, error} = await teacherService.deleteTechnicalSkill(teacherId, skillId);

    if (error) {
      console.error("API error when deleting skill:", error);
      throw error;
    }

    console.log("API response for delete skill:", data);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting technical skill:', error);
    return { success: false, error: error.message || 'Unknown error deleting skill' };
  }
};
