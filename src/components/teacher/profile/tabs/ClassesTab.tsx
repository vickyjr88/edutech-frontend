
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClassesTabProps {
  teacher: any;
  onBookService?: (serviceId: string) => void;
}

export default function ClassesTab({ teacher, onBookService }: ClassesTabProps) {
  const academicClasses = teacher.classes?.filter((c: any) => c.type === 'academic') || [];
  const afterSchoolClasses = teacher.classes?.filter((c: any) => c.type === 'afterschool') || [];

  const renderClass = (classItem: any) => (
    <div key={classItem.id} className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col h-full">
      <div className="flex-grow">
        <div className="aspect-w-16 aspect-h-9 mb-3">
          <img 
            src={classItem.imageSrc || "https://images.unsplash.com/photo-1610484826967-09c5720778c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"} 
            alt={classItem.title} 
            className="rounded-md object-cover w-full h-48" 
          />
        </div>
        <h3 className="font-medium mb-1">{classItem.title}</h3>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Badge variant="outline" className="mr-2">{classItem.subject}</Badge>
          <span>{classItem.level}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center mr-3">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Flexible schedule</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>60 min</span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <Button 
          onClick={() => onBookService && onBookService(classItem.id)}
          className="w-full"
        >
          Book a Slot
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {academicClasses.length > 0 && (
        <div>
          <h2 className="text-lg font-medium mb-3">Academic Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {academicClasses.map(renderClass)}
          </div>
        </div>
      )}
      
      {afterSchoolClasses.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-3">After School Activities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {afterSchoolClasses.map(renderClass)}
          </div>
        </div>
      )}
      
      {(!academicClasses.length && !afterSchoolClasses.length) && (
        <div className="text-center py-12">
          <p className="text-gray-500">No classes available at the moment.</p>
        </div>
      )}
    </div>
  );
}
