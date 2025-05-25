import { Calendar } from "lucide-react";
import ParentLayout from "@/components/parents/ParentLayout";

const ParentsSchedule = () => {
  return (
    <ParentLayout>
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-6 w-6 text-kidato-purple" />
        <h1 className="text-2xl font-bold">Learning Schedule</h1>
      </div>
      
      {/* Schedule content will go here */}
      <div className="grid gap-6">
        {/* Add your schedule components here */}
      </div>
    </ParentLayout>
  );
};

export default ParentsSchedule;