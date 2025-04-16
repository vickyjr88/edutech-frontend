
import { supabase } from "@/integrations/api/client.ts";
import { useToast } from "@/hooks/use-toast";

export type AfterSchoolSubjectItem = {
  id: string;
  subject: string;
  ageRange: string;
  gender?: string;
  religion?: string;
  description?: string;
  isCertified: boolean;
};

export const useAfterSchoolSubjects = (userId: string | undefined) => {
  const { toast } = useToast();

  const fetchAfterSchoolSubjects = async (): Promise<AfterSchoolSubjectItem[]> => {
    if (!userId) return [];

    try {
      const { data, error } = await supabase
        .from('teacher_afterschool_subjects')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      return data.map(item => ({
        id: item.id,
        subject: item.subject,
        ageRange: item.age_range,
        gender: item.gender || '',
        religion: item.religion || '',
        description: item.description || '',
        isCertified: item.is_certified || false
      }));
    } catch (error) {
      console.error("Error fetching after-school subjects:", error);
      toast({
        title: "Error",
        description: "Failed to load after-school subjects",
        variant: "destructive"
      });
      return [];
    }
  };

  const addAfterSchoolSubject = async (subject: Omit<AfterSchoolSubjectItem, 'id'>): Promise<string | null> => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('teacher_afterschool_subjects')
        .insert({
          user_id: userId,
          subject: subject.subject,
          age_range: subject.ageRange,
          gender: subject.gender,
          religion: subject.religion,
          description: subject.description,
          is_certified: subject.isCertified
        })
        .select('id')
        .single();

      if (error) throw error;

      toast({
        title: "Subject Added",
        description: "After-school subject has been added successfully"
      });

      return data.id;
    } catch (error) {
      console.error("Error adding after-school subject:", error);
      toast({
        title: "Error",
        description: "Failed to add after-school subject",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateAfterSchoolSubject = async (subject: AfterSchoolSubjectItem): Promise<boolean> => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('teacher_afterschool_subjects')
        .update({
          subject: subject.subject,
          age_range: subject.ageRange,
          gender: subject.gender,
          religion: subject.religion,
          description: subject.description,
          is_certified: subject.isCertified
        })
        .eq('id', subject.id)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Subject Updated",
        description: "After-school subject has been updated successfully"
      });

      return true;
    } catch (error) {
      console.error("Error updating after-school subject:", error);
      toast({
        title: "Error",
        description: "Failed to update after-school subject",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteAfterSchoolSubject = async (id: string): Promise<boolean> => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from('teacher_afterschool_subjects')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Subject Deleted",
        description: "After-school subject has been deleted successfully"
      });

      return true;
    } catch (error) {
      console.error("Error deleting after-school subject:", error);
      toast({
        title: "Error",
        description: "Failed to delete after-school subject",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    fetchAfterSchoolSubjects,
    addAfterSchoolSubject,
    updateAfterSchoolSubject,
    deleteAfterSchoolSubject
  };
};
