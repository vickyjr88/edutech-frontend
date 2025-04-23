
import { useToast } from "@/hooks/use-toast";
import {teacherService} from "@/integrations/api/services/teacher.service.ts";

export type AcademicSubjectItem = {
  id: string;
  curriculum: string;
  subject: string;
  grade: string;
  proficiencyLevel: string;
  description?: string;
  isCertified: boolean;
};

export const useAcademicSubjects = (teacherId: string) => {
  const { toast } = useToast();

  const fetchAcademicSubjects = async (): Promise<AcademicSubjectItem[]> => {

    try {
      // Get all academic subjects for this teacher
      const { data, error } = await teacherService.getTeacherAcademicSubjects(teacherId);

      if (error) throw error;
      // Transform the data to match your expected format
      return data.map(item => ({
        id: item.id,
        curriculum: item.curriculum,
        subject: item.subject,
        grade: item.grade,
        proficiencyLevel: item.proficiencyLevel || item.proficiency_level,
        description: item.description || '',
        isCertified: item.isCertified || item.is_certified || false
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
    if (!teacherId) return null;
    try {

      const { data, error } = await teacherService.addAcademicSubject(teacherId,subject);
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
    try {
      const { error } = await teacherService.updateAcademicSubject(teacherId,subject);
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
    if (!teacherId) return false;
    try {
      const { error } = await teacherService.deleteAcademicSubject(teacherId,id);
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
