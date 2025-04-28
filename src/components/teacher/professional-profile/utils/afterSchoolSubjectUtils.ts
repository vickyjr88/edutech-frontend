
import { useToast } from "@/hooks/use-toast";
import {teacherService} from "@/integrations/api/services/teacher.service.ts";

export type AfterSchoolSubjectItem = {
  _id: string;
  subject: string;
  ageRange: string;
  gender?: string;
  religion?: string;
  description?: string;
  isCertified: boolean;
  resources?: string[]; // URLs to resources related to this subject
};

export const useAfterSchoolSubjects = (userId: string | undefined, teacherId: string) => {
  const { toast } = useToast();

  const fetchAfterSchoolSubjects = async (): Promise<AfterSchoolSubjectItem[]> => {
    if (!userId || !teacherId) return [];

    try {
      console.log("Fetching after-school subjects for teacher:", teacherId);
      // Get after-school subjects (with isAcademic=false) for this teacher
      const { data, error } = await teacherService.getTeacherAfterSchoolSubjects(teacherId);

      if (error) {
        console.error("API error:", error);
        throw error;
      }
      
      console.log("After school subjects response:", data);
      
      // Transform the data to match the expected format
      if (Array.isArray(data)) {
        // Filter to make sure we only get non-academic subjects
        const afterSchoolSubjects = data.filter(item => 
          item.isAcademic === false || item.is_academic === false
        );
        
        console.log("Filtered after-school subjects:", afterSchoolSubjects);
        
        return afterSchoolSubjects.map(item => {
          const mappedItem = {
            _id: item._id || item.id,
            subject: item.subject,
            ageRange: item.ageRange || item.age_range || "",
            gender: item.gender || "",
            religion: item.religion || "",
            description: item.description || "",
            isCertified: item.isCertified || item.is_certified || false,
            resources: item.resources || item.resourceUrls || []
          };
          console.log("Mapped item:", mappedItem);
          return mappedItem;
        });
      } else {
        console.error("Invalid data format from API:", data);
        return [];
      }
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

  const addAfterSchoolSubject = async (subject: Omit<AfterSchoolSubjectItem, '_id'>): Promise<string | null> => {
    if (!userId || !teacherId) return null;

    try {
      console.log("Adding after-school subject:", subject);
      
      // Explicitly set isAcademic=false
      const subjectWithFlag = {
        ...subject,
        isAcademic: false
      };
      
      const { data, error } = await teacherService.addOutOfSchoolSubject(teacherId, subjectWithFlag);
      if (error) throw error;

      console.log("Add after-school subject response:", data);
      
      toast({
        title: "Subject Added",
        description: "After-school subject has been added successfully"
      });

      // Return id from response
      return data.id || data._id;
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
    if (!userId || !teacherId) return false;

    try {
      console.log("Updating after-school subject:", subject);
      
      // Explicitly set isAcademic=false
      const subjectWithFlag = {
        ...subject,
        isAcademic: false
      };
      
      console.log("Calling API with teacherId:", teacherId);
      console.log("Subject data being sent:", subjectWithFlag);
      
      const { data, error } = await teacherService.updateOutOfSchoolSubject(teacherId, subjectWithFlag);
      console.log("API response data:", data);
      
      if (error) {
        console.error("API returned error:", error);
        throw error;
      }

      console.log("Subject successfully updated");
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

  const deleteAfterSchoolSubject = async (_id: string): Promise<boolean> => {
    if (!userId || !teacherId) return false;

    try {
      console.log("Deleting after-school subject with ID:", _id);
      
      const { error } = await teacherService.deleteOutOfSchoolSubject(teacherId, _id);

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
