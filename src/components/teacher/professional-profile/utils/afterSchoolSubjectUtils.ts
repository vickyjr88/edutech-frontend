
import { useToast } from "@/hooks/use-toast";
import {teacherService} from "@/integrations/api/services/teacher.service.ts";

export type AfterSchoolSubjectItem = {
  id: string;
  subject: string;
  ageRange: string;
  gender?: string;
  religion?: string;
  description?: string;
  isCertified: boolean;
};

export const useAfterSchoolSubjects = (userId: string | undefined, teacherId: string) => {
  const { toast } = useToast();

  const fetchAfterSchoolSubjects = async (): Promise<AfterSchoolSubjectItem[]> => {
    if (!userId) return [];

    try {
      // Get all academic subjects for this teacher
      const { data, error } = await teacherService.getTeacherAcademicSubjects(teacherId);

      if (error) throw error;
      // Transform the data to match your expected format
      return data
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
      const { data, error } = await teacherService.addOutOfSchoolSubject(teacherId,subject);
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
      const { error } = await teacherService.updateOutOfSchoolSubject(teacherId,subject)

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
      const { error } = await teacherService.deleteOutOfSchoolSubject(id)

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
