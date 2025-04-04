
import { Star, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export interface ClassItemProps {
  title: string;
  subject: string;
  level: string;
  teacher: string;
  rating: number;
  time: string;
  imageSrc: string;
  spots: string;
  price: string;
  featured?: boolean;
}

const ClassCard = ({ classItem }: { classItem: ClassItemProps }) => {
  // Convert the title to a URL-friendly slug
  const slug = classItem.title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <Link to={`/class/${slug}`}>
      <Card className={`overflow-hidden transition-all duration-300 ${classItem.featured 
        ? 'border-2 border-kidato-orange shadow-md' 
        : 'hover:shadow-md border border-gray-100'}`}>
        <div className="relative h-48 overflow-hidden">
          <img 
            src={classItem.imageSrc} 
            alt={classItem.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          {classItem.featured && (
            <div className="absolute top-2 right-2 bg-kidato-orange text-white text-xs font-bold px-2 py-1 rounded-full">
              Featured
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-kidato-blue">{classItem.subject}</p>
              <h4 className="text-lg font-semibold text-gray-900 line-clamp-1">{classItem.title}</h4>
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-medium">{classItem.rating}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-2">{classItem.level}</p>
          <p className="text-xs text-gray-500 mb-3">
            <span className="font-medium">Teacher:</span> {classItem.teacher}
          </p>
          <div className="flex items-center gap-1 mb-3">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            <p className="text-xs text-gray-500">{classItem.time}</p>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
              {classItem.spots}
            </span>
            <span className="text-sm font-semibold text-gray-900">{classItem.price}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ClassCard;
