
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface ClassesTabProps {
  teacher: {
    name: string;
    classes: Array<{
      id: string;
      title: string;
      subject: string;
      level: string;
      rating?: number;
      imageSrc?: string;
    }>;
  };
}

export default function ClassesTab({ teacher }: ClassesTabProps) {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Classes by {teacher.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {teacher.classes.length > 0 ? (
          teacher.classes.map((cls) => (
            <Card key={cls.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={cls.imageSrc || 'https://via.placeholder.com/400x250?text=Class+Image'} 
                  alt={cls.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1">{cls.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{cls.subject} · {cls.level}</p>
                
                {cls.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{cls.rating}</span>
                  </div>
                )}
                
                <Button variant="outline" className="w-full mt-4 border-kidato-blue text-kidato-blue hover:bg-kidato-blue/10">
                  View Class
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">No classes available at the moment.</p>
          </div>
        )}
      </div>
    </>
  );
}
