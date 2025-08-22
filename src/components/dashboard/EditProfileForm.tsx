import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateStudentProfile } from "@/hooks/use-student-service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface EditProfileFormProps {
  profile: any;
  onClose: () => void;
}

export const EditProfileForm = ({ profile, onClose }: EditProfileFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    grade: profile?.grade || "",
    school: profile?.school || "",
    interests: profile?.interests || [],
    aboutMe: profile?.aboutMe || "",
  });

  const updateProfileMutation = useUpdateStudentProfile(user.studentId || user.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "interests" ? value.split(",").map((i: string) => i.trim()) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfileMutation.mutateAsync(formData);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="grade">Grade</Label>
        <Input
          id="grade"
          name="grade"
          type="number"
          value={formData.grade}
          onChange={handleChange}
          placeholder="Enter your grade"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="school">School</Label>
        <Input
          id="school"
          name="school"
          value={formData.school}
          onChange={handleChange}
          placeholder="Enter your school name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests">Interests (comma-separated)</Label>
        <Input
          id="interests"
          name="interests"
          value={formData.interests.join(",")}
          onChange={handleChange}
          placeholder="Math, Science, Reading"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="aboutMe">About Me</Label>
        <textarea
          id="aboutMe"
          name="aboutMe"
          value={formData.aboutMe}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tell us about yourself..."
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={updateProfileMutation.isPending}>
          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};
