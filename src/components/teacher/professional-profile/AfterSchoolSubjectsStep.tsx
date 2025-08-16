
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
  } = useAfterSchoolSubjects(user?.id,user.id);
  
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
        console.log("Fetching after-school subjects for teacher:", user.id);
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
        <CardHeader className="pb-3">
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
            <div className="grid gap-4">
              {subjects.map(subject => (
                <div 
                  key={subject._id} 
                  className="border rounded-lg bg-white shadow-sm overflow-hidden hover:shadow-md hover:border-purple-300 transition-all cursor-pointer relative"
                  onClick={() => {
                    handleEdit(subject);
                    // Scroll form into view
                    const formCard = document.getElementById('add-afterschool-subject-form');
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
                          const formCard = document.getElementById('add-afterschool-subject-form');
                          if (formCard) {
                            setTimeout(() => {
                              formCard.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }
                        }}
                      >
                        <Edit className="h-4 w-4 text-purple-600" />
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
                    <div className="bg-purple-50 p-3 border-b">
                      <h3 className="font-medium text-purple-800 text-lg">{subject.subject}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <span className="px-2 py-0.5 bg-purple-100 rounded-full text-xs font-medium text-purple-700">
                          Age: {subject.ageRange}
                        </span>
                        {subject.isCertified && (
                          <span className="px-2 py-0.5 bg-green-100 rounded-full text-xs font-medium text-green-700">
                            Certified
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Content section */}
                    <div className="p-3">
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {subject.gender && subject.gender !== "All" && (
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-1">Gender Focus</h4>
                            <p className="text-sm">{subject.gender}</p>
                          </div>
                        )}
                        
                        {subject.religion && subject.religion !== "All" && (
                          <div>
                            <h4 className="text-xs font-medium text-gray-500 mb-1">Religious Context</h4>
                            <p className="text-sm">{subject.religion}</p>
                          </div>
                        )}
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
                                className="text-purple-600 hover:underline text-xs px-2 py-1 bg-purple-50 rounded-md flex items-center"
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
      
      <Card id="add-afterschool-subject-form">
        <CardHeader className={isEditing ? "bg-purple-50 border-b" : ""}>
          <CardTitle className="text-lg flex items-center">
            {isEditing ? (
              <>
                <span className="text-purple-800">Edit Subject: {currentSubject.subject}</span>
                <span className="ml-2 px-2 py-0.5 bg-purple-100 rounded text-xs font-medium text-purple-700">
                  {currentSubject.ageRange}
                </span>
              </>
            ) : (
              "Add After-School Subject"
            )}
          </CardTitle>
          {isEditing && (
            <CardDescription className="mt-1">
              Update the details of this after-school subject
            </CardDescription>
          )}
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

export default AfterSchoolSubjectsStep;
