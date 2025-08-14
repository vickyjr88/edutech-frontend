
import { InstitutionType, ExperienceItem } from "../types";
import {teacherService} from "@/integrations/api/services/teacher.service.ts";

// Format date from YYYY-MM to YYYY-MM-DD for database storage
export const formatDateForDatabase = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString; // Return original string if invalid
  }
  // If it's already in YYYY-MM format, just append -01
  if (dateString.match(/^\d{4}-\d{2}$/)) {
    return `${dateString}-01`;
  }
  // Otherwise, format to YYYY-MM-01
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
};

// Save experience record to database
export const saveExperienceRecord = async (
    teacherId: string,
  experienceData: {
    _id: string;
    position: string;
    institution: string;
    institutionType: InstitutionType | "";
    additionalDetails?: string;
    startDate: string;
    endDate: string;
    isCurrentlyWorking: boolean;
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
    teacherProfile: teacherId,
    ...experienceData,
    // Ensure we have the right property name for the backend
    additionalDetails: experienceData.additionalDetails || experienceData.additionalDetails
  };
  
  console.log("Saving experience data:", formattedData);

  // Check if this is a new entry (with a temporary ID) or an existing one
  const isNewRecord = !experienceData._id || experienceData._id.startsWith("temp_");

// Remove properties that shouldn't be sent to the API
  const { _id, createdAt, updatedAt, __v, ...cleanData } = formattedData as any;
  
  // Prepare data to send to API
  const dataToSend = {
    ...cleanData,
    id: isNewRecord ? undefined : experienceData._id
  };

  let result;
  if (isNewRecord) {
    // Create new experience record
    const { data, error } = await teacherService.addExperience(dataToSend);

    if (error) {
      throw error;
    }

    result = data;
  } else {
    // Update existing experience record - remove properties that shouldn't exist
    // Add debug logging
    console.log("Updating experience with ID:", experienceData._id);
    console.log("Data to send:", dataToSend);
    
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
  
  // Format dates to be human-readable and mark as saved
  const formattedData = data.map(record => ({
    ...record,
    startDate: record.startDate ? new Date(record.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "",
    endDate: record.endDate ? new Date(record.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : "",
    saved: true
  }));

  return formattedData;
};

// Delete experience record
export const deleteExperienceRecord = async (id: string, teacherId?: string): Promise<void> => {
  // If teacherId is not provided, we need to extract it from the experience record
  if (!teacherId) {
    try {
      const { data, error } = await teacherService.getExperience(id);
      if (error) {
        throw error;
      }
      teacherId = data?.teacherProfile;
    } catch (e) {
      console.error("Failed to get teacherId for experience deletion", e);
      throw e;
    }
  }

  if (!teacherId) {
    throw new Error("TeacherId is required for deleting experience");
  }

  const { error } = await teacherService.deleteExperience(id, teacherId);
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
