import { UserPlus, ExternalLink, Check, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { TeachingTeamMember } from "../TeacherClassView";

interface TeachingTeamProps {
  teachingTeam: TeachingTeamMember[];
}

const TeachingTeam = ({ teachingTeam }: TeachingTeamProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Teaching Team</h2>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </div>
      
      <div className="text-sm text-gray-500 mb-6">
        Manage your teaching team members and their roles for this class. Each team member can have specific responsibilities.
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachingTeam.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Edit Role</DropdownMenuItem>
                    <DropdownMenuItem>Send Message</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500">Remove from Team</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex flex-col items-center -mt-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={member.imageSrc} alt={member.name} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="font-medium text-lg mt-3">{member.name}</h3>
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mt-1">
                  {member.role}
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Responsibilities</h4>
                <ul className="space-y-2">
                  {member.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5" />
                      <span className="text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between mt-5">
                <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5" />
                  View Profile
                </Button>
                <Button variant="outline" size="sm">Message</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Button variant="outline" className="w-full border-dashed flex items-center justify-center gap-2 py-6">
        <UserPlus className="h-4 w-4" />
        Add Team Member
      </Button>
      
      <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700 flex items-start gap-3">
        <div className="rounded-full bg-blue-100 p-1">
          <Check className="h-4 w-4 text-blue-600" />
        </div>
        <div>
          <p className="font-medium">Team Roles</p>
          <p className="mt-1">Clear role assignment helps your team understand their responsibilities. You can assign members as Lead Instructors, Teaching Assistants, Subject Matter Experts, or Content Developers.</p>
        </div>
      </div>
    </div>
  );
};

export default TeachingTeam;