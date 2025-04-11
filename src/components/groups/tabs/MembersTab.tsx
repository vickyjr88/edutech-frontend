
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface Member {
  id: number;
  name: string;
  image: string;
}

interface MembersTabProps {
  members: Member[];
}

const MembersTab = ({ members }: MembersTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {members.map(member => (
          <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                {member.image ? (
                  <img src={member.image} alt={member.name} />
                ) : (
                  <AvatarFallback className="bg-blue-100 text-blue-800">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h4 className="font-medium">{member.name}</h4>
                <p className="text-sm text-gray-500">Student</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">Message</Button>
          </div>
        ))}
      </div>
      
      <Button variant="outline" className="w-full">
        <Users className="mr-2 h-4 w-4" />
        Invite More Members
      </Button>
    </div>
  );
};

export default MembersTab;
