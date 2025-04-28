import { teacherService } from "@/integrations/api/services/teacher.service";
import { formatDateForDatabase } from "./educationUtils";

export type CertificationItem = {
  _id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  certificateType?: string;
  isVerifiable?: boolean;
};

// Group certificate types into categories for better organization
export const CERTIFICATE_CATEGORIES = {
  "Teaching Credentials": [
    "Teaching License",
    "Subject Specialization",
    "Educational Technology",
    "Curriculum Development",
    "Special Education",
    "Leadership/Management",
    "Professional Development",
  ],
  "Language Qualifications": [
    "Language Proficiency",
    "TEFL/TESOL",
    "Language Teaching",
  ],
  "Recognitions": [
    "Teaching Award",
    "Academic Award",
    "Honor/Recognition",
  ],
  "Other": [
    "Online Course",
    "Workshop",
    "Other"
  ]
};

// Flatten the categories for direct access when needed
export const CERTIFICATE_TYPES = Object.values(CERTIFICATE_CATEGORIES).flat();

export const fetchCertifications = async (teacherId: string): Promise<CertificationItem[]> => {
  try {
    if (!teacherId) {
      console.error('Teacher ID is required to fetch certifications');
      return [];
    }

    console.log(`Fetching certifications for teacher: ${teacherId}`);
    const { data, error } = await teacherService.getCertifications(teacherId);

    if (error) {
      console.error('Error fetching certifications:', error);
      return [];
    }

    if (!data || !Array.isArray(data)) {
      console.error('Invalid certification data from API:', data);
      return [];
    }

    return data.map(item => ({
      _id: item._id  || '',
      name: item.name || '',
      issuer: item.issuer || '',
      issueDate: item.issueDate || '',
      expiryDate: item.expiryDate || undefined,
      credentialUrl: item.credentialUrl || undefined,
      description: item.description || undefined,
      certificateType: item.certificateType || 'Other',
      isVerifiable: item.isVerifiable || false
    }));
  } catch (error) {
    console.error('Error in fetchCertifications:', error);
    return [];
  }
};

export const saveCertification = async (
  teacherId: string,
  certification: Partial<CertificationItem>
): Promise<{ success: boolean; _id?: string; error?: string }> => {
  try {
    if (!teacherId) {
      throw new Error('Teacher ID is required');
    }

    console.log("Saving certification:", certification);
    const { data, error } = await teacherService.addCertification(teacherId, {
      ...certification,
      issueDate: certification.issueDate ? formatDateForDatabase(certification.issueDate) : undefined,
      expiryDate: certification.expiryDate ? formatDateForDatabase(certification.expiryDate) : undefined
    });

    if (error) {
      console.error("API error when saving certification:", error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from API');
    }

    console.log("API response for save certification:", data);
    return { success: true, _id: data._id };
  } catch (error: any) {
    console.error('Error saving certification:', error);
    return { success: false, error: error.message || 'Unknown error saving certification' };
  }
};

export const updateCertification = async (
  teacherId: string,
  certification: CertificationItem
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!teacherId || !certification._id) {
      throw new Error('Teacher ID and Certification ID are required');
    }

    console.log("Updating certification:", certification);
    const { data, error } = await teacherService.updateCertification(teacherId, {
      ...certification,
      issueDate: certification.issueDate ? formatDateForDatabase(certification.issueDate) : undefined,
      expiryDate: certification.expiryDate ? formatDateForDatabase(certification.expiryDate) : undefined
    });

    if (error) {
      console.error("API error when updating certification:", error);
      throw error;
    }

    console.log("API response for update certification:", data);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating certification:', error);
    return { success: false, error: error.message || 'Unknown error updating certification' };
  }
};

export const deleteCertification = async (
  teacherId: string,
  certificationId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!teacherId || !certificationId) {
      throw new Error('Teacher ID and Certification ID are required');
    }

    console.log(`Deleting certification with ID ${certificationId} for teacher ${teacherId}`);
    const { data, error } = await teacherService.deleteCertification(teacherId, certificationId);

    if (error) {
      console.error("API error when deleting certification:", error);
      throw error;
    }

    console.log("API response for delete certification:", data);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting certification:', error);
    return { success: false, error: error.message || 'Unknown error deleting certification' };
  }
};