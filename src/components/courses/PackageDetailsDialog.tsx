
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Check, BookOpen, GraduationCap, Award, Clock, Target, Brain, Calendar, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PackageDetail {
  id: string;
  name: string;
  curriculum: string;
  grade: string;
  subjects: string[];
  hasCheckpoint: boolean;
  developmentTips: string[];
  description: string;
}

interface PackageDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageDetail: PackageDetail | null;
}

const PackageDetailsDialog = ({ open, onOpenChange, packageDetail }: PackageDetailsDialogProps) => {
  if (!packageDetail) return null;

  const getCurriculumBadgeColor = (curriculum: string) => {
    switch(curriculum) {
      case "IGCSE": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "IB": return "bg-sky-100 text-sky-800 border-sky-200";
      case "American": return "bg-rose-100 text-rose-800 border-rose-200";
      case "British": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Kenyan": return "bg-amber-100 text-amber-800 border-amber-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <div className="flex flex-wrap gap-2 mb-1">
            <Badge variant="outline" className={getCurriculumBadgeColor(packageDetail.curriculum)}>
              {packageDetail.curriculum} Curriculum
            </Badge>
            <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
              Grade/Year {packageDetail.grade}
            </Badge>
            {packageDetail.hasCheckpoint && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                Checkpoint Year
              </Badge>
            )}
          </div>
          <DialogTitle className="text-2xl font-bold text-kidato-blue">
            {packageDetail.name}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            {packageDetail.description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-kidato-orange" />
              Core Curriculum Subjects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {packageDetail.subjects.map((subject, index) => (
                <div key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{subject}</span>
                </div>
              ))}
            </div>
          </div>

          {packageDetail.hasCheckpoint && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-blue-600" />
                Important Checkpoint Information
              </h3>
              <p className="text-gray-700 mb-3">
                Grade/Year {packageDetail.grade} includes important checkpoint examinations that assess your child's progress. 
                These assessments are crucial milestones in the {packageDetail.curriculum} curriculum.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start">
                  <Target className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Focused exam preparation</span>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Strategic assessment scheduling</span>
                </div>
                <div className="flex items-start">
                  <Brain className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Test-taking strategies</span>
                </div>
                <div className="flex items-start">
                  <Clock className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Additional practice sessions</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Award className="h-5 w-5 mr-2 text-kidato-orange" />
              Supporting Your Child's Development
            </h3>
            <p className="text-gray-600 mb-3 text-sm">
              These age-appropriate strategies will help you support your child's learning journey at home:
            </p>
            <ul className="space-y-2">
              {packageDetail.developmentTips.map((tip, index) => (
                <li key={index} className="bg-gray-50 p-3 rounded-md border border-gray-100 text-gray-700">
                  <div className="flex">
                    <span className="font-medium text-kidato-blue mr-2">{index + 1}.</span> 
                    {tip}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PackageDetailsDialog;
