
import { InstitutionType, ExperienceItem } from "../types";
import { supabase } from "@/integrations/api/client.ts";

// Format date from YYYY-MM to YYYY-MM-DD for database storage
export const formatDateForDatabase = (dateString: string): string => {
  if (!dateString) return "";
  // Append day "01" to make it a valid date for PostgreSQL
  return `${dateString}-01`;
};

// Save experience record to database
export const saveExperienceRecord = async (
  userId: string,
  experienceData: {
    id: string;
    position: string;
    institution: string;
    institutionType: InstitutionType | "";
    details?: string;
    startDate: string;
    endDate: string;
    currentlyWorking: boolean;
    subjects: string[];
    curriculums: string[];
    grades: string[];
    reportingManager?: {
      name: string;
      phone: string;
    };
  }
): Promise<any> => {
  // Default to "other" if institutionType is empty
  const institutionType = experienceData.institutionType || "other";
  
  const formattedData = {
    user_id: userId,
    position: experienceData.position,
    institution: experienceData.institution,
    institution_type: institutionType,
    details: experienceData.details || null,
    start_date: formatDateForDatabase(experienceData.startDate),
    end_date: experienceData.currentlyWorking 
      ? null 
      : (experienceData.endDate ? formatDateForDatabase(experienceData.endDate) : null),
    currently_working: experienceData.currentlyWorking,
    subjects: experienceData.subjects,
    curriculums: experienceData.curriculums,
    grades: experienceData.grades,
    reporting_manager_name: experienceData.reportingManager?.name || null,
    reporting_manager_phone: experienceData.reportingManager?.phone || null
  };
  
  console.log("Saving experience data:", formattedData);
  
  const { data, error } = await supabase
    .from('teacher_experience')
    .upsert({
      ...formattedData,
      id: experienceData.id.startsWith("temp_") ? undefined : experienceData.id
    })
    .select();
  
  if (error) {
    throw error;
  }
  
  return data;
};

// Fetch experience records for a user
export const fetchExperienceRecords = async (userId: string): Promise<ExperienceItem[]> => {
  const { data, error } = await supabase
    .from('teacher_experience')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw error;
  }
  
  if (!data || data.length === 0) {
    return [];
  }
  
  return data.map(record => ({
    id: record.id,
    position: record.position,
    institution: record.institution,
    institutionType: record.institution_type as InstitutionType,
    details: record.details || "",
    startDate: record.start_date.substring(0, 7),
    endDate: record.end_date ? record.end_date.substring(0, 7) : "",
    currentlyWorking: record.currently_working,
    subjects: record.subjects || [],
    curriculums: record.curriculums || [],
    grades: record.grades || [],
    reportingManager: record.reporting_manager_name ? {
      name: record.reporting_manager_name,
      phone: record.reporting_manager_phone || ""
    } : undefined,
    saved: true
  }));
};

// Delete experience record
export const deleteExperienceRecord = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('teacher_experience')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw error;
  }
};

// Validation functions
export const validateExperienceData = (
  position: string,
  institution: string,
  institutionType: string,
  startDate: string
) => {
  const errors: string[] = [];
  
  if (!position) {
    errors.push("Position is required");
  }
  
  if (!institution) {
    errors.push("Institution is required");
  }
  
  if (!institutionType) {
    errors.push("Institution type is required");
  }
  
  if (!startDate) {
    errors.push("Start date is required");
  }
  
  return errors;
};
