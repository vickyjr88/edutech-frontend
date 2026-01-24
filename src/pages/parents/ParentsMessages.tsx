import { useState, useEffect } from "react";
import ParentSidebar from "@/components/parents/ParentSidebar";
import ParentDashboardHeader from "@/components/parents/ParentDashboardHeader";
import { MessageSquare, Search, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { messagingService, DirectMessageUser } from "@/integrations/api/services/messaging.service";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface MessagePreview {
  id: string; // User ID or Conversation ID
  conversationId?: string;
  sender: string;
  senderRole: string;
  message: string;
  time: string;
  unread: boolean;
  avatar: string; // initials or url
}

const ParentsMessages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<MessagePreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        // Fetch DMs (users we have chatted with or can chat with)
        const dmsResponse = await messagingService.getDirectMessages();

        if (dmsResponse.data) {
          const activeDMs = dmsResponse.data.filter(dm => dm.conversationId);

          const messagePreviews: MessagePreview[] = await Promise.all(
            activeDMs.map(async (dm) => {
              let lastMsgContent = "No messages yet";
              let time = "";

              if (dm.conversationId) {
                try {
                  const msgsResp = await messagingService.getMessages(dm.conversationId, 1, 1);
                  const msgs = Array.isArray(msgsResp.data) ? msgsResp.data : (msgsResp.data as any)?.messages || [];

                  if (msgs.length > 0) {
                    const lastMsg = msgs[0];
                    lastMsgContent = lastMsg.content;
                    time = formatDistanceToNow(new Date(lastMsg.timestamp), { addSuffix: true });
                  }
                } catch (e) {
                  // ignore error fetching specific messages
                }
              }

              return {
                id: dm.id,
                conversationId: dm.conversationId,
                sender: dm.name,
                senderRole: dm.role,
                message: lastMsgContent,
                time: time,
                unread: (dm.unreadCount || 0) > 0,
                avatar: dm.name.split(' ').map(n => n[0]).join('').substring(0, 2)
              };
            })
          );

          // Sort by having a time (recent first)
          // Note sorting by string time is not accurate, but good enough if we don't store raw date
          setMessages(messagePreviews);
        }
      } catch (err) {
        console.error("Failed to fetch messages", err);
        setError("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [user?.id]);

  const handleMessageClick = (dm: MessagePreview) => {
    // Navigate to the full messaging platform with the conversation ID
    navigate('/parents-messaging', { state: { conversationId: dm.conversationId } });
  };

  const filteredMessages = messages.filter(msg =>
    msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <ParentSidebar />

      <div className="flex-1 flex flex-col">
        <ParentDashboardHeader parentName={user?.fullName || "Parent"} />

        <main className="p-6 flex-1">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              {/* <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-kidato-purple" />
                <h1 className="text-2xl font-bold">Messages</h1>
              </div> */}

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-8"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{error}</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>{searchTerm ? "No messages found matching your search" : "No messages yet"}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((message) => (
                  <Card
                    key={message.id}
                    className={`hover:border-blue-200 transition-colors cursor-pointer ${message.unread ? 'bg-blue-50' : ''
                      }`}
                    onClick={() => handleMessageClick(message)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-blue-500 text-white">
                            {message.avatar}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{message.sender}</p>
                              <p className="text-sm text-gray-600">{message.senderRole}</p>
                            </div>

                            <div className="text-right">
                              <span className="text-sm text-gray-500">{message.time}</span>
                              {message.unread && (
                                <Badge className="ml-2 bg-blue-500">New</Badge>
                              )}
                            </div>
                          </div>

                          <p className="text-gray-600 mt-2 line-clamp-2">{message.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ParentsMessages;
