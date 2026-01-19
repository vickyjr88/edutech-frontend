import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, PlusCircle, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { customClassRequestService } from '@/integrations/api/services/custom-class-request.service';

interface TeacherClassesSectionProps {
  teacher: any;
}

const TeacherClassesSection: React.FC<TeacherClassesSectionProps> = ({ teacher }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showCustomClassDialog, setShowCustomClassDialog] = useState(false);
  const [customClassForm, setCustomClassForm] = useState({
    subject: '',
    studentName: '',
    studentGrade: '',
    description: '',
    preferredSchedule: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleViewClassDetails = (classId: string) => {
    navigate(`/class/${classId}`);
  };

  const handleCustomClassRequest = async () => {
    if (!customClassForm.subject || !customClassForm.studentName || !customClassForm.studentGrade || !customClassForm.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await customClassRequestService.createRequest({
        teacherId: teacher.id,
        subject: customClassForm.subject,
        studentName: customClassForm.studentName,
        studentGrade: customClassForm.studentGrade,
        description: customClassForm.description,
        preferredSchedule: customClassForm.preferredSchedule || undefined,
      });

      if (error) {
        throw new Error(error.message || 'Failed to submit request');
      }

      toast({
        title: "Request Submitted!",
        description: `Your custom class request has been sent to ${teacher.name.split(' ')[0]}. They will contact you soon.`,
      });

      setShowCustomClassDialog(false);
      setCustomClassForm({
        subject: '',
        studentName: '',
        studentGrade: '',
        description: '',
        preferredSchedule: ''
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Classes Offered by {teacher.name}</h3>
        <p className="text-gray-600">
          Enroll in one of these classes to learn directly from {teacher.name.split(' ')[0]}.
          All classes include personalized feedback and support.
        </p>
      </div>

      {teacher.classes && teacher.classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teacher.classes.map((classItem: any) => (
            <Card key={classItem.id} className="overflow-hidden transition-all hover:shadow-md">
              <div className="h-40 overflow-hidden">
                <img
                  src={classItem.imageSrc}
                  alt={classItem.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{classItem.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {classItem.subject} • {classItem.level}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className={
                    classItem.type === 'academic'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-purple-50 text-purple-700 border-purple-200'
                  }>
                    {classItem.type === 'academic' ? 'Academic' : 'After School'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <div className="flex flex-wrap gap-y-2">
                  <div className="flex items-center w-1/2">
                    <Clock className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">{classItem.duration}</span>
                  </div>
                  <div className="flex items-center w-1/2">
                    <Users className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">{classItem.studentsEnrolled} students</span>
                  </div>
                  {classItem.rating && (
                    <div className="flex items-center w-1/2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600">{classItem.rating} rating</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-4">
                <Button
                  variant="default"
                  className="w-full bg-kidato-purple hover:bg-blue-700"
                  onClick={() => handleViewClassDetails(classItem.id)}
                >
                  View Class Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-50 rounded-lg">
          <h4 className="text-lg font-medium text-gray-700 mb-2">
            {teacher.isProfileResume ? "You Haven't Added Any Classes" : "No Classes Available Yet"}
          </h4>
          <p className="text-gray-600 mb-4">
            {teacher.isProfileResume ?
              "You haven't published any classes yet. Add classes to showcase your teaching expertise to potential students." :
              `${teacher.name.split(' ')[0]} hasn't published any classes yet. Check back later or request a custom class.`
            }
          </p>
          {teacher.isProfileResume && (
            <Button variant="default" className="bg-kidato-purple hover:bg-blue-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Your First Class
            </Button>
          )}
        </div>
      )}

      {teacher.classes && teacher.classes.length > 3 && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="border-kidato-purple text-kidato-purple hover:bg-blue-50">
            View All Classes
          </Button>
        </div>
      )}

      {!teacher.hideBookingActions && (
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Looking for something specific?</h4>
          <p className="text-gray-700 mb-4">
            If you don't see a class that meets your needs, you can request a custom class or private tutoring session.
          </p>
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowCustomClassDialog(true)}
          >
            Request Custom Class
          </Button>
        </div>
      )}

      {/* Custom Class Request Dialog */}
      <Dialog open={showCustomClassDialog} onOpenChange={setShowCustomClassDialog}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Request a Custom Class</DialogTitle>
            <DialogDescription>
              Fill out the form below to request a personalized class with {teacher.name.split(' ')[0]}. They will review your request and get back to you soon.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="e.g., Mathematics, Chemistry, English"
                value={customClassForm.subject}
                onChange={(e) => setCustomClassForm({ ...customClassForm, subject: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="studentName">Student Name *</Label>
              <Input
                id="studentName"
                placeholder="Enter student's name"
                value={customClassForm.studentName}
                onChange={(e) => setCustomClassForm({ ...customClassForm, studentName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="studentGrade">Grade Level *</Label>
              <Select
                value={customClassForm.studentGrade}
                onValueChange={(value) => setCustomClassForm({ ...customClassForm, studentGrade: value })}
              >
                <SelectTrigger id="studentGrade">
                  <SelectValue placeholder="Select grade level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grade-1">Grade 1</SelectItem>
                  <SelectItem value="grade-2">Grade 2</SelectItem>
                  <SelectItem value="grade-3">Grade 3</SelectItem>
                  <SelectItem value="grade-4">Grade 4</SelectItem>
                  <SelectItem value="grade-5">Grade 5</SelectItem>
                  <SelectItem value="grade-6">Grade 6</SelectItem>
                  <SelectItem value="grade-7">Grade 7</SelectItem>
                  <SelectItem value="grade-8">Grade 8</SelectItem>
                  <SelectItem value="grade-9">Form 1</SelectItem>
                  <SelectItem value="grade-10">Form 2</SelectItem>
                  <SelectItem value="grade-11">Form 3</SelectItem>
                  <SelectItem value="grade-12">Form 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Class Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what you'd like to learn, any specific topics to cover, learning goals, etc."
                className="min-h-[100px]"
                value={customClassForm.description}
                onChange={(e) => setCustomClassForm({ ...customClassForm, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="schedule">Preferred Schedule (Optional)</Label>
              <Input
                id="schedule"
                placeholder="e.g., Weekday evenings, Saturday mornings"
                value={customClassForm.preferredSchedule}
                onChange={(e) => setCustomClassForm({ ...customClassForm, preferredSchedule: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCustomClassDialog(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCustomClassRequest}
              disabled={isSubmitting}
              className="bg-kidato-purple hover:bg-blue-700"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherClassesSection;