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
  _id?: string;
  name: string;
  description?: string;
  isCertified: boolean;
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
    
    console.log("Methodology API response:", data);
    
    return data.map((record: any) => ({
      _id: record._id || record.id,
      name: record.name || record.methodology,
      description: record.description || "",
      isCertified: record.isCertified || record.is_certified || false
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
    delete item._id
    const {data, error} =  await teacherService.addTeachingMethodology(teacherId,item)

    if (error) {
      throw error;
    }
    
    console.log("Add methodology API response:", data);
    
    // Handle different response formats
    let newRecord;
    if (Array.isArray(data) && data.length > 0) {
      newRecord = data[0];
    } else if (data && typeof data === 'object') {
      newRecord = data;
    } else {
      console.error("Unexpected API response format:", data);
      throw new Error("Invalid API response format");
    }
    
    return {
      _id: newRecord._id || newRecord.id,
      name: newRecord.name || newRecord.methodology,
      description: newRecord.description || "",
      isCertified: newRecord.isCertified || newRecord.is_certified || false
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
