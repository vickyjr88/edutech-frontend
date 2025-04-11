
import { CalendarDays, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";

interface GroupHeaderProps {
  name: string;
  subject: string;
  deadline: string;
}

const GroupHeader = ({ name, subject, deadline }: GroupHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <DialogTitle className="text-xl">{name}</DialogTitle>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            {subject}
          </Badge>
          <span className="text-sm text-gray-500">
            <CalendarDays className="inline-block mr-1 h-3.5 w-3.5 text-gray-400" />
            Due: {deadline}
          </span>
        </div>
      </div>
      <Button variant="ghost" className="rounded-full p-2 h-auto" size="icon">
        <MessageSquare className="h-5 w-5 text-gray-500" />
      </Button>
    </div>
  );
};

export default GroupHeader;
