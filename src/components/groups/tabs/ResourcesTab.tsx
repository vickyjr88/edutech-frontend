
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const ResourcesTab = () => {
  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
        <p className="text-center text-yellow-700">No resources have been added to this group yet.</p>
      </div>
      
      <Button className="w-full">
        <FileText className="mr-2 h-4 w-4" />
        Add Resources
      </Button>
    </div>
  );
};

export default ResourcesTab;
