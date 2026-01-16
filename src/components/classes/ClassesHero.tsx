
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HeroStats from "./HeroStats";

const ClassesHero = () => {
  return (
    <div className="bg-gradient-to-r from-kidato-purple to-kidato-dark-blue py-20 pt-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Your Child's Learning Potential</h1>
            <p className="text-xl max-w-3xl mb-6">
              Explore live, interactive classes taught by Africa's top educators designed to inspire and challenge your child.
            </p>
            <div className="space-x-4">
              <Button size="lg" className="bg-white text-kidato-purple hover:bg-gray-100" asChild>
                <Link to="/signup?role=student">Start Learning Today</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-kidato-dark-blue border-2 border-white text-white hover:bg-white hover:text-white transition-colors duration-300"
                asChild
              >
                <Link to="/how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
          
          <HeroStats />
        </div>
      </div>
    </div>
  );
};

export default ClassesHero;
