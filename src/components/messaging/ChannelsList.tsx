
import { PlusCircle, Hash, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Channel } from "@/integrations/api/services/messaging.service";

interface ChannelsListProps {
  channels: Channel[];
  activeChannel: string;
  setActiveChannel: (channelId: string) => void;
  onCreateChannel?: () => void;
}

export default function ChannelsList({ channels, activeChannel, setActiveChannel, onCreateChannel }: ChannelsListProps) {
  return (
    <div className="py-2">
      <div className="px-3 flex justify-between items-center mb-1">
        <h3 className="text-xs font-semibold uppercase text-gray-500">Channels</h3>
        <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-500 hover:text-gray-900" onClick={onCreateChannel}>
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="h-[200px]">
        <div className="space-y-1 px-1">
          {channels.map((channel) => (
            <Button
              key={channel.id}
              variant="ghost"
              className={`w-full justify-start py-1 px-2 h-auto ${channel.id === activeChannel
                ? "bg-indigo-50 text-indigo-700 font-medium"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              onClick={() => setActiveChannel(channel.id)}
            >
              <div className="flex items-center w-full">
                {/* Assuming all channels are public for now, or check for private flag if added to interface */}
                <Hash className={`h-4 w-4 mr-2 flex-shrink-0 ${channel.id === activeChannel ? "text-indigo-500" : "text-gray-400"}`} />
                <span className="truncate">{channel.name}</span>
                {channel.unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                    {channel.unreadCount}
                  </span>
                )}
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
