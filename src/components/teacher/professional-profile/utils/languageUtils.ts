
import {teacherService} from "@/integrations/api/services/teacher.service.ts";
export type LanguageItem = {
  _id?: string;
  name?: string;
  description?: string;
  language?: string;
  proficiency?: string;
  isCertified?: boolean;
};

// Predefined list of languages (East, West, and South African + International)
export const AFRICAN_LANGUAGES = [
  // East Africa
  "Swahili",
  "Amharic",
  "Somali",
  "Tigrinya",
  "Oromo",
  // West Africa
  "Yoruba",
  "Igbo",
  "Hausa",
  "Akan",
  "Wolof",
  // South Africa
  "Zulu",
  "Xhosa",
  "Afrikaans",
  "Sotho",
  "Tswana",
  "Ndebele",
  "Shona",
  "Tsonga",
  "Venda",
  "Swati"
];

export const INTERNATIONAL_LANGUAGES = [
  "English",
  "French",
  "Arabic",
  "Portuguese",
  "Spanish",
  "German",
  "Mandarin",
  "Hindi",
  "Russian",
  "Japanese"
];

export const ALL_LANGUAGES = [...AFRICAN_LANGUAGES, ...INTERNATIONAL_LANGUAGES];

export const fetchLanguages = async (teacherId): Promise<LanguageItem[]> => {
  try {
    //fetch from teacher.service getLanguageExpertise
    const {data, error} =  await teacherService.getLanguageExpertise(teacherId);
    if (error) {
      console.error('Error fetching languages:', error);
      return [];
    }
    return data.map(item => ({
      _id: item['_id'],
      name: item.name,
      description: item.description || undefined,
      isCertified: item.isCertified || false,
      language:item.language || undefined
    }));
  } catch (error) {
    console.error('Error in fetchLanguages:', error);
    return [];
  }
};

export const saveLanguage = async (
  teacherId: string,
  language: LanguageItem
): Promise<{ success: boolean; _id?: string; error?: string }> => {
  try {
    //add language expertise
    const {data, error } = await teacherService.addLanguageExpertise(teacherId,language)
    if (error) {
      throw error;
    }

    return { success: true, _id: data._id || data.id };
  } catch (error: any) {
    console.error('Error saving language:', error);
    return { success: false, error: error.message };
  }
};

export const updateLanguage = async (
    teacherId: string,
    language: LanguageItem
): Promise<{ success: boolean; error?: string }> => {
  try {
    //update language expertise
    const { error } = await teacherService.updateLanguageExpertise(teacherId,language)
    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error updating language:', error);
    return { success: false, error: error.message };
  }
};

export const deleteLanguage = async (
    teacherId: string,
    languageId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    //delete language expertise

   const {error} = await teacherService.deleteLanguageExpertise(teacherId,languageId)
    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting language:', error);
    return { success: false, error: error.message };
  }
};
