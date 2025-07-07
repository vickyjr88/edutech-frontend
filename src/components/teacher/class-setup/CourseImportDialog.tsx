import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText, 
  BookOpen, 
  Target, 
  Package, 
  Link2, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Users,
  Sparkles,
  Download
} from 'lucide-react';
import { ExtractedCourseData } from '@/types/course-data';

interface CourseImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  extractedData: ExtractedCourseData | null;
  onImport: (selectedSections: string[]) => void;
  isImporting?: boolean;
}

interface ImportSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  items: string[];
  required?: boolean;
}

export const CourseImportDialog: React.FC<CourseImportDialogProps> = ({
  open,
  onOpenChange,
  extractedData,
  onImport,
  isImporting = false
}) => {
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'basicInfo', 'objectives', 'lessonPlans', 'materials'
  ]);

  if (!extractedData) return null;

  const importSections: ImportSection[] = [
    {
      id: 'basicInfo',
      title: 'Basic Information',
      description: 'Course title, description, curriculum, and grade level',
      icon: FileText,
      items: [
        `Title: ${extractedData.title}`,
        `Curriculum: ${extractedData.curriculum}`,
        `Grade Level: ${extractedData.gradeLevel}`,
        `Duration: ${extractedData.duration}`,
        extractedData.description ? 'Description included' : 'No description'
      ],
      required: true
    },
    {
      id: 'objectives',
      title: 'Learning Objectives',
      description: 'Course objectives and learning outcomes',
      icon: Target,
      items: extractedData.objectives.map((obj, index) => 
        `${index + 1}. ${obj.text} (${obj.category})`
      )
    },
    {
      id: 'lessonPlans',
      title: 'Lesson Plans',
      description: 'Detailed lesson plans with activities and assessments',
      icon: BookOpen,
      items: extractedData.lessonPlans.map((lesson, index) => 
        `Lesson ${lesson.lessonNumber}: ${lesson.title} (${lesson.duration} min)`
      )
    },
    {
      id: 'materials',
      title: 'Materials & Resources',
      description: 'Required materials and technical requirements',
      icon: Package,
      items: [
        ...extractedData.materials.map(material => material.name),
        ...extractedData.technicalRequirements.map(req => req.requirement)
      ]
    }
  ];

  const handleSectionToggle = (sectionId: string, checked: boolean) => {
    if (importSections.find(s => s.id === sectionId)?.required) {
      return; // Cannot uncheck required sections
    }

    if (checked) {
      setSelectedSections([...selectedSections, sectionId]);
    } else {
      setSelectedSections(selectedSections.filter(id => id !== sectionId));
    }
  };

  const handleImport = () => {
    onImport(selectedSections);
  };

  const getTotalItemsCount = () => {
    return importSections.reduce((total, section) => {
      if (selectedSections.includes(section.id)) {
        return total + section.items.length;
      }
      return total;
    }, 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Download className="h-5 w-5 text-green-600" />
            Import Course Outline
          </DialogTitle>
          <DialogDescription>
            Review and select which parts of the course outline you'd like to import into your class.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {/* Course Overview */}
            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  Course Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Title:</span>
                    <p className="text-gray-900">{extractedData.title}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Curriculum:</span>
                    <p className="text-gray-900">{extractedData.curriculum}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Grade Level:</span>
                    <p className="text-gray-900">{extractedData.gradeLevel}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <p className="text-gray-900">{extractedData.duration}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {extractedData.lessonPlans.length} Lessons
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Target className="h-3 w-3 mr-1" />
                    {extractedData.objectives.length} Objectives
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    <Package className="h-3 w-3 mr-1" />
                    {extractedData.materials.length} Materials
                  </Badge>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {extractedData.confidence}% Confidence
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Import Sections */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Select sections to import:</h3>
              
              {importSections.map((section) => {
                const isSelected = selectedSections.includes(section.id);
                const Icon = section.icon;
                
                return (
                  <Card 
                    key={section.id} 
                    className={`transition-all ${
                      isSelected 
                        ? 'border-green-300 bg-green-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            isSelected ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            <Icon className={`h-4 w-4 ${
                              isSelected ? 'text-green-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              {section.title}
                              {section.required && (
                                <Badge variant="secondary" className="text-xs">
                                  Required
                                </Badge>
                              )}
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                              {section.description}
                            </p>
                          </div>
                        </div>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => 
                            handleSectionToggle(section.id, checked as boolean)
                          }
                          disabled={section.required}
                        />
                      </div>
                    </CardHeader>
                    {isSelected && section.items.length > 0 && (
                      <CardContent className="pt-0">
                        <div className="bg-white rounded-md p-3 border">
                          <p className="text-xs font-medium text-gray-700 mb-2">
                            Preview ({section.items.length} items):
                          </p>
                          <div className="space-y-1 max-h-24 overflow-y-auto">
                            {section.items.slice(0, 5).map((item, index) => (
                              <p key={index} className="text-xs text-gray-600 truncate">
                                • {item}
                              </p>
                            ))}
                            {section.items.length > 5 && (
                              <p className="text-xs text-gray-500 italic">
                                ... and {section.items.length - 5} more items
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Import Summary */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Import Summary:</strong> {getTotalItemsCount()} items will be imported from {selectedSections.length} sections. 
                Existing form data will be preserved where possible.
              </AlertDescription>
            </Alert>
          </div>
        </ScrollArea>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={isImporting || selectedSections.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            {isImporting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Import Selected ({selectedSections.length} sections)
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};