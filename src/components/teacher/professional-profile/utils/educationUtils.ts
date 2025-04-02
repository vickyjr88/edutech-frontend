
import { InstitutionType } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Format date from YYYY-MM to YYYY-MM-DD for database storage
export const formatDateForDatabase = (dateString: string): string => {
  if (!dateString) return "";
  // Append day "01" to make it a valid date for PostgreSQL
  return `${dateString}-01`;
};

// Save education record to database
export const saveEducationRecord = async (
  userId: string,
  educationData: {
    id: string;
    institutionType: InstitutionType;
    institution: string;
    degree?: string;
    details?: string;
    startDate: string;
    endDate: string;
    currentlyStudying: boolean;
  }
) => {
  const formattedData = {
    user_id: userId,
    institution_type: educationData.institutionType,
    institution_name: educationData.institution,
    degree: educationData.degree || null,
    details: educationData.details || null,
    start_date: formatDateForDatabase(educationData.startDate),
    end_date: educationData.currentlyStudying 
      ? null 
      : (educationData.endDate ? formatDateForDatabase(educationData.endDate) : null),
    currently_studying: educationData.currentlyStudying
  };
  
  console.log("Saving education data:", formattedData);
  
  const { data, error } = await supabase
    .from('teacher_education')
    .upsert(formattedData)
    .select();
  
  if (error) {
    throw error;
  }
  
  return data;
};

// Validation functions
export const validateEducationData = (
  institutionType: string,
  institution: string,
  startDate: string
) => {
  const errors: string[] = [];
  
  if (!institutionType) {
    errors.push("Institution type is required");
  }
  
  if (!institution) {
    errors.push("Institution name is required");
  }
  
  if (!startDate) {
    errors.push("Start date is required");
  }
  
  return errors;
};
