
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
import { useAfterSchoolSubjects, AfterSchoolSubjectItem } from "./utils/afterSchoolSubjectUtils";

type AfterSchoolSubjectsStepProps = {
  subjects: AfterSchoolSubjectItem[];
  setSubjects: React.Dispatch<React.SetStateAction<AfterSchoolSubjectItem[]>>;
  onSubjectsChange?: () => void;
};

const AfterSchoolSubjectsStep = ({ subjects, setSubjects, onSubjectsChange }: AfterSchoolSubjectsStepProps) => {
  const { user } = useAuth();
  const { 
    fetchAfterSchoolSubjects, 
    addAfterSchoolSubject, 
    updateAfterSchoolSubject, 
    deleteAfterSchoolSubject 
  } = useAfterSchoolSubjects(user?.id,user.teacherId);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<AfterSchoolSubjectItem>({
    id: "",
    subject: "",
    ageRange: "",
    gender: "",
    religion: "",
    description: "",
    isCertified: false,
  });

  useEffect(() => {
    loadSubjects();
  }, [user]);

  const loadSubjects = async () => {
    setIsLoading(true);
    try {
      if (user?.teacherId) {
        console.log("Fetching after-school subjects for teacher:", user.teacherId);
        const data = await fetchAfterSchoolSubjects();
        console.log("Received after-school subjects:", data);
        
        if (Array.isArray(data)) {
          setSubjects(data);
        } else {
          console.error("Failed to fetch after-school subjects: invalid data format", data);
          setSubjects([]);
        }
      } else {
        console.error("Cannot load after-school subjects - missing teacher ID");
      }
    } catch (error) {
      console.error("Error loading after-school subjects:", error);
      toast({
        title: "Error",
        description: "Failed to load after-school subjects",
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
    console.log("Resetting after-school subject form");
    setCurrentSubject({
      id: "",
      subject: "",
      ageRange: "",
      gender: "",
      religion: "",
      description: "",
      isCertified: false
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentSubject.subject || !currentSubject.ageRange) {
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
        console.log("Updating after-school subject:", currentSubject);
        const success = await updateAfterSchoolSubject(currentSubject);
        if (success) {
          toast({
            title: "Success",
            description: "Subject updated successfully"
          });
          
          // Immediately reset form
          resetForm();
          
          // Then reload subjects with small delay
          setTimeout(async () => {
            await loadSubjects();
            if (onSubjectsChange) onSubjectsChange();
          }, 300);
        }
      } else {
        console.log("Adding new after-school subject:", currentSubject);
        const { id, ...newSubject } = currentSubject;
        
        // Explicitly set isAcademic to false
        const afterSchoolSubject = {
          ...newSubject,
          isAcademic: false
        };
        
        const newId = await addAfterSchoolSubject(afterSchoolSubject);
        if (newId) {
          console.log("New after-school subject added with ID:", newId);
          
          toast({
            title: "Success",
            description: "New after-school subject added successfully"
          });
          
          // Immediately reset form first
          resetForm();
          
          // Force reload subjects with a longer delay to ensure API consistency
          setTimeout(async () => {
            console.log("Reloading subjects after add...");
            await loadSubjects();
            if (onSubjectsChange) onSubjectsChange();
            console.log("Subjects reloaded!");
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error saving after-school subject:", error);
      toast({
        title: "Error",
        description: "Failed to save subject. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (subject: AfterSchoolSubjectItem) => {
    setCurrentSubject(subject);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      const success = await deleteAfterSchoolSubject(id);
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
          <CardTitle className="text-lg">My After-School Subjects</CardTitle>
          <CardDescription>
            Subjects you are qualified to teach in after-school programs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-4">Loading subjects...</p>
          ) : subjects.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              You haven't added any after-school subjects yet.
            </p>
          ) : (
            <Table>
              <TableCaption>Your after-school teaching subjects</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Age Range</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Religion</TableHead>
                  <TableHead>Certified</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map(subject => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.subject}</TableCell>
                    <TableCell>{subject.ageRange}</TableCell>
                    <TableCell>{subject.gender || "All"}</TableCell>
                    <TableCell>{subject.religion || "All"}</TableCell>
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
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{isEditing ? "Edit After-School Subject" : "Add After-School Subject"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="">Select After-School Subject</option>
                  <option value="Art">Art & Crafts</option>
                  <option value="Music">Music</option>
                  <option value="Dance">Dance</option>
                  <option value="Drama">Drama & Theatre</option>
                  <option value="Coding">Coding & Programming</option>
                  <option value="Robotics">Robotics</option>
                  <option value="Chess">Chess</option>
                  <option value="Sports">Sports & Athletics</option>
                  <option value="Cooking">Cooking & Baking</option>
                  <option value="Photography">Photography</option>
                  <option value="Creative Writing">Creative Writing</option>
                  <option value="Debate">Debate & Public Speaking</option>
                  <option value="Foreign Language">Foreign Language</option>
                  <option value="Science Experiments">Science Experiments</option>
                  <option value="Gardening">Gardening & Environment</option>
                  <option value="Yoga">Yoga & Mindfulness</option>
                  <option value="Animation">Animation & Video Production</option>
                  <option value="Game Design">Game Design</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ageRange">Age Range</Label>
                <select
                  id="ageRange"
                  name="ageRange"
                  value={currentSubject.ageRange}
                  onChange={handleInputChange as any}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Age Range</option>
                  <option value="3-5">Preschool (3-5)</option>
                  <option value="5-7">Early Elementary (5-7)</option>
                  <option value="8-10">Late Elementary (8-10)</option>
                  <option value="11-13">Middle School (11-13)</option>
                  <option value="14-18">High School (14-18)</option>
                  <option value="All Ages">All Ages</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender (optional)</Label>
                <select
                  id="gender"
                  name="gender"
                  value={currentSubject.gender || ""}
                  onChange={handleInputChange as any}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">All Genders</option>
                  <option value="Boys">Boys Only</option>
                  <option value="Girls">Girls Only</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="religion">Religion (optional)</Label>
                <select
                  id="religion"
                  name="religion"
                  value={currentSubject.religion || ""}
                  onChange={handleInputChange as any}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">All Religions</option>
                  <option value="Christian">Christian</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddhist">Buddhist</option>
                  <option value="Jewish">Jewish</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Other">Other</option>
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

export default AfterSchoolSubjectsStep;
