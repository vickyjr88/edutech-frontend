
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
  } = useAcademicSubjects(user?.teacherId);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<AcademicSubjectItem>({
    _id: "",
    curriculum: "",
    subject: "",
    gradeLevel: "",
    proficiencyLevel: "",
    description: "",
    isCertified: false
  });

  useEffect(() => {
    loadSubjects();
  }, [user]);

  const loadSubjects = async () => {
    setIsLoading(true);
    try {
      if (user?.teacherId) {
        console.log("Fetching academic subjects for teacher:", user.teacherId);
        const data = await fetchAcademicSubjects();
        console.log("Received subjects:", data);
        
        if (Array.isArray(data)) {
          setSubjects(data);
        } else {
          console.error("Failed to fetch subjects: invalid data format", data);
          setSubjects([]);
        }
      } else {
        console.error("Cannot load subjects - missing teacher ID");
      }
    } catch (error) {
      console.error("Error loading subjects:", error);
      toast({
        title: "Error",
        description: "Failed to load academic subjects",
        variant: "destructive"
      });
      setSubjects([]);
    } finally {
      setIsLoading(false);
    }
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
      _id: "",
      curriculum: "",
      subject: "",
      gradeLevel: "",
      proficiencyLevel: "",
      description: "",
      isCertified: false
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentSubject.curriculum || !currentSubject.subject || !currentSubject.gradeLevel || !currentSubject.proficiencyLevel) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (isEditing) {
        console.log("Updating subject:", currentSubject);
        const success = await updateAcademicSubject(currentSubject);
        if (success) {
          await loadSubjects();
          resetForm();
          if (onSubjectsChange) onSubjectsChange();
          toast({
            title: "Success",
            description: "Subject updated successfully"
          });
        }
      } else {
        console.log("Adding new subject:", currentSubject);
        const { _id, ...newSubject } = currentSubject;
        const newId = await addAcademicSubject(newSubject);
        if (newId) {
          toast({
            title: "Success",
            description: "New subject added successfully"
          });
          
          // Force reload subjects with a slight delay to ensure API consistency
          setTimeout(async () => {
            await loadSubjects();
            resetForm();
            if (onSubjectsChange) onSubjectsChange();
          }, 500);
        }
      }
    } catch (error) {
      console.error("Error saving academic subject:", error);
      toast({
        title: "Error",
        description: "Failed to save subject. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (subject: AcademicSubjectItem) => {
    setCurrentSubject(subject);
    setIsEditing(true);
  };

  const handleDelete = async (_id: string) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      const success = await deleteAcademicSubject(_id);
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
          <CardTitle className="text-lg">My Academic Subjects</CardTitle>
          <CardDescription>
            Subjects you are qualified to teach in academic settings
          </CardDescription>
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
                  <TableRow key={subject._id}>
                    <TableCell className="font-medium">{subject.subject}</TableCell>
                    <TableCell>{subject.curriculum}</TableCell>
                    <TableCell>{subject.gradeLevel}</TableCell>
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
                          onClick={() => handleDelete(subject._id)}
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
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{isEditing ? "Edit Academic Subject" : "Add Academic Subject"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="curriculum">Curriculum</Label>
                <select
                  id="curriculum"
                  name="curriculum"
                  value={currentSubject.curriculum}
                  onChange={handleInputChange as any}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Curriculum</option>
                  <option value="CBSE">CBSE (Central Board of Secondary Education)</option>
                  <option value="IGCSE">IGCSE (International General Certificate of Secondary Education)</option>
                  <option value="IB">IB (International Baccalaureate)</option>
                  <option value="Cambridge">Cambridge International</option>
                  <option value="American">American Curriculum</option>
                  <option value="British">British Curriculum</option>
                  <option value="Australian">Australian Curriculum</option>
                  <option value="Canadian">Canadian Curriculum</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <select
                  id="subject"
                  name="subject"
                  value={currentSubject.subject}
                  onChange={handleInputChange as any}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="English">English</option>
                  <option value="Literature">Literature</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                  <option value="Economics">Economics</option>
                  <option value="Business Studies">Business Studies</option>
                  <option value="Accounting">Accounting</option>
                  <option value="Art">Art</option>
                  <option value="Music">Music</option>
                  <option value="Physical Education">Physical Education</option>
                  <option value="Foreign Language">Foreign Language</option>
                  <option value="Social Studies">Social Studies</option>
                  <option value="Religious Studies">Religious Studies</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gradeLevel">Grade Level</Label>
                <select
                  id="gradeLevel"
                  name="gradeLevel"
                  value={currentSubject.gradeLevel}
                  onChange={handleInputChange as any}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Grade Level</option>
                  <option value="K-2">Early Elementary (K-2)</option>
                  <option value="3-5">Late Elementary (3-5)</option>
                  <option value="6-8">Middle School (6-8)</option>
                  <option value="9-12">High School (9-12)</option>
                  <option value="College">College/University</option>
                  <option value="Adult">Adult Education</option>
                  <option value="All Levels">All Levels</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="proficiencyLevel">Proficiency Level</Label>
                <select
                  id="proficiencyLevel"
                  name="proficiencyLevel"
                  value={currentSubject.proficiencyLevel}
                  onChange={handleInputChange as any}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Proficiency Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                  <option value="Master">Master</option>
                </select>
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
    </div>
  );
};

export default AcademicSubjectsStep;
