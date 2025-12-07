
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Smile, MoreHorizontal, Reply } from "lucide-react";
import { Message } from "@/integrations/api/services/messaging.service";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const [showActions, setShowActions] = useState(false);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Teacher": return "text-blue-600";
      case "Student": return "text-purple-600";
      case "Parent": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getAvatarColor = (role: string) => {
    switch (role) {
      case "Teacher": return "bg-blue-500";
      case "Student": return "bg-purple-500";
      case "Parent": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div
      className="group flex space-x-3 hover:bg-gray-50 p-2 rounded-md -mx-2"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Avatar className="h-10 w-10 flex-shrink-0">
        <AvatarFallback className={`${getAvatarColor(message.author.role)} text-white`}>
          {message.author.name.split(" ").map(n => n[0]).join("")}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline">
          <h4 className="font-medium text-sm">{message.author.name}</h4>
          <span className={`ml-2 text-xs font-medium ${getRoleColor(message.author.role)}`}>
            {message.author.role}
          </span>
          <span className="ml-2 text-xs text-gray-500">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

          {showActions && (
            <div className="ml-auto flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Reply className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Smile className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-800 mt-1">{message.content}</p>

        {message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.reactions.map((reaction, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-7 px-2 py-1 bg-gray-50 hover:bg-gray-100 text-xs"
              >
                <span className="mr-1">{reaction.emoji}</span>
                <span className="text-gray-600">{reaction.count}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
