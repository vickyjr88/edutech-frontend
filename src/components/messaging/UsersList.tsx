
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from "lucide-react";

interface User {
  id: number;
  name: string;
  role: string;
  status: string;
  avatar: string;
}

interface UsersListProps {
  users: User[];
}

export default function UsersList({ users }: UsersListProps) {
  const getRoleColor = (role: string) => {
    switch(role) {
      case "Teacher": return "bg-blue-500";
      case "Student": return "bg-purple-500";
      case "Parent": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="py-2">
      <div className="px-3 flex justify-between items-center mb-1">
        <h3 className="text-xs font-semibold uppercase text-gray-400">Direct Messages</h3>
        <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-400 hover:text-white">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="h-[200px]">
        <div className="space-y-1 px-1">
          {users.map((user) => (
            <Button
              key={user.id}
              variant="ghost"
              className="w-full justify-start py-1 px-2 h-auto text-gray-300 hover:text-white hover:bg-gray-700"
            >
              <div className="flex items-center w-full">
                <div className="relative mr-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className={`${getRoleColor(user.role)} text-white text-xs`}>
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span 
                    className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-gray-800 ${
                      user.status === 'online' ? 'bg-green-500' : 
                      user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}
                  ></span>
                </div>
                <span className="truncate text-sm">{user.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
