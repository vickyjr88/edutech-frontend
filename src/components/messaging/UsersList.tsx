
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus } from "lucide-react";
import { DirectMessageUser } from "@/integrations/api/services/messaging.service";

interface UsersListProps {
  users: DirectMessageUser[];
  onSelectUser?: (userId: string) => void;
  activeUserId?: string;
}

export default function UsersList({ users, onSelectUser, activeUserId }: UsersListProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
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
              className={`w-full justify-start py-1 px-2 h-auto ${activeUserId === user.id
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              onClick={() => onSelectUser && onSelectUser(user.id)}
            >
              <div className="flex items-center w-full">
                <div className="relative mr-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className={`${getRoleColor(user.role)} text-white text-xs`}>
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 h-2 w-2 rounded-full border border-gray-800 ${user.status === 'online' ? 'bg-green-500' :
                        user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}
                  ></span>
                </div>
                <span className="truncate text-sm">{user.name}</span>
                {user.unreadCount && user.unreadCount > 0 ? (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                    {user.unreadCount}
                  </span>
                ) : null}
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
