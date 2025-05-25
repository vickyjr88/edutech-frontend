
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Import our components
import GroupHeader from "./GroupHeader";
import OverviewTab from "./tabs/OverviewTab";
import MembersTab from "./tabs/MembersTab";

interface Member {
  id: number;
  name: string;
  image: string;
}

interface GroupDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: {
    id: number;
    name: string;
    subject: string;
    description: string;
    progress: number;
    members: Member[];
    meetingTime: string;
    deadline: string;
  } | null;
}

const GroupDetails = ({ open, onOpenChange, group }: GroupDetailsProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  
  if (!group) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <GroupHeader 
            name={group.name}
            subject={group.subject}
            deadline={group.deadline}
          />
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="mt-2" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <OverviewTab 
              description={group.description}
              meetingTime={group.meetingTime}
              memberCount={group.members.length}
              taskProgress={group.progress}
            />
          </TabsContent>
          
          <TabsContent value="members">
            <MembersTab members={group.members} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button 
            className="bg-kidato-purple hover:bg-kidato-dark-blue"
            onClick={() => onOpenChange(false)}
          >
            Update Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GroupDetails;
