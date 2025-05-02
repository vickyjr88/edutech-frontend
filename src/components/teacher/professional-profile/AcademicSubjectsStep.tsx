
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
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
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
    isCertified: false,
    resources: []
  });
  
  // State for managing the resources URL input
  const [resourceUrl, setResourceUrl] = useState<string>("");

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
  
  // Function to handle adding resources to the subject
  const handleAddResource = () => {
    if (!resourceUrl.trim()) return;
    
    // Validate if it's a valid URL
    try {
      new URL(resourceUrl);
      
      // Add the URL to resources array
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
  
  // Function to handle removing a resource
  const handleRemoveResource = (urlToRemove: string) => {
    setCurrentSubject(prev => ({
      ...prev,
      resources: (prev.resources || []).filter(url => url !== urlToRemove)
    }));
  };

  const resetForm = () => {
    setCurrentSubject({
      _id: "",
      curriculum: "",
      subject: "",
      gradeLevel: "",
      proficiencyLevel: "",
      description: "",
      isCertified: false,
      resources: []
    });
    setResourceUrl(""); // Clear resource URL input
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
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">My Academic Subjects</CardTitle>
              <CardDescription>
                Subjects you are qualified to teach in academic settings
              </CardDescription>
            </div>
            <Button 
              onClick={() => {
                const formCard = document.getElementById('add-subject-form');
                if (formCard) {
                  formCard.scrollIntoView({ behavior: 'smooth' });
                  // Focus on the first select element
                  const firstSelect = formCard.querySelector('select');
                  if (firstSelect) {
                    firstSelect.focus();
                  }
                }
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" /> Add New Subject
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center py-4">Loading subjects...</p>
          ) : subjects.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              You haven't added any academic subjects yet.
            </p>
          ) : (
            <div className="grid gap-4">
              {subjects.map(subject => (
                <div 
                  key={subject._id} 
                  className="border rounded-lg bg-white shadow-sm overflow-hidden hover:shadow-md hover:border-blue-300 transition-all cursor-pointer relative"
                  onClick={() => {
                    handleEdit(subject);
                    // Scroll form into view
                    const formCard = document.getElementById('add-subject-form');
                    if (formCard) {
                      setTimeout(() => {
                        formCard.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                  }}
                >
                  <div className="relative">
                    {/* Action buttons positioned absolutely in the top-right of each card */}
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 bg-white hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(subject);
                          // Scroll form into view
                          const formCard = document.getElementById('add-subject-form');
                          if (formCard) {
                            setTimeout(() => {
                              formCard.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }
                        }}
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 bg-white hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(subject._id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    
                    {/* Subject header with background color */}
                    <div className="bg-blue-50 p-3 border-b">
                      <h3 className="font-medium text-blue-800 text-lg">{subject.subject}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-blue-700">{subject.curriculum}</span>
                        <span className="px-2 py-0.5 bg-blue-100 rounded-full text-xs font-medium text-blue-700">
                          {subject.gradeLevel}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content section */}
                    <div className="p-3">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 mb-1">Proficiency</h4>
                          <p className="text-sm">{subject.proficiencyLevel}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 mb-1">Certification</h4>
                          <p className="text-sm">{subject.isCertified ? 
                            <span className="text-green-600 font-medium">Certified</span> : 
                            <span className="text-gray-500">Not certified</span>}
                          </p>
                        </div>
                      </div>
                      
                      {/* Description if available */}
                      {subject.description && (
                        <div className="mb-3">
                          <h4 className="text-xs font-medium text-gray-500 mb-1">Description</h4>
                          <p className="text-sm text-gray-700">{subject.description}</p>
                        </div>
                      )}
                      
                      {/* Resources */}
                      {subject.resources && subject.resources.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-gray-500 mb-1">Resources</h4>
                          <div className="flex flex-wrap gap-2">
                            {subject.resources.map((url, index) => (
                              <a 
                                key={index}
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-xs px-2 py-1 bg-blue-50 rounded-md flex items-center"
                              >
                                <span className="mr-1">Resource {index + 1}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card id="add-subject-form">
        <CardHeader className={isEditing ? "bg-blue-50 border-b" : ""}>
          <CardTitle className="text-lg flex items-center">
            {isEditing ? (
              <>
                <span className="text-blue-800">Edit Subject: {currentSubject.subject}</span>
                <span className="ml-2 px-2 py-0.5 bg-blue-100 rounded text-xs font-medium text-blue-700">
                  {currentSubject.gradeLevel}
                </span>
              </>
            ) : (
              "Add Academic Subject"
            )}
          </CardTitle>
          {isEditing && (
            <CardDescription className="mt-1">
              Update the details of this academic subject
            </CardDescription>
          )}
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
            
            {/* Resources Section */}
            <div className="space-y-4">
              <Label>Resources</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Enter resource URL (e.g., https://example.com/resource)"
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddResource}
                  variant="outline"
                >
                  Add Resource
                </Button>
              </div>
              
              {/* Resources List */}
              {currentSubject.resources && currentSubject.resources.length > 0 && (
                <div className="space-y-2 border rounded-md p-3">
                  <Label>Added Resources:</Label>
                  <ul className="space-y-2">
                    {currentSubject.resources.map((url, index) => (
                      <li key={index} className="flex items-center justify-between group border-b pb-1">
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate max-w-[80%]"
                        >
                          {url}
                        </a>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveResource(url)}
                          className="opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
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
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  className="flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
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
