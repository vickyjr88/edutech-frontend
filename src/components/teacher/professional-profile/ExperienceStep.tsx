
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, Trash2, Save, Pencil, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ExperienceItem, AchievementItem } from "./types";

type ExperienceStepProps = {
  experience: ExperienceItem[];
  setExperience: React.Dispatch<React.SetStateAction<ExperienceItem[]>>;
};

const ExperienceStep = ({ experience, setExperience }: ExperienceStepProps) => {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<ExperienceItem>({
    id: Date.now().toString(),
    value: "",
    details: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    subjects: [],
    curriculums: [],
    grades: [],
    achievements: []
  });
  const [newSubject, setNewSubject] = useState("");
  const [newCurriculum, setNewCurriculum] = useState("");
  const [newGrade, setNewGrade] = useState("");
  const [newAchievement, setNewAchievement] = useState<AchievementItem>({
    id: Date.now().toString(),
    title: "",
    description: "",
    year: ""
  });

  const addItem = () => {
    setEditingId(null);
    setCurrentItem({
      id: Date.now().toString(),
      value: "",
      details: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      subjects: [],
      curriculums: [],
      grades: [],
      achievements: []
    });
    setNewSubject("");
    setNewCurriculum("");
    setNewGrade("");
    resetNewAchievement();
  };

  const resetNewAchievement = () => {
    setNewAchievement({
      id: Date.now().toString(),
      title: "",
      description: "",
      year: ""
    });
  };

  const removeItem = (id: string) => {
    setExperience(experience.filter(item => item.id !== id));
    toast({
      title: "Experience removed",
      description: "Experience entry has been removed successfully",
    });
    
    // If we're removing the item we're currently editing, reset the form
    if (editingId === id) {
      setEditingId(null);
      addItem();
    }
  };

  const updateCurrentItem = (field: keyof ExperienceItem, value: any) => {
    setCurrentItem(prev => {
      if (field === 'currentlyWorking' && value === true) {
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

  const updateAchievementField = (field: keyof AchievementItem, value: string) => {
    setNewAchievement(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addAchievement = () => {
    if (!newAchievement.title.trim()) return;
    
    setCurrentItem(prev => ({
      ...prev,
      achievements: [...prev.achievements, { ...newAchievement, id: Date.now().toString() }]
    }));
    
    resetNewAchievement();
  };

  const removeAchievement = (achievementId: string) => {
    setCurrentItem(prev => ({
      ...prev,
      achievements: prev.achievements.filter(achievement => achievement.id !== achievementId)
    }));
  };

  const updateReportingManager = (field: 'name' | 'phone', value: string) => {
    setCurrentItem(prev => ({
      ...prev,
      reportingManager: {
        ...(prev.reportingManager || { name: "", phone: "" }),
        [field]: value
      }
    }));
  };

  const saveItem = () => {
    if (!currentItem.value.trim()) {
      toast({
        title: "Error",
        description: "Position/Institution is required",
        variant: "destructive"
      });
      return;
    }

    if (!currentItem.startDate) {
      toast({
        title: "Error",
        description: "Start date is required",
        variant: "destructive"
      });
      return;
    }
    
    if (editingId) {
      // Update existing item
      setExperience(experience.map(item => 
        item.id === editingId 
          ? { ...currentItem, id: editingId, saved: true } 
          : item
      ));
      toast({
        title: "Experience updated",
        description: "Experience entry has been updated successfully",
      });
    } else {
      // Add new item
      setExperience([...experience, { ...currentItem, saved: true }]);
      toast({
        title: "Experience added",
        description: "New experience entry has been added successfully",
      });
    }
    
    // Reset the form
    setEditingId(null);
    addItem();
  };

  const editItem = (id: string) => {
    const itemToEdit = experience.find(item => item.id === id);
    if (itemToEdit) {
      setEditingId(id);
      setCurrentItem(itemToEdit);
    }
  };
  
  // Filter saved and unsaved items
  const savedExperiences = experience.filter(item => item.saved);

  // Function to format date range for display
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
      {/* Table of saved experiences */}
      {savedExperiences.length > 0 && (
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full bg-white text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Position/Institution</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Duration</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Subjects</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-center font-medium text-gray-500 w-24">Actions</th>
              </tr>
            </thead>
            <tbody>
              {savedExperiences.map((exp) => (
                <tr key={exp.id} className="border-b">
                  <td className="px-4 py-3">
                    <div className="font-medium">{exp.value}</div>
                    {exp.curriculums && exp.curriculums.length > 0 && (
                      <div className="text-xs text-gray-500 flex flex-wrap gap-1 mt-1">
                        {exp.curriculums.map((curriculum, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {curriculum}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {exp.grades && exp.grades.length > 0 && (
                      <div className="text-xs text-gray-500 flex flex-wrap gap-1 mt-1">
                        <span>Grades: </span>
                        {exp.grades.map((grade, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {grade}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {formatDateRange(exp.startDate, exp.endDate, exp.currentlyWorking)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {exp.subjects && exp.subjects.length > 0 ? (
                        exp.subjects.map((subject, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs">No subjects</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {exp.currentlyWorking ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Current</Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-500">Past</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 flex justify-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => editItem(exp.id)}
                    >
                      <Pencil className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeItem(exp.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Experience Form */}
      <div className="p-4 border rounded-md bg-white">
        <div className="flex justify-between items-start mb-4">
          <h4 className="font-medium text-sm">
            {editingId ? "Edit Experience" : "Add New Experience"}
          </h4>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="exp-position">Position/Institution</Label>
            <Input 
              id="exp-position"
              value={currentItem.value}
              onChange={(e) => updateCurrentItem('value', e.target.value)}
              placeholder="e.g., Mathematics Teacher at ABC School"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="exp-start-date">Start Date</Label>
              <Input 
                id="exp-start-date"
                type="month"
                value={currentItem.startDate}
                onChange={(e) => updateCurrentItem('startDate', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="exp-end-date">End Date</Label>
              <Input 
                id="exp-end-date"
                type="month"
                value={currentItem.endDate}
                onChange={(e) => updateCurrentItem('endDate', e.target.value)}
                disabled={currentItem.currentlyWorking}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="exp-current" 
              checked={currentItem.currentlyWorking}
              onCheckedChange={(checked) => updateCurrentItem('currentlyWorking', checked === true)}
            />
            <Label 
              htmlFor="exp-current"
              className="text-sm font-normal"
            >
              I currently work here
            </Label>
          </div>
          
          {/* Curriculums - Multiple entries */}
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
          
          {/* Grades - Multiple entries */}
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
          
          {/* Achievements Section */}
          <div className="border p-4 rounded-md bg-gray-50">
            <Label className="mb-2 block font-medium">Achievements</Label>
            
            {/* List of added achievements */}
            {currentItem.achievements && currentItem.achievements.length > 0 && (
              <div className="mb-4 space-y-2">
                {currentItem.achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-white p-3 rounded border flex justify-between items-start">
                    <div>
                      <div className="font-medium">{achievement.title}</div>
                      {achievement.year && <div className="text-sm text-gray-500">Year: {achievement.year}</div>}
                      {achievement.description && <div className="text-sm mt-1">{achievement.description}</div>}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeAchievement(achievement.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Form to add a new achievement */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="achievement-title" className="text-xs text-gray-500">Title</Label>
                <Input 
                  id="achievement-title"
                  value={newAchievement.title}
                  onChange={(e) => updateAchievementField('title', e.target.value)}
                  placeholder="e.g., Teacher of the Year Award"
                />
              </div>
              
              <div>
                <Label htmlFor="achievement-year" className="text-xs text-gray-500">Year</Label>
                <Input 
                  id="achievement-year"
                  value={newAchievement.year || ""}
                  onChange={(e) => updateAchievementField('year', e.target.value)}
                  placeholder="e.g., 2023"
                />
              </div>
              
              <div>
                <Label htmlFor="achievement-description" className="text-xs text-gray-500">Description</Label>
                <Textarea
                  id="achievement-description"
                  value={newAchievement.description || ""}
                  onChange={(e) => updateAchievementField('description', e.target.value)}
                  placeholder="Briefly describe this achievement"
                  rows={2}
                />
              </div>
              
              <Button
                type="button"
                onClick={addAchievement}
                className="w-full"
                variant="outline"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Achievement
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
                  value={currentItem.reportingManager?.phone || ""}
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
              value={currentItem.details || ""}
              onChange={(e) => updateCurrentItem('details', e.target.value)}
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
            >
              <Save className="mr-2 h-4 w-4" />
              {editingId ? "Update Experience" : "Save Experience"}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Add New Experience Button */}
      {editingId && (
        <Button
          variant="outline"
          className="w-full"
          onClick={addItem}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Another Experience
        </Button>
      )}
    </div>
  );
};

export default ExperienceStep;
