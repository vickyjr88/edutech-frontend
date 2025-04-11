
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const EmptyClassesState = () => {
  return (
    <div className="text-center py-12 bg-kidato-light-blue rounded-lg">
      <div className="w-16 h-16 bg-kidato-blue rounded-full flex items-center justify-center mx-auto mb-4">
        <BookOpen className="h-8 w-8 text-white" />
      </div>
      <p className="text-lg font-medium text-gray-700 mb-2">No upcoming classes scheduled</p>
      <p className="text-gray-500 mb-6">Time to explore new subjects!</p>
      <Button asChild className="bg-kidato-blue hover:bg-kidato-blue/90">
        <Link to="/courses">Browse Classes</Link>
      </Button>
    </div>
  );
};

export default EmptyClassesState;
