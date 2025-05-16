import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Edit, Trash2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

// Define type for class items
interface ClassItem {
  _id: string;
  title: string;
  subject: string;
  type: string;
  description?: string;
  status?: string;
  isPublished?: boolean;
  updatedAt?: string;
  createdAt: string;
}

interface DraftClassesListProps {
  classes: ClassItem[];
  onDeleteClass: (classId: string) => void;
}

const DraftClassesList: React.FC<DraftClassesListProps> = ({ classes, onDeleteClass }) => {
  const navigate = useNavigate();
  
  // Filter classes to show only drafts (unpublished or with draft status)
  const draftClasses = classes.filter(cls => 
    cls.isPublished === false || cls.status === 'draft'
  );
  
  if (draftClasses.length === 0) {
    return (
      <Card className="mb-6 bg-gray-50">
        <CardContent className="pt-6 pb-6">
          <p className="text-center text-gray-500">No draft classes found.</p>
        </CardContent>
      </Card>
    );
  }
  
  const handleContinueClass = (classId: string) => {
    navigate(`/teacher-class-setup/${classId}`);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Your Draft Classes</CardTitle>
        <CardDescription>
          Continue working on your previously started classes
        </CardDescription>
      </CardHeader>
      
      <CardContent className="grid gap-4">
        {draftClasses.map(cls => (
          <Card key={cls._id} className="overflow-hidden border border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all">
            <div className="flex flex-col sm:flex-row">
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium mb-1">{cls.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs mr-2">
                        {cls.type === 'academic' ? 'Academic' : 'After School'}
                      </span>
                      <span>{cls.subject}</span>
                    </div>
                  </div>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs">
                    Draft
                  </span>
                </div>
                
                {cls.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{cls.description}</p>
                )}
                
                <div className="text-xs text-gray-500 flex items-center mt-2">
                  <Clock className="h-3 w-3 mr-1" />
                  Last updated {formatDistanceToNow(new Date(cls.updatedAt || cls.createdAt), { addSuffix: true })}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 flex flex-row sm:flex-col justify-end items-center gap-2 border-t sm:border-t-0 sm:border-l border-gray-200">
                <Button 
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDeleteClass(cls._id)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
                
                <Button 
                  variant="default"
                  size="sm"
                  className="gap-1"
                  onClick={() => handleContinueClass(cls._id)}
                >
                  <Edit className="h-3.5 w-3.5" />
                  Continue
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default DraftClassesList;