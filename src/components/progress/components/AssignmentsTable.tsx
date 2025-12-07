
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Calendar, Users } from "lucide-react";
import { getStatusBadge, getActionButton } from "../utils/assignmentUtils";
import { Assignment } from "@/types/assignment";

interface AssignmentsTableProps {
  assignments: Assignment[];
  onViewAssignment: (assignment: Assignment) => void;
}

export const AssignmentsTable = ({ assignments, onViewAssignment }: AssignmentsTableProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <FileText className="mr-2 h-5 w-5 text-amber-500" />
          All Assignments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Assignment</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">
                    {assignment.title}
                  </TableCell>
                  <TableCell>
                    {assignment.type === "group" ? (
                      <div className="flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1 text-purple-500" />
                        <span>Group ({assignment.groupMembers} members)</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <FileText className="h-3.5 w-3.5 mr-1 text-blue-500" />
                        <span>Individual</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(assignment.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                      <span>{assignment.dueDate}</span>
                      {assignment.lateBy && (
                        <Badge variant="destructive" className="ml-2">
                          {assignment.lateBy} late
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {assignment.grade ? (
                      <div className="flex items-center">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-700 border-green-200"
                        >
                          {assignment.grade}
                        </Badge>
                        <span className="ml-2">{assignment.score}</span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {getActionButton(assignment, onViewAssignment)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
