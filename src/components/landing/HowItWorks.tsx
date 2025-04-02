
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Sign Up",
    description: "Create your account and tell us about your learning needs or teaching expertise.",
    image: "https://images.unsplash.com/photo-1484807352052-23338990c6c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  },
  {
    number: "02",
    title: "Browse & Connect",
    description: "Explore available courses and tutors or set up your teaching profile.",
    image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  },
  {
    number: "03",
    title: "Learn & Teach",
    description: "Participate in interactive sessions with peers and experienced educators.",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1422&q=80"
  }
];

const HowItWorks = () => {
  return (
    <div className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">How Kidato Works</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Our simple process connects students with tutors in just a few steps
          </p>
        </div>

        <div className="space-y-12 lg:space-y-20">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 items-center`}
            >
              <div className="w-full lg:w-1/2">
                <img 
                  src={step.image} 
                  alt={step.title} 
                  className="rounded-xl shadow-lg w-full object-cover h-80 lg:h-96" 
                />
              </div>
              <div className="w-full lg:w-1/2">
                <div className="flex items-center mb-4">
                  <span className="text-4xl font-bold text-kidato-blue mr-4">{step.number}</span>
                  <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/signup">
            <Button className="bg-kidato-blue hover:bg-kidato-dark-blue button-hover-effect text-lg px-8 py-6">
              Join Kidato Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
