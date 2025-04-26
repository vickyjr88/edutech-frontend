
import { InstitutionType } from "../types";
import { useToast } from "@/hooks/use-toast";
import {Education, teacherService} from "@/integrations/api/services/teacher.service.ts";

// Format date from YYYY-MM to YYYY-MM-DD for database storage
export const formatDateForDatabase = (dateString: string): string => {
  if (!dateString) return "";
  // Ensure the date is in YYYY-MM format first
  const normalized = dateString.match(/^\d{4}-\d{2}$/) 
    ? dateString 
    : (() => {
        const date = new Date(dateString);
        return !isNaN(date.getTime()) 
          ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` 
          : dateString;
      })();
  
  // Append day "01" to make it a valid date for PostgreSQL
  return `${normalized}-01`;
};

// Save education record to database
export const saveEducationRecord = async (
  teacherId: string,
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
      id: educationData.id,
      teacherProfile: teacherId,
      institutionType: educationData.institutionType,
      institutionName: educationData.institution,
      degree: educationData.degree || null,
      additionalDetails: educationData.details || null,
      startDate: formatDateForDatabase(educationData.startDate),
      endDate: educationData.currentlyStudying
          ? null
          : (educationData.endDate ? formatDateForDatabase(educationData.endDate) : null),
      isCurrentlyStudying: educationData.currentlyStudying
  } as unknown as Education;
  
  console.log("Saving education data:", formattedData);

    // Determine if we're creating a new record or updating an existing one
    const isUpdate = !!formattedData['id'];

    let result;
    if (isUpdate) {
        // Update existing education record
        const { data, error } = await teacherService.updateEducation(
            formattedData.id,
            formattedData,
        );

        if (error) {
            throw error;
        }

        result = data;
    } else
    {
        // Create new education record
        const { data, error } = await teacherService.addEducation(formattedData);

        if (error) {
            throw error;
        }

        result = data;
    }

    return result;
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
