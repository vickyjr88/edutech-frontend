
import { supabase } from "@/integrations/supabase/client";

export type LanguageItem = {
  id: string;
  language: string;
  description?: string;
  isCertified: boolean;
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

export const fetchLanguages = async (userId: string): Promise<LanguageItem[]> => {
  try {
    const { data, error } = await supabase
      .from('teacher_languages')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching languages:', error);
      return [];
    }

    return data.map(item => ({
      id: item.id,
      language: item.language,
      description: item.description || undefined,
      isCertified: item.is_certified || false
    }));
  } catch (error) {
    console.error('Error in fetchLanguages:', error);
    return [];
  }
};

export const saveLanguage = async (
  userId: string,
  language: LanguageItem
): Promise<{ success: boolean; id?: string; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('teacher_languages')
      .insert({
        user_id: userId,
        language: language.language,
        description: language.description || null,
        is_certified: language.isCertified
      })
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return { success: true, id: data.id };
  } catch (error: any) {
    console.error('Error saving language:', error);
    return { success: false, error: error.message };
  }
};

export const updateLanguage = async (
  language: LanguageItem
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('teacher_languages')
      .update({
        language: language.language,
        description: language.description || null,
        is_certified: language.isCertified
      })
      .eq('id', language.id);

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
  languageId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('teacher_languages')
      .delete()
      .eq('id', languageId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting language:', error);
    return { success: false, error: error.message };
  }
};
