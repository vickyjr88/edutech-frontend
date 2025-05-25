
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialCardProps {
  name: string;
  subject: string;
  testimonial: string;
  avatar: string;
}

const TestimonialCard = ({ name, subject, testimonial, avatar }: TestimonialCardProps) => {
  return (
    <Card className="border-gray-200 hover:shadow-md transition-shadow duration-300">
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <img 
            src={avatar} 
            alt={name} 
            className="h-14 w-14 rounded-full mr-4" 
          />
          <div>
            <h4 className="font-semibold text-gray-900">{name}</h4>
            <p className="text-sm text-kidato-purple">{subject}</p>
          </div>
        </div>
        <p className="text-gray-700 italic">"{testimonial}"</p>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
