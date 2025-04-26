import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Save, Pencil, Plus, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ExperienceItem, InstitutionType } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { saveExperienceRecord, deleteExperienceRecord, validateExperienceData, formatDateForDatabase } from "./utils/experienceUtils";
import { 
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow
} from "@/components/ui/table";

type ExperienceStepProps = {
  experience: ExperienceItem[];
  setExperience: React.Dispatch<React.SetStateAction<ExperienceItem[]>>;
};

const ExperienceStep = ({ experience, setExperience }: ExperienceStepProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<ExperienceItem>({
    _id: `temp_${Date.now()}`,
    position: "",
    institution: "",
    institutionType: "",
    additionalDetails: "",
    startDate: "",
    endDate: "",
    isCurrentlyWorking: false,
    subjects: [],
    curriculums: [],
    grades: []
  });
  const [newSubject, setNewSubject] = useState("");
  const [newCurriculum, setNewCurriculum] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<{[key: string]: boolean}>({});

  const addItem = () => {
    const newId = `temp_${Date.now()}`;
    setCurrentItem({
      _id: newId,
      position: "",
      institution: "",
      institutionType: "",
      additionalDetails: "",
      startDate: "",
      endDate: "",
      isCurrentlyWorking: false,
      subjects: [],
      curriculums: [],
      grades: []
    });
    setNewSubject("");
    setNewCurriculum("");
    setNewGrade("");
    setEditingId(newId);
  };

  const removeItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) {
      return;
    }
    
    try {
      setIsDeleting(prev => ({ ...prev, [id]: true }));
      
      // Only attempt to delete from DB if it's not a temporary ID
      if (!id.startsWith("temp_")) {
        // Pass the teacherId when removing an experience record
        await deleteExperienceRecord(id, user?.teacherId);
      }
      
      setExperience(experience.filter(item => item._id !== id));
      toast({
        title: "Experience removed",
        description: "Experience entry has been removed successfully",
      });
      
      // If we're removing the item we're currently editing, reset the form
      if (editingId === id) {
        setEditingId(null);
        addItem();
      }
    } catch (error: any) {
      console.error("Error deleting experience:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete experience entry",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(prev => ({ ...prev, [id]: false }));
    }
  };

  const updateCurrentItem = (field: keyof ExperienceItem, value: any) => {
    setCurrentItem(prev => {
      if (field === 'isCurrentlyWorking' && value === true) {
        return { ...prev, [field]: value, endDate: "" };
      }
      return { ...prev, [field]: value };
    });
  };

  const addSubject = () => {
    if (!newSubject.trim()) return;
    
    setCurrentItem(prev => ({
      ...prev,
      subjects: [...prev.subjects, newSubject.trim()]
    }));
    
    setNewSubject("");
  };

  const removeSubject = (subjectToRemove: string) => {
    setCurrentItem(prev => ({
      ...prev,
      subjects: prev.subjects.filter(subject => subject !== subjectToRemove)
    }));
  };

  const addCurriculum = () => {
    if (!newCurriculum.trim()) return;
    
    setCurrentItem(prev => ({
      ...prev,
      curriculums: [...prev.curriculums, newCurriculum.trim()]
    }));
    
    setNewCurriculum("");
  };

  const removeCurriculum = (curriculumToRemove: string) => {
    setCurrentItem(prev => ({
      ...prev,
      curriculums: prev.curriculums.filter(curriculum => curriculum !== curriculumToRemove)
    }));
  };

  const addGrade = () => {
    if (!newGrade.trim()) return;
    
    setCurrentItem(prev => ({
      ...prev,
      grades: [...prev.grades, newGrade.trim()]
    }));
    
    setNewGrade("");
  };

  const removeGrade = (gradeToRemove: string) => {
    setCurrentItem(prev => ({
      ...prev,
      grades: prev.grades.filter(grade => grade !== gradeToRemove)
    }));
  };

  const updateReportingManager = (field: 'name' | 'phone', value: string) => {
    setCurrentItem(prev => ({
      ...prev,
      reportingManager: {
        ...(prev.reportingManager || { name: "", phoneNumber: "" }),
        [field]: value
      }
    }));
  };

  const saveItem = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save experience",
        variant: "destructive"
      });
      return;
    }
    
    const errors = validateExperienceData(
      currentItem.position,
      currentItem.institution,
      currentItem.institutionType,
      currentItem.startDate
    );
    
    if (errors.length > 0) {
      toast({
        title: "Error",
        description: errors.join(", "),
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // No need to convert dates, formatDateForDatabase will handle this now
      const result = await saveExperienceRecord(user.teacherId, currentItem);
      const savedExperience = {
        ...currentItem,
        _id: result[0]?.id || currentItem._id,
        saved: true
      };
      
      if (editingId) {
        // Update existing item
        setExperience(experience.map(item => 
          item._id === editingId ? savedExperience : item
        ));
        toast({
          title: "Experience updated",
          description: "Experience entry has been updated successfully",
        });
      } else {
        // Add new item
        setExperience([...experience, savedExperience]);
        toast({
          title: "Experience added",
          description: "New experience entry has been added successfully",
        });
      }
      
      // Create a new experience form after saving
      const newId = `temp_${Date.now()}`;
      setCurrentItem({
        _id: newId,
        position: "",
        institution: "",
        institutionType: "",
        additionalDetails: "",
        startDate: "",
        endDate: "",
        isCurrentlyWorking: false,
        subjects: [],
        curriculums: [],
        grades: []
      });
      setNewSubject("");
      setNewCurriculum("");
      setNewGrade("");
      setEditingId(null);
    } catch (error: any) {
      console.error("Error saving experience:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save experience entry",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const editItem = (id: string) => {
    const itemToEdit = experience.find(item => item._id === id);
    if (itemToEdit) {
      setEditingId(id);
      setCurrentItem(itemToEdit);
    }
  };
  
  const savedExperiences = experience.filter(item => item.saved);

  const formatDateRange = (startDate: string, endDate: string, currentlyWorking: boolean) => {
    const start = startDate ? new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
    
    if (currentlyWorking) {
      return `${start} - Present`;
    }
    
    const end = endDate ? new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
    return `${start} ${end ? `- ${end}` : ''}`;
  };
  
  return (
    <div className="space-y-6">
      {savedExperiences.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {savedExperiences.map((exp) => (
                <TableRow key={exp._id}>
                  <TableCell className="font-medium">
                    <div>{exp.position}</div>
                    {exp.subjects && exp.subjects.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {exp.subjects.map((subject, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{exp.institution}</div>
                    <div className="text-xs text-gray-500">
                      {exp.institutionType.charAt(0).toUpperCase() + exp.institutionType.slice(1)}
                    </div>
                    {exp.curriculums && exp.curriculums.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {exp.curriculums.map((curriculum, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {curriculum}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {formatDateRange(exp.startDate, exp.endDate, exp.isCurrentlyWorking)}
                  </TableCell>
                  <TableCell>
                    {exp.isCurrentlyWorking ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Current</Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">Past</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => editItem(exp._id)}
                      >
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeItem(exp._id)}
                        disabled={isDeleting[exp._id]}
                      >
                        {isDeleting[exp._id] ? 
                          <Loader2 className="h-4 w-4 text-red-500 animate-spin" /> : 
                          <Trash2 className="h-4 w-4 text-red-500" />
                        }
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {!editingId && savedExperiences.length > 0 ? (
        <Button
          variant="outline"
          className="w-full"
          onClick={addItem}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      ) : !editingId && savedExperiences.length === 0 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={addItem}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Your First Experience
        </Button>
      )}
      
      {editingId && (
        <div className="p-4 border rounded-md bg-white">
          <div className="flex justify-between items-start mb-4">
            <h4 className="font-medium text-sm">
              {editingId ? "Edit Experience" : "Add Experience"}
            </h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="exp-position">Position</Label>
              <Input 
                id="exp-position"
                value={currentItem.position}
                onChange={(e) => updateCurrentItem('position', e.target.value)}
                placeholder="e.g., Mathematics Teacher"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exp-institution">Institution</Label>
                <Input 
                  id="exp-institution"
                  value={currentItem.institution}
                  onChange={(e) => updateCurrentItem('institution', e.target.value)}
                  placeholder="e.g., ABC School"
                />
              </div>
              
              <div>
                <Label htmlFor="exp-institution-type">Institution Type</Label>
                <Select 
                  value={currentItem.institutionType} 
                  onValueChange={(value: InstitutionType | "") => updateCurrentItem('institutionType', value)}
                >
                  <SelectTrigger id="exp-institution-type">
                    <SelectValue placeholder="Select institution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">Primary School</SelectItem>
                    <SelectItem value="secondary">Secondary School</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="vocational">Vocational Training</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="exp-start-date">Start Date</Label>
                <Input 
                  id="exp-start-date"
                  type="month"
                  value={currentItem.startDate && !currentItem.startDate.match(/^\d{4}-\d{2}$/) 
                    ? (() => {
                        const date = new Date(currentItem.startDate);
                        return !isNaN(date.getTime()) 
                          ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` 
                          : ""
                      })() 
                    : currentItem.startDate}
                  onChange={(e) => updateCurrentItem('startDate', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="exp-end-date">End Date</Label>
                <Input 
                  id="exp-end-date"
                  type="month"
                  value={currentItem.endDate && !currentItem.endDate.match(/^\d{4}-\d{2}$/) 
                    ? (() => {
                        const date = new Date(currentItem.endDate);
                        return !isNaN(date.getTime()) 
                          ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` 
                          : ""
                      })() 
                    : currentItem.endDate}
                  onChange={(e) => updateCurrentItem('endDate', e.target.value)}
                  disabled={currentItem.isCurrentlyWorking}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="exp-current" 
                checked={currentItem.isCurrentlyWorking}
                onCheckedChange={(checked) => updateCurrentItem('isCurrentlyWorking', checked === true)}
              />
              <Label 
                htmlFor="exp-current"
                className="text-sm font-normal cursor-pointer"
              >
                I currently work here
              </Label>
            </div>
            
            <div>
              <Label>Curriculums</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {currentItem.curriculums && currentItem.curriculums.map((curriculum, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {curriculum}
                    <button 
                      type="button" 
                      onClick={() => removeCurriculum(curriculum)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newCurriculum}
                  onChange={(e) => setNewCurriculum(e.target.value)}
                  placeholder="e.g., National Curriculum, IB, Cambridge"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCurriculum();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={addCurriculum}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Grades/Years</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {currentItem.grades && currentItem.grades.map((grade, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {grade}
                    <button 
                      type="button" 
                      onClick={() => removeGrade(grade)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  placeholder="e.g., 9-12, Form 3, KS3"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addGrade();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={addGrade}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Subjects Taught</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {currentItem.subjects && currentItem.subjects.map((subject, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {subject}
                    <button 
                      type="button" 
                      onClick={() => removeSubject(subject)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="Add a subject"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSubject();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={addSubject}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Reporting Manager</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manager-name" className="text-xs text-gray-500">Name</Label>
                  <Input 
                    id="manager-name"
                    value={currentItem.reportingManager?.name || ""}
                    onChange={(e) => updateReportingManager('name', e.target.value)}
                    placeholder="e.g., Jane Smith"
                  />
                </div>
                <div>
                  <Label htmlFor="manager-phone" className="text-xs text-gray-500">Phone Number</Label>
                  <Input 
                    id="manager-phone"
                    type="tel"
                    value={currentItem.reportingManager?.phoneNumber || ""}
                    onChange={(e) => updateReportingManager('phone', e.target.value)}
                    placeholder="e.g., +254712345678"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                We'll send a verification request to this phone number via SMS/WhatsApp
              </p>
            </div>
            
            <div>
              <Label htmlFor="exp-details">Additional Details</Label>
              <Textarea
                id="exp-details"
                value={currentItem.additionalDetails || ""}
                onChange={(e) => updateCurrentItem('additionalDetails', e.target.value)}
                placeholder="e.g., Responsibilities, achievements, projects, etc."
                rows={4}
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              {editingId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    addItem();
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={saveItem}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {editingId ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingId ? "Update Experience" : "Save Experience"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default ExperienceStep;
