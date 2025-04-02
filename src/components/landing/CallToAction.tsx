
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CallToAction = () => {
  return (
    <div className="section-padding bg-kidato-blue text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold md:text-4xl mb-6">
          Ready to Transform Learning in Africa?
        </h2>
        <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
          Join thousands of students, parents, and tutors who are already part of the Kidato community.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
          <Link to="/signup" className="w-full">
            <Button variant="secondary" size="lg" className="w-full text-kidato-blue hover:bg-white">
              Sign Up
            </Button>
          </Link>
          <Link to="/courses" className="w-full">
            <Button variant="outline" size="lg" className="w-full border-white text-white hover:bg-white/10">
              Explore Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
