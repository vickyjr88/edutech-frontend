
import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Check, BookOpen, GraduationCap, Award } from "lucide-react";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-kidato-blue">
            {packageDetail.name}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600">
            {packageDetail.curriculum} Curriculum - Grade/Year {packageDetail.grade}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-kidato-orange" />
              Required Subjects
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
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-kidato-blue" />
                Checkpoint Exams
              </h3>
              <p className="text-gray-700">
                Grade/Year {packageDetail.grade} includes important checkpoint examinations that assess your child's progress. 
                Our package includes specific exam preparation to ensure they are well-prepared for these assessments.
              </p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Award className="h-5 w-5 mr-2 text-kidato-orange" />
              Supporting Your Child's Growth
            </h3>
            <ul className="space-y-2">
              {packageDetail.developmentTips.map((tip, index) => (
                <li key={index} className="text-gray-700">
                  • {tip}
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
