
import { InstitutionType, ExperienceItem } from "../types";
import {teacherService} from "@/integrations/api/services/teacher.service.ts";

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

// Save experience record to database
export const saveExperienceRecord = async (
  userId: string,
  experienceData: {
    _id: string;
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
      phoneNumber: string;
    };
  }
): Promise<any> => {
  // Default to "other" if institutionType is empty
  const institutionType = experienceData.institutionType || "other";
  
  const formattedData = {
    user_id: userId,
    ...experienceData,
    id: experienceData._id
  };
  
  console.log("Saving experience data:", formattedData);

  // Check if this is a new entry (with a temporary ID) or an existing one
  const isNewRecord = !experienceData._id || experienceData._id.startsWith("temp_");

// Remove the temporary ID before sending to the API
  const dataToSend = {
    ...formattedData,
    id: isNewRecord ? undefined : experienceData._id
  };

  let result;
  if (isNewRecord) {
    // Create new experience record
    const { data, error } = await teacherService.addExperience(experienceData);

    if (error) {
      throw error;
    }

    result = data;
  } else {
    // Update existing experience record
    const { data, error } = await teacherService.updateExperience(
        experienceData._id,
        dataToSend
    );

    if (error) {
      throw error;
    }

    result = data;
  }

  return result;
};

// Fetch experience records for a user
export const fetchExperienceRecords = async (teacherId: string): Promise<ExperienceItem[]> => {

// Get all experiences for this teacher
  const { data, error } = await teacherService.getTeacherExperiences(teacherId);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }
  
  // Format dates to be human-readable
  const formattedData = data.map(record => ({
    ...record,
    startDate: record.startDate ? new Date(record.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "",
    endDate: record.endDate ? new Date(record.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : ""
  }));

  return formattedData;
};

// Delete experience record
export const deleteExperienceRecord = async (id: string): Promise<void> => {
  const { error } = await teacherService.deleteExperience(id);
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
