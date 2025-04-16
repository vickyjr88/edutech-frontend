
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Edit, Trash2, Plus } from "lucide-react";
import { useAcademicSubjects, AcademicSubjectItem } from "./utils/academicSubjectUtils";

type AcademicSubjectsStepProps = {
  subjects: AcademicSubjectItem[];
  setSubjects: React.Dispatch<React.SetStateAction<AcademicSubjectItem[]>>;
  onSubjectsChange?: () => void;
};

const AcademicSubjectsStep = ({ subjects, setSubjects, onSubjectsChange }: AcademicSubjectsStepProps) => {
  const { user } = useAuth();
  const { 
    fetchAcademicSubjects, 
    addAcademicSubject, 
    updateAcademicSubject, 
    deleteAcademicSubject 
  } = useAcademicSubjects(user?.id);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<AcademicSubjectItem>({
    id: "",
    curriculum: "",
    subject: "",
    grade: "",
    proficiencyLevel: "",
    description: "",
    isCertified: false
  });

  useEffect(() => {
    loadSubjects();
  }, [user]);

  const loadSubjects = async () => {
    setIsLoading(true);
    if (user) {
      const data = await fetchAcademicSubjects();
      setSubjects(data);
    }
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentSubject(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setCurrentSubject(prev => ({ ...prev, isCertified: checked }));
  };

  const resetForm = () => {
    setCurrentSubject({
      id: "",
      curriculum: "",
      subject: "",
      grade: "",
      proficiencyLevel: "",
      description: "",
      isCertified: false
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentSubject.curriculum || !currentSubject.subject || !currentSubject.grade || !currentSubject.proficiencyLevel) {
      return;
    }

    try {
      if (isEditing) {
        const success = await updateAcademicSubject(currentSubject);
        if (success) {
          loadSubjects();
          resetForm();
          if (onSubjectsChange) onSubjectsChange();
        }
      } else {
         
        const { id, ...newSubject } = currentSubject;
        const newId = await addAcademicSubject(newSubject);
        if (newId) {
          loadSubjects();
          resetForm();
          if (onSubjectsChange) onSubjectsChange();
        }
      }
    } catch (error) {
      console.error("Error saving academic subject:", error);
    }
  };

  const handleEdit = (subject: AcademicSubjectItem) => {
    setCurrentSubject(subject);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      const success = await deleteAcademicSubject(id);
      if (success) {
        loadSubjects();
        if (onSubjectsChange) onSubjectsChange();
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Academic Subject</CardTitle>
          <CardDescription>
            Add subjects you are qualified to teach in academic settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="curriculum">Curriculum</Label>
                <Input
                  id="curriculum"
                  name="curriculum"
                  value={currentSubject.curriculum}
                  onChange={handleInputChange}
                  placeholder="e.g., CBSE, IGCSE, IB"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={currentSubject.subject}
                  onChange={handleInputChange}
                  placeholder="e.g., Mathematics, Science"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="grade">Grade Level</Label>
                <Input
                  id="grade"
                  name="grade"
                  value={currentSubject.grade}
                  onChange={handleInputChange}
                  placeholder="e.g., K-5, 6-8, 9-12"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="proficiencyLevel">Proficiency Level</Label>
                <Input
                  id="proficiencyLevel"
                  name="proficiencyLevel"
                  value={currentSubject.proficiencyLevel}
                  onChange={handleInputChange}
                  placeholder="e.g., Beginner, Intermediate, Advanced"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Why you love teaching this subject)</Label>
              <Textarea
                id="description"
                name="description"
                value={currentSubject.description}
                onChange={handleInputChange}
                placeholder="Describe why you enjoy teaching this subject and your approach"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isCertified"
                checked={currentSubject.isCertified}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isCertified">I am certified to teach this subject</Label>
            </div>
            
            <div className="flex justify-end space-x-2">
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
              <Button type="submit">
                {isEditing ? "Update Subject" : "Add Subject"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">My Academic Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-4">Loading subjects...</p>
          ) : subjects.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              You haven't added any academic subjects yet.
            </p>
          ) : (
            <Table>
              <TableCaption>Your academic teaching subjects</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Curriculum</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Proficiency</TableHead>
                  <TableHead>Certified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map(subject => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.subject}</TableCell>
                    <TableCell>{subject.curriculum}</TableCell>
                    <TableCell>{subject.grade}</TableCell>
                    <TableCell>{subject.proficiencyLevel}</TableCell>
                    <TableCell>{subject.isCertified ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(subject)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(subject.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {subjects.length > 0 && (
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={resetForm}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Subject
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AcademicSubjectsStep;
