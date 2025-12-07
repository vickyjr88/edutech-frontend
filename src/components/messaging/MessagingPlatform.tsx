
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageCircle,
  Users,
  Send,
  Search,
  PlusCircle,
  Hash,
  Bell,
  FileText,
  Paperclip,
  Image,
  Smile,
  Settings,
  Loader2
} from "lucide-react";
import MessageItem from "./MessageItem";
import ChannelsList from "./ChannelsList";
import UsersList from "./UsersList";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  messagingService,
  Channel,
  DirectMessageUser,
  Message
} from "@/integrations/api/services/messaging.service";

export default function MessagingPlatform() {
  const { user } = useAuth();
  const { toast } = useToast();

  // State for data
  const [channels, setChannels] = useState<Channel[]>([]);
  const [directMessageUsers, setDirectMessageUsers] = useState<DirectMessageUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // State for UI
  const [newMessage, setNewMessage] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeConversationTitle, setActiveConversationTitle] = useState("Select a conversation");
  const [activeTab, setActiveTab] = useState("channels");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [channelsResp, dmsResp] = await Promise.all([
          messagingService.getChannels(),
          messagingService.getDirectMessages()
        ]);

        if (channelsResp.data) {
          setChannels(channelsResp.data);
          // Set first channel as active if no active conversation
          if (!activeConversationId && channelsResp.data.length > 0) {
            setActiveConversationId(channelsResp.data[0].id);
            setActiveConversationTitle(channelsResp.data[0].name);
            setActiveTab("channels");
          }
        }

        if (dmsResp.data) {
          setDirectMessageUsers(dmsResp.data);
        }
      } catch (error) {
        console.error("Failed to fetch messaging data:", error);
        toast({
          title: "Error",
          description: "Failed to load messaging data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeConversationId) return;

      try {
        setIsLoadingMessages(true);
        const response = await messagingService.getMessages(activeConversationId);
        if (response.data) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [activeConversationId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !activeConversationId) return;

    // Optimistic update (optional, but good for UX)
    // For now, we'll just wait for the API
    try {
      const response = await messagingService.sendMessage(activeConversationId, {
        content: newMessage
      });

      if (response.data) {
        setMessages([...messages, response.data]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive"
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChannelSelect = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
      setActiveConversationId(channel.id);
      setActiveConversationTitle(`#${channel.name}`);
      setActiveConversationId(channel.id);
    }
  };

  const handleUserSelect = async (userId: string) => {
    const user = directMessageUsers.find(u => u.id === userId);
    if (!user) return;

    setActiveConversationTitle(user.name);

    // If we already have a conversationId for this user, use it
    if (user.conversationId) {
      setActiveConversationId(user.conversationId);
      return;
    }

    // Otherwise create/start one
    try {
      setIsLoadingMessages(true);
      const response = await messagingService.startDirectMessage(userId);
      if (response.data) {
        // Update user with new conversation ID locally
        setDirectMessageUsers(prev =>
          prev.map(u => u.id === userId ? { ...u, conversationId: response.data!.conversationId } : u)
        );
        setActiveConversationId(response.data.conversationId);
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast({
        title: "Error",
        description: "Failed to start conversation.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingMessages(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-140px)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-500">Loading messaging...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-140px)] flex">
      {/* Left sidebar - Channels and DMs */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Kidato Class</h2>
          <p className="text-xs text-gray-400">Mathematics 101</p>
        </div>

        <Tabs
          defaultValue="channels"
          className="w-full"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="px-2 pt-2">
            <TabsList className="w-full bg-gray-700">
              <TabsTrigger value="channels" className="w-1/2 data-[state=active]:bg-gray-600">
                <Hash className="h-4 w-4 mr-1" /> Channels
              </TabsTrigger>
              <TabsTrigger value="dms" className="w-1/2 data-[state=active]:bg-gray-600">
                <MessageCircle className="h-4 w-4 mr-1" /> DMs
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="channels" className="mt-0 p-0">
            <ChannelsList
              channels={channels}
              activeChannel={activeConversationId || ""}
              setActiveChannel={handleChannelSelect}
            />
          </TabsContent>

          <TabsContent value="dms" className="mt-0 p-0">
            <UsersList
              users={directMessageUsers}
              onSelectUser={handleUserSelect}
              activeUserId={activeConversationId || ""}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-auto p-3 bg-gray-900">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-500 text-white">
                {user?.fullName ? user.fullName.split(" ").map(n => n[0]).join("") : "ME"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <p className="text-sm font-medium">{user?.fullName || "User"}</p>
              <p className="text-xs text-gray-400">{user?.role || "Student"}</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto text-gray-400 hover:text-white">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content - Messages */}
      <div className="flex-1 flex flex-col">
        {/* Channel header */}
        <div className="flex items-center justify-between px-6 py-3 border-b">
          <div className="flex items-center">
            {activeTab === "channels" ? (
              <Hash className="h-5 w-5 text-gray-500 mr-2" />
            ) : (
              <Users className="h-5 w-5 text-gray-500 mr-2" />
            )}
            <h2 className="font-medium">{activeConversationTitle}</h2>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Users className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon">
              <FileText className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-4">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageCircle className="h-12 w-12 mb-2" />
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Message input */}
        <div className="p-4 border-t">
          <div className="flex items-end bg-gray-100 rounded-lg p-2">
            <div className="flex space-x-2 mb-2 px-2">
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800">
                <PlusCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800">
                <Image className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1">
              <Input
                placeholder={`Message ${activeConversationTitle}`}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoadingMessages || !activeConversationId}
              />
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-800">
                <Smile className="h-5 w-5" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={newMessage.trim() === "" || isLoadingMessages || !activeConversationId}
                className="ml-2 bg-kidato-purple hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar - Member list - Currently hidden/static since API doesn't support generic member list yet */}
      <div className="w-60 border-l bg-gray-50 p-4 hidden lg:block">
        <h3 className="font-medium text-sm uppercase text-gray-500 mb-4">Conversation Members</h3>
        <p className="text-sm text-gray-500 italic">Select a channel to view members</p>
      </div>
    </div>
  );
}
