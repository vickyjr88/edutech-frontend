
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
import { Edit, Trash2, Plus, ExternalLink, X } from "lucide-react";
import { useAfterSchoolSubjects, AfterSchoolSubjectItem } from "./utils/afterSchoolSubjectUtils";
import { useToast } from "@/hooks/use-toast";

type AfterSchoolSubjectsStepProps = {
  subjects: AfterSchoolSubjectItem[];
  setSubjects: React.Dispatch<React.SetStateAction<AfterSchoolSubjectItem[]>>;
  onSubjectsChange?: () => void;
};

const AfterSchoolSubjectsStep = ({ subjects, setSubjects, onSubjectsChange }: AfterSchoolSubjectsStepProps) => {
  const { user } = useAuth();
  const {toast} = useToast();
  const { 
    fetchAfterSchoolSubjects, 
    addAfterSchoolSubject, 
    updateAfterSchoolSubject, 
    deleteAfterSchoolSubject 
  } = useAfterSchoolSubjects(user?.id,user.teacherId);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<AfterSchoolSubjectItem>({
    _id: "",
    subject: "",
    ageRange: "",
    gender: "",
    religion: "",
    description: "",
    isCertified: false,
    resources: [],
  });
  
  const [resourceUrl, setResourceUrl] = useState("");

  useEffect(() => {
    loadSubjects();
  }, [user]);

  const loadSubjects = async () => {
    console.log("Starting to load after-school subjects");
    setIsLoading(true);
    try {
      if (user?.teacherId) {
        console.log("Fetching after-school subjects for teacher:", user.teacherId);
        const data = await fetchAfterSchoolSubjects();
        console.log("Received after-school subjects:", data);
        
        if (Array.isArray(data)) {
          // Force UI update with fresh data
          setSubjects([]);
          setTimeout(() => {
            console.log("Setting subjects with fresh data:", data);
            setSubjects(data);
          }, 50);
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
      _id: "",
      subject: "",
      ageRange: "",
      gender: "",
      religion: "",
      description: "",
      isCertified: false,
      resources: []
    });
    setResourceUrl("");
    setIsEditing(false);
  };
  
  const handleAddResource = () => {
    if (!resourceUrl.trim()) return;
    
    // Validate the URL
    try {
      new URL(resourceUrl);
      
      // Add resource to the subject
      setCurrentSubject(prev => ({
        ...prev,
        resources: [...(prev.resources || []), resourceUrl.trim()]
      }));
      
      // Clear the input
      setResourceUrl("");
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL for the resource",
        variant: "destructive"
      });
    }
  };
  
  const handleRemoveResource = (index: number) => {
    setCurrentSubject(prev => ({
      ...prev,
      resources: prev.resources?.filter((_, i) => i !== index) || []
    }));
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
        try {
          const success = await updateAfterSchoolSubject(currentSubject);
          console.log("Update result:", success);
          
          if (success) {
            // Immediately reset form to close it
            resetForm();
            
            toast({
              title: "Success",
              description: "Subject updated successfully"
            });
            
            // Then reload subjects immediately
            console.log("Reloading subjects after update...");
            await loadSubjects();
            console.log("Subjects reloaded after update!");
            if (onSubjectsChange) {
              console.log("Calling onSubjectsChange callback");
              onSubjectsChange();
            } else {
              console.log("No onSubjectsChange callback provided");
            }
          } else {
            console.error("Failed to update subject - API returned false");
          }
        } catch (updateError) {
          console.error("Error in update operation:", updateError);
        }
      } else {
        console.log("Adding new after-school subject:", currentSubject);
        const { _id, ...newSubject } = currentSubject;
        
        // Explicitly set isAcademic to false
        const afterSchoolSubject = {
          ...newSubject,
          isAcademic: false
        };
        
        const newId = await addAfterSchoolSubject(afterSchoolSubject);
        if (newId) {
          console.log("New after-school subject added with ID:", newId);
          
          // Immediately reset form first
          resetForm();
          
          toast({
            title: "Success",
            description: "New after-school subject added successfully"
          });
          
          // Reload subjects immediately
          console.log("Reloading subjects after add...");
          await loadSubjects();
          console.log("Subjects reloaded!");
          
          if (onSubjectsChange) {
            console.log("Calling onSubjectsChange callback");
            onSubjectsChange();
          } else {
            console.log("No onSubjectsChange callback provided");
          }
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

  const handleDelete = async (_id: string) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      const success = await deleteAfterSchoolSubject(_id);
      if (success) {
        await loadSubjects();
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
                  <TableHead>Resources</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map(subject => (
                  <TableRow key={subject._id}>
                    <TableCell className="font-medium">{subject.subject}</TableCell>
                    <TableCell>{subject.ageRange}</TableCell>
                    <TableCell>{subject.gender || "All"}</TableCell>
                    <TableCell>{subject.religion || "All"}</TableCell>
                    <TableCell>{subject.isCertified ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      {subject.resources && subject.resources.length > 0 ? (
                        <div className="flex space-x-1">
                          <span className="text-sm">{subject.resources.length}</span>
                          {subject.resources.slice(0, 2).map((url, index) => (
                            <a 
                              key={index}
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-primary"
                              title={url}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ))}
                          {subject.resources.length > 2 && <span className="text-xs text-muted-foreground">+{subject.resources.length - 2} more</span>}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </TableCell>
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
            
            <div className="space-y-4">
              <Label>Resources</Label>
              <div className="flex gap-2">
                <Input
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                  placeholder="Enter resource URL (e.g. https://example.com)"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddResource}
                  variant="secondary"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              
              {currentSubject.resources && currentSubject.resources.length > 0 && (
                <div className="bg-muted p-3 rounded-md">
                  <h4 className="text-sm font-medium mb-2">Added Resources:</h4>
                  <ul className="space-y-2">
                    {currentSubject.resources.map((url, index) => (
                      <li key={index} className="flex items-center justify-between text-sm bg-background p-2 rounded">
                        <div className="flex items-center">
                          <ExternalLink className="h-3 w-3 mr-2 opacity-70" />
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary truncate max-w-[300px]"
                          >
                            {url}
                          </a>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveResource(index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
