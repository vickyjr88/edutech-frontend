
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle,
  Clock,
  FileText,
  AlarmClock
} from "lucide-react";
import { Assignment } from "../data/mockAssignmentsData";

interface AssignmentStatisticsProps {
  assignments: Assignment[];
}

export const AssignmentStatistics = ({ assignments }: AssignmentStatisticsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-green-100 p-3 mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold">
              {assignments.filter(a => a.status === "completed").length}
            </h3>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-amber-100 p-3 mb-3">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold">
              {assignments.filter(a => a.status === "pending_review").length}
            </h3>
            <p className="text-sm text-gray-500">Under Review</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-3 mb-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold">
              {assignments.filter(a => ["in_progress", "upcoming"].includes(a.status)).length}
            </h3>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-red-100 p-3 mb-3">
              <AlarmClock className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold">
              {assignments.filter(a => a.status === "late").length}
            </h3>
            <p className="text-sm text-gray-500">Late</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
