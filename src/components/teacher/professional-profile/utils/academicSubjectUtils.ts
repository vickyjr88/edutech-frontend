
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type AcademicSubjectItem = {
  id: string;
  curriculum: string;
  subject: string;
  grade: string;
  proficiencyLevel: string;
  description?: string;
  isCertified: boolean;
};

export const useAcademicSubjects = (userId: string | undefined) => {
  const { toast } = useToast();

  const fetchAcademicSubjects = async (): Promise<AcademicSubjectItem[]> => {
    if (!userId) return [];

    try {
      const { data, error } = await supabase
        .from('teacher_academic_subjects')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        curriculum: item.curriculum,
        subject: item.subject,
        grade: item.grade,
        proficiencyLevel: item.proficiency_level,
        description: item.description || '',
        isCertified: item.is_certified || false
      }));
    } catch (error) {
      console.error("Error fetching academic subjects:", error);
      toast({
        title: "Error",
        description: "Failed to load academic subjects",
        variant: "destructive"
      });
      return [];
    }
  };

  const addAcademicSubject = async (subject: Omit<AcademicSubjectItem, 'id'>): Promise<string | null> => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('teacher_academic_subjects')
        .insert({
          user_id: userId,
          curriculum: subject.curriculum,
          subject: subject.subject,
          grade: subject.grade,
          proficiency_level: subject.proficiencyLevel,
          description: subject.description,
          is_certified: subject.isCertified
        })
        .select('id')
        .single();

      if (error) throw error;

      toast({
        title: "Subject Added",
        description: "Academic subject has been added successfully"
      });

      return data.id;
    } catch (error) {
      console.error("Error adding academic subject:", error);
      toast({
        title: "Error",
        description: "Failed to add academic subject",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateAcademicSubject = async (subject: AcademicSubjectItem): Promise<boolean> => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('teacher_academic_subjects')
        .update({
          curriculum: subject.curriculum,
          subject: subject.subject,
          grade: subject.grade,
          proficiency_level: subject.proficiencyLevel,
          description: subject.description,
          is_certified: subject.isCertified
        })
        .eq('id', subject.id)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Subject Updated",
        description: "Academic subject has been updated successfully"
      });

      return true;
    } catch (error) {
      console.error("Error updating academic subject:", error);
      toast({
        title: "Error",
        description: "Failed to update academic subject",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteAcademicSubject = async (id: string): Promise<boolean> => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('teacher_academic_subjects')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Subject Deleted",
        description: "Academic subject has been deleted successfully"
      });

      return true;
    } catch (error) {
      console.error("Error deleting academic subject:", error);
      toast({
        title: "Error",
        description: "Failed to delete academic subject",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    fetchAcademicSubjects,
    addAcademicSubject,
    updateAcademicSubject,
    deleteAcademicSubject
  };
};
