
import { Users, GraduationCap, Clock, Award } from "lucide-react";

const HeroStats = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
        <div className="flex justify-center mb-2">
          <Users className="h-8 w-8 text-kidato-orange" />
        </div>
        <h3 className="text-3xl font-bold">15,000+</h3>
        <p className="text-sm opacity-80">Students Enrolled</p>
      </div>
      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
        <div className="flex justify-center mb-2">
          <GraduationCap className="h-8 w-8 text-kidato-orange" />
        </div>
        <h3 className="text-3xl font-bold">94%</h3>
        <p className="text-sm opacity-80">Grade Improvement</p>
      </div>
      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
        <div className="flex justify-center mb-2">
          <Clock className="h-8 w-8 text-kidato-orange" />
        </div>
        <h3 className="text-3xl font-bold">500+</h3>
        <p className="text-sm opacity-80">Weekly Classes</p>
      </div>
      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
        <div className="flex justify-center mb-2">
          <Award className="h-8 w-8 text-kidato-orange" />
        </div>
        <h3 className="text-3xl font-bold">4.8/5</h3>
        <p className="text-sm opacity-80">Average Rating</p>
      </div>
    </div>
  );
};

export default HeroStats;
