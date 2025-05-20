import { UsersRound, CalendarDays, UserCircle, Plus, DollarSign, Clock, Percent, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cohort } from "../TeacherClassView";

interface CohortsProps {
  cohorts: Cohort[];
}

const Cohorts = ({ cohorts }: CohortsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Cohorts</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Cohort
        </Button>
      </div>
      
      <div className="text-sm text-gray-500 mb-6">
        Manage your class cohorts. Each cohort represents a group of students following the same schedule and taught by a specific teacher.
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cohorts.map((cohort) => (
          <Card key={cohort.id} className="hover:shadow-md transition-shadow overflow-hidden">
            <div className="h-2" style={{ backgroundColor: cohort.color }}></div>
            <CardContent className="p-0">
              {/* Header with cohort name and status */}
              <div className="p-4 pb-2 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-semibold text-lg">{cohort.name}</h3>
                <div className="bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-600">
                  {cohort.meetingPattern}
                </div>
              </div>
              
              {/* Price and discount - featured prominently */}
              <div className="p-4 bg-gray-50 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-white h-10 w-10 rounded-full flex items-center justify-center shadow-sm">
                    <DollarSign className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Price</p>
                    <div className="font-semibold text-gray-900">
                      {typeof cohort.price === 'number' ? `$${cohort.price.toFixed(2)}` : 'Free'}
                    </div>
                  </div>
                </div>
                {cohort.discount && cohort.discount > 0 && (
                  <div className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center">
                    <Percent className="h-3.5 w-3.5 mr-1" />
                    <span className="font-medium">{cohort.discount}% off</span>
                  </div>
                )}
              </div>
              
              {/* Schedule information - important */}
              <div className="p-4 flex items-center border-b border-gray-100">
                <div className="bg-blue-50 h-10 w-10 rounded-full flex items-center justify-center">
                  <CalendarDays className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium text-gray-500">Schedule</p>
                  <div className="font-medium text-gray-700">{cohort.schedule}</div>
                </div>
              </div>

              {/* Main info grid */}
              <div className="p-4 grid grid-cols-2 gap-5">
                <div className="flex items-start">
                  <div className="bg-purple-50 h-8 w-8 rounded-full flex items-center justify-center">
                    <UsersRound className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Students</p>
                    <div className="font-medium text-gray-700">{cohort.studentCount} enrolled</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-indigo-50 h-8 w-8 rounded-full flex items-center justify-center">
                    <UserCircle className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Teacher</p>
                    <div className="font-medium text-gray-700">{cohort.teacherName}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-amber-50 h-8 w-8 rounded-full flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Enrollment Deadline</p>
                    <div className="font-medium text-gray-700">
                      {cohort.enrollmentDeadline ? new Date(cohort.enrollmentDeadline).toLocaleDateString() : 'No deadline'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-emerald-50 h-8 w-8 rounded-full flex items-center justify-center">
                    <CalendarDays className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Starts On</p>
                    <div className="font-medium text-gray-700">
                      {cohort.startDate ? (
                        (() => {
                          const startDate = new Date(cohort.startDate);
                          const options: Intl.DateTimeFormatOptions = { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          };
                          return startDate.toLocaleDateString(undefined, options);
                        })()
                      ) : 'Not specified'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-teal-50 h-8 w-8 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-teal-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs font-medium text-gray-500">Ends On</p>
                    <div className="font-medium text-gray-700">
                      {cohort.endDate ? (
                        (() => {
                          const endDate = new Date(cohort.endDate);
                          const options: Intl.DateTimeFormatOptions = { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          };
                          return endDate.toLocaleDateString(undefined, options);
                        })()
                      ) : 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="p-4 bg-gray-50 flex justify-end gap-2 border-t border-gray-100">
                <Button variant="outline" size="sm">Manage</Button>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Button variant="outline" className="w-full border-dashed flex items-center justify-center gap-2 py-6">
        <Plus className="h-4 w-4" />
        Add Another Cohort
      </Button>
      
      <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700 flex items-start gap-3">
        <div className="rounded-full bg-blue-100 p-1">
          <CalendarDays className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <p className="font-medium">Schedule Management Tip</p>
          <p className="mt-1">When creating cohorts, consider time zones of your students to maximize attendance. You can create multiple cohorts for different time zones with the same curriculum.</p>
        </div>
      </div>
    </div>
  );
};

export default Cohorts;