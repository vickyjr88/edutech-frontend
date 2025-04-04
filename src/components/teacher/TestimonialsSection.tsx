
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialProps {
  name: string;
  relationship: string;
  content: string;
  rating: number;
  date: string;
  avatar: string;
}

interface TestimonialsSectionProps {
  testimonials: TestimonialProps[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Student Testimonials</h2>
        <div className="flex items-center">
          <span className="text-lg font-bold mr-2">
            {testimonials.reduce((sum, item) => sum + item.rating, 0) / testimonials.length}
          </span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className="h-5 w-5 text-yellow-500 fill-yellow-500" 
              />
            ))}
          </div>
          <span className="ml-2 text-gray-500">({testimonials.length} reviews)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.relationship}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1 font-medium">{testimonial.rating}</span>
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{testimonial.content}</p>
                  <p className="mt-2 text-sm text-gray-500">{testimonial.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
