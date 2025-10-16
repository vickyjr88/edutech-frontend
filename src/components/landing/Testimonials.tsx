import type { TestimonialSection } from "@/content/types";

interface TestimonialsProps {
  content?: TestimonialSection;
}

const Testimonials = ({ content }: TestimonialsProps) => {
  // Default testimonials (fallback)
  const defaultData: TestimonialSection = {
    type: 'testimonials',
    title: "What Our Community Says",
    subtitle: "Hear from students, parents, and tutors who are part of the Kidato family",
    testimonials: [
      {
        id: "1",
        content: "Kidato has transformed my daughter's learning experience. She's more engaged and excited about school than ever before.",
        name: "Sarah M.",
        role: "Parent",
        avatar: {
          src: "https://randomuser.me/api/portraits/women/1.jpg",
          alt: "Sarah M."
        }
      },
      {
        id: "2",
        content: "As a tutor on Kidato, I've been able to reach students across Africa and make a real difference in their educational journey.",
        name: "Michael O.",
        role: "Mathematics Tutor",
        avatar: {
          src: "https://randomuser.me/api/portraits/men/32.jpg",
          alt: "Michael O."
        }
      },
      {
        id: "3",
        content: "I've made friends from different countries while learning coding. The classes are fun and the teachers are amazing!",
        name: "Amina K.",
        role: "Student, Age 13",
        avatar: {
          src: "https://randomuser.me/api/portraits/women/67.jpg",
          alt: "Amina K."
        }
      }
    ]
  };

  const data = content || defaultData;

  return (
    <div className="section-padding bg-kidato-light-blue">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">{data.title}</h2>
          {data.subtitle && (
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {data.testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar.src}
                  alt={testimonial.avatar.alt}
                  className="h-12 w-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
