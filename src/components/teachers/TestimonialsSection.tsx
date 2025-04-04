
import TestimonialCard from "../common/TestimonialCard";

interface Testimonial {
  name: string;
  subject: string;
  testimonial: string;
  avatar: string;
}

interface TestimonialsSectionProps {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

const TestimonialsSection = ({ title, subtitle, testimonials }: TestimonialsSectionProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              name={testimonial.name}
              subject={testimonial.subject}
              testimonial={testimonial.testimonial}
              avatar={testimonial.avatar}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
