import {teacherService} from "@/integrations/api/services/teacher.service.ts";


export const TEACHING_METHODOLOGIES = [
  "Bloom's Taxonomy",
  "Montessori Method",
  "Waldorf Education",
  "Multiple Intelligences",
  "Reggio Emilia Approach",
  "Constructivism",
  "Culturally Responsive Teaching",
  "Universal Design for Learning",
  "Expeditionary Learning",
  "Mastery Learning"
];

export type MethodologyItem = {
  id: string;
  methodology: string;
  description?: string;
  is_certified: boolean;
  isSaving?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
};

export const fetchMethodologyRecords = async (teacherId: string): Promise<MethodologyItem[]> => {
  try {
    const { data, error } = await teacherService.getTeachingMethology(teacherId)
    
    if (error) {
      throw error;
    }
    
    return data.map((record: any) => ({
      id: record.id,
      methodology: record.methodology,
      description: record.description || "",
      is_certified: record.is_certified || false
    }));
  } catch (error) {
    console.error("Error fetching methodology records:", error);
    return [];
  }
};

export const saveMethodologyRecord = async (
  teacherId: string,
  item: Omit<MethodologyItem, 'isSaving' | 'isError' | 'isSuccess'>
): Promise<MethodologyItem | null> => {
  try {
    const {data, error} =  await teacherService.addTeachingMethodology(teacherId,item)

    if (error) {
      throw error;
    }
    
    const newRecord = data[0] as any;
    return {
      id: newRecord.id,
      methodology: newRecord.methodology,
      description: newRecord.description || "",
      is_certified: newRecord.is_certified
    };
  } catch (error) {
    console.error("Error saving methodology record:", error);
    return null;
  }
};

export const updateMethodologyRecord = async (
    teacherId: string,
    item: Omit<MethodologyItem, 'isSaving' | 'isError' | 'isSuccess'>
): Promise<boolean> => {
  try {
    const { error } = await teacherService.updateTeachingMethodology(teacherId,item)
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating methodology record:", error);
    return false;
  }
};

export const deleteMethodologyRecord = async (teacherId: string,id: string): Promise<boolean> => {
  try {
    const { error } = await teacherService.deleteTeachingMethodology(teacherId, id)
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting methodology record:", error);
    return false;
  }
};
