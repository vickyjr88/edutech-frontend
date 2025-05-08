import React from 'react';
import { Clock, PlusCircle, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TeacherClassesSectionProps {
  teacher: any;
}

const TeacherClassesSection: React.FC<TeacherClassesSectionProps> = ({ teacher }) => {
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
              <Button variant="default" className="w-full bg-kidato-blue hover:bg-blue-700">
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
            <Button variant="default" className="bg-kidato-blue hover:bg-blue-700">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Your First Class
            </Button>
          )}
        </div>
      )}

      {teacher.classes && teacher.classes.length > 3 && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="border-kidato-blue text-kidato-blue hover:bg-blue-50">
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
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
            Request Custom Class
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeacherClassesSection;