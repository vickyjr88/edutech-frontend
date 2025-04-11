
import { Progress } from "@/components/ui/progress";
import { Clock, Users } from "lucide-react";

interface OverviewTabProps {
  description: string;
  meetingTime: string;
  memberCount: number;
  taskProgress: number;
}

const OverviewTab = ({ description, meetingTime, memberCount, taskProgress }: OverviewTabProps) => {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{taskProgress}%</span>
        </div>
        <Progress value={taskProgress} className="h-2" />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <h3 className="font-medium mb-2">Description</h3>
        <p className="text-gray-600">{description}</p>
      </div>
      
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="flex-1 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <h3 className="font-medium mb-2">Meeting Schedule</h3>
          <div className="flex items-center text-gray-600">
            <Clock className="mr-2 h-4 w-4 text-blue-500" />
            <span>{meetingTime}</span>
          </div>
        </div>
        
        <div className="flex-1 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <h3 className="font-medium mb-2">Team Size</h3>
          <div className="flex items-center text-gray-600">
            <Users className="mr-2 h-4 w-4 text-blue-500" />
            <span>{memberCount} Members</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
