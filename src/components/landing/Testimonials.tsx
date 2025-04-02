
const testimonials = [
  {
    content: "Kidato has transformed my daughter's learning experience. She's more engaged and excited about school than ever before.",
    author: "Sarah M.",
    role: "Parent",
    image: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    content: "As a tutor on Kidato, I've been able to reach students across Africa and make a real difference in their educational journey.",
    author: "Michael O.",
    role: "Mathematics Tutor",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    content: "I've made friends from different countries while learning coding. The classes are fun and the teachers are amazing!",
    author: "Amina K.",
    role: "Student, Age 13",
    image: "https://randomuser.me/api/portraits/women/67.jpg"
  }
];

const Testimonials = () => {
  return (
    <div className="section-padding bg-kidato-light-blue">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">What Our Community Says</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from students, parents, and tutors who are part of the Kidato family
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="h-12 w-12 rounded-full mr-4" 
                />
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
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
