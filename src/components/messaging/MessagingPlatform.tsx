import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Users,
  Hash,
  Settings,
  Loader2
} from "lucide-react";
import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";
import ChannelHeader from "./ChannelHeader";
import ChannelsList from "./ChannelsList";
import UsersList from "./UsersList";
import CreateChannelDialog from "./CreateChannelDialog";
import NewConversationDialog from "./NewConversationDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  messagingService,
  Channel,
  DirectMessageUser,
  Message,
  ChannelMember,
  PinnedMessage
} from "@/integrations/api/services/messaging.service";

export default function MessagingPlatform() {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Socket state
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Data state
  const [channels, setChannels] = useState<Channel[]>([]);
  const [directMessageUsers, setDirectMessageUsers] = useState<DirectMessageUser[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // UI State
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    location.state?.conversationId || null
  );
  const [activeConversationTitle, setActiveConversationTitle] = useState("Select a conversation");
  const [activeTab, setActiveTab] = useState("channels");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Dialog State
  const [createChannelOpen, setCreateChannelOpen] = useState(false);
  const [newConversationOpen, setNewConversationOpen] = useState(false);
  const [channelMembers, setChannelMembers] = useState<ChannelMember[]>([]);
  const [pinnedMessages, setPinnedMessages] = useState<PinnedMessage[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Initialize Socket connection
  useEffect(() => {
    if (!user) return;

    // In a real app, URL comes from env. Assuming standard localhost:8080/messaging based on guide
    const socketUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8080/messaging';

    // Check if WS_URL starts with ws/wss to switch to http/https for socket.io client which expects http url usually (it upgrades internally)
    // But if using a raw websocket server it might be different. 
    // Socket.io client usually takes the http url of the server.
    const newSocket = io(socketUrl, {
      auth: {
        userId: user.id
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to messaging service');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from messaging service');
      setIsConnected(false);
    });

    newSocket.on('message:new', (message: Message) => {
      setMessages(prev => {
        // Ideally checking for channel match
        return [...prev, message];
      });
      setTimeout(() => scrollToBottom(), 100);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [user]);

  // Join channel when active conversation changes
  useEffect(() => {
    if (socket && activeConversationId) {
      socket.emit('channel:join', { channelId: activeConversationId });
    }
  }, [socket, activeConversationId]);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [channelsResp, dmsResp] = await Promise.all([
        messagingService.getChannels(),
        messagingService.getDirectMessages()
      ]);

      if (channelsResp.data) {
        const mappedChannels = channelsResp.data.map((c: any) => ({
          ...c,
          id: c.id || c._id
        }));
        setChannels(mappedChannels);
      }

      if (dmsResp.data) {
        setDirectMessageUsers(dmsResp.data);
      }
    } catch (error) {
      console.error("Failed to fetch messaging data:", error);
      toast({
        title: "Error",
        description: "Failed to load messaging data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [toast]);

  // Initial data fetch - run only once on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Automatically select first channel if none selected and data loaded
  useEffect(() => {
    if (!activeConversationId && channels.length > 0 && !isInitialLoad) {
      const firstChannel = channels[0];
      setActiveConversationId(firstChannel.id);
      setActiveConversationTitle(firstChannel.name);
      setActiveTab("channels");
    }
  }, [channels, activeConversationId, isInitialLoad]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    const fetchConversationData = async () => {
      if (!activeConversationId) return;

      try {
        setIsLoadingMessages(true);

        // Fetch messages, members, pinned messages, and notification settings in parallel
        const [messagesResp, membersResp, pinnedResp, notifResp] = await Promise.all([
          messagingService.getMessages(activeConversationId),
          messagingService.getChannelMembers(activeConversationId).catch(() => ({ data: [] })),
          messagingService.getPinnedMessages(activeConversationId).catch(() => ({ data: [] })),
          messagingService.getNotificationSettings(activeConversationId).catch(() => ({ data: { notificationsEnabled: true } }))
        ]);

        if (messagesResp.data) {
          const rawMsgs = Array.isArray(messagesResp.data) ? messagesResp.data : (messagesResp.data as any).messages || [];

          const mappedMsgs = rawMsgs.map((msg: any) => ({
            id: msg.id || msg._id,
            conversationId: msg.channel || activeConversationId,
            content: msg.content,
            timestamp: msg.createdAt || new Date().toISOString(),
            createdAt: new Date(msg.createdAt || Date.now()),
            author: {
              id: msg.sender?.id || msg.sender?._id || 'unknown',
              name: msg.sender?.fullName || 'Unknown User',
              role: msg.sender?.role ? (msg.sender.role.charAt(0).toUpperCase() + msg.sender.role.slice(1)) : 'User',
              avatar: msg.sender?.profileImage
            },
            reactions: msg.reactions || [],
            attachments: msg.attachments || []
          }));

          setMessages(mappedMsgs);
          setTimeout(() => scrollToBottom(), 100);
        }

        if (membersResp.data) {
          setChannelMembers(membersResp.data);
        }

        if (pinnedResp.data) {
          setPinnedMessages(pinnedResp.data);
        }

        if (notifResp.data) {
          setNotificationsEnabled(notifResp.data.notificationsEnabled);
        }
      } catch (error) {
        console.error("Failed to fetch conversation data:", error);
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchConversationData();
  }, [activeConversationId]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;
    if (!activeConversationId) return;

    try {
      // If there are attachments, use the file upload endpoint
      if (attachments && attachments.length > 0) {
        const response = await messagingService.sendMessageWithAttachments(
          activeConversationId,
          content,
          attachments
        );
        if (response.data) {
          const rawMsg: any = response.data;
          const mappedMsg: Message = {
            id: rawMsg.id || rawMsg._id,
            conversationId: rawMsg.channel || activeConversationId,
            content: rawMsg.content,
            timestamp: rawMsg.createdAt || new Date().toISOString(),
            createdAt: new Date(rawMsg.createdAt || Date.now()),
            author: {
              id: rawMsg.sender?.id || rawMsg.sender?._id || 'unknown',
              name: rawMsg.sender?.fullName || 'Unknown User',
              role: rawMsg.sender?.role ? (rawMsg.sender.role.charAt(0).toUpperCase() + rawMsg.sender.role.slice(1)) : 'User',
              avatar: rawMsg.sender?.profileImage
            },
            reactions: rawMsg.reactions || [],
            attachments: rawMsg.attachments || []
          };
          setMessages([...messages, mappedMsg]);
          setTimeout(() => scrollToBottom(), 100);
        }
        return;
      }

      // No attachments - use socket or REST
      if (socket && isConnected) {
        socket.emit('message:send', {
          channelId: activeConversationId,
          content: content,
          type: 'text'
        });

        const tempMsg: Message = {
          id: `temp-${Date.now()}`,
          conversationId: activeConversationId,
          content: content,
          author: {
            id: user?.id || 'me',
            name: user?.fullName || 'Me',
            role: user?.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'User',
            avatar: (user as any)?.profileImage || (user as any)?.avatar
          },
          timestamp: new Date().toISOString(),
          createdAt: new Date(),
          reactions: []
        };

        setMessages(prev => [...prev, tempMsg]);
        setTimeout(() => scrollToBottom(), 100);
      } else {
        const response = await messagingService.sendMessage(activeConversationId, { content });
        if (response.data) {
          const rawMsg: any = response.data;
          const mappedMsg: Message = {
            id: rawMsg.id || rawMsg._id,
            conversationId: rawMsg.channel || activeConversationId,
            content: rawMsg.content,
            timestamp: rawMsg.createdAt || new Date().toISOString(),
            createdAt: new Date(rawMsg.createdAt || Date.now()),
            author: {
              id: rawMsg.sender?.id || rawMsg.sender?._id || 'unknown',
              name: rawMsg.sender?.fullName || 'Unknown User',
              role: rawMsg.sender?.role ? (rawMsg.sender.role.charAt(0).toUpperCase() + rawMsg.sender.role.slice(1)) : 'User',
              avatar: rawMsg.sender?.profileImage
            },
            reactions: rawMsg.reactions || [],
            attachments: rawMsg.attachments || []
          };
          setMessages([...messages, mappedMsg]);
          setTimeout(() => scrollToBottom(), 100);
        }
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

  const handleToggleNotifications = async () => {
    if (!activeConversationId) return;

    try {
      const newValue = !notificationsEnabled;
      await messagingService.updateNotificationSettings(activeConversationId, newValue);
      setNotificationsEnabled(newValue);
      toast({
        title: newValue ? "Notifications enabled" : "Notifications muted",
        description: newValue ? "You will receive notifications for this conversation" : "You won't receive notifications for this conversation"
      });
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive"
      });
    }
  };

  const handleSearch = async (query: string) => {
    if (!activeConversationId || !query.trim()) return;

    try {
      const response = await messagingService.searchMessages(activeConversationId, query);
      if (response.data && response.data.length > 0) {
        toast({
          title: `Found ${response.data.length} results`,
          description: `Search results for "${query}"`
        });
        // TODO: Highlight or scroll to search results
      } else {
        toast({
          title: "No results found",
          description: `No messages matching "${query}"`
        });
      }
    } catch (error) {
      console.error("Search failed:", error);
    }
  };



  const handleChannelSelect = (channelId: string) => {
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
      setActiveConversationId(channel.id);
      setActiveConversationTitle(`#${channel.name}`);
    }
  };

  const handleUserSelect = async (userId: string) => {
    const user = directMessageUsers.find(u => u.id === userId);
    if (!user) return;

    setActiveConversationTitle(user.name);

    if (user.conversationId) {
      setActiveConversationId(user.conversationId);
      return;
    }

    try {
      setIsLoadingMessages(true);
      const response = await messagingService.startDirectMessage(userId);
      if (response.data) {
        setDirectMessageUsers(prev =>
          prev.map(u => u.id === userId ? { ...u, conversationId: response.data!.conversationId } : u)
        );
        setActiveConversationId(response.data.conversationId);
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const onChannelCreated = () => {
    fetchData(); // Refresh list
  };

  const onConversationStarted = (conversationId: string) => {
    setActiveConversationId(conversationId);
    fetchData(); // Refresh lists
    // Ideally we also find the name to set the title, for now logic inside fetchData or handleUserSelect handles parts of it
    // But since we just got an ID, we might need to fetch details if not in list. 
    // Assuming fetchData will pull it into DMs list.
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
      <div className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold">Messages</h2>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide">
            {user?.role ? `${user.role} Dashboard` : 'Dashboard'}
          </p>
        </div>

        <Tabs
          defaultValue="channels"
          className="w-full flex-1 flex flex-col"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="px-2 py-3 bg-gray-900">
            <TabsList className="w-full bg-gray-800 text-gray-400">
              <TabsTrigger
                value="channels"
                className="w-1/2 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
              >
                <Hash className="h-4 w-4 mr-2" />
                Channels
              </TabsTrigger>
              <TabsTrigger
                value="dms"
                className="w-1/2 data-[state=active]:bg-gray-700 data-[state=active]:text-white"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                DMs
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1">
            <TabsContent value="channels" className="mt-0 p-0 border-0">
              <ChannelsList
                channels={channels}
                activeChannel={activeConversationId || ""}
                setActiveChannel={handleChannelSelect}
                onCreateChannel={() => setCreateChannelOpen(true)}
              />
            </TabsContent>

            <TabsContent value="dms" className="mt-0 p-0 border-0">
              <UsersList
                users={directMessageUsers}
                onSelectUser={handleUserSelect}
                activeUserId={activeConversationId || ""}
                onNewConversation={() => setNewConversationOpen(true)}
              />
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* User Profile Footer */}
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center">
            <Avatar className="h-9 w-9 border border-gray-600">
              <AvatarFallback className="bg-indigo-600 text-white font-medium">
                {user?.fullName ? user.fullName.split(" ").map(n => n[0]).join("") : "ME"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user?.fullName || "User"}</p>
              <p className="text-xs text-gray-400 truncate capitalize">{user?.role || "Student"}</p>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto text-gray-400 hover:text-white hover:bg-gray-700">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content - Messages */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat header */}
        <ChannelHeader
          title={activeConversationTitle}
          isChannel={activeTab === "channels"}
          members={channelMembers}
          pinnedMessages={pinnedMessages}
          onToggleNotifications={handleToggleNotifications}
          notificationsEnabled={notificationsEnabled}
          onSearch={handleSearch}
        />

        {/* Messages area */}
        <div
          className="flex-1 overflow-y-auto p-6 bg-white"
          ref={scrollRef}
        >
          {isLoadingMessages ? (
            <div className="flex flex-col items-center justify-center h-full space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              <p className="text-sm text-gray-500">Loading conversation...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-10 w-10 text-gray-300" />
              </div>
              <p className="text-lg font-medium text-gray-500">No messages yet</p>
              <p className="text-sm text-gray-400">Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.map((message) => (
                <MessageItem key={message.id} message={message} />
              ))}
            </div>
          )}
        </div>

        {/* Message input area */}
        <MessageInput
          placeholder={`Message ${activeConversationTitle}`}
          onSendMessage={handleSendMessage}
          disabled={!activeConversationId}
          isLoading={isLoadingMessages}
        />
      </div>

      {/* Right sidebar - Member list */}
      <div className="w-72 border-l bg-white hidden lg:flex flex-col h-full">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-500">
            Conversation Members
          </h3>
        </div>
        <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
          {!activeConversationId ? (
            <>
              <Users className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500 italic">Select a channel to view members</p>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-sm text-gray-400">Member list coming soon</p>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <CreateChannelDialog
        open={createChannelOpen}
        onOpenChange={setCreateChannelOpen}
        onChannelCreated={onChannelCreated}
      />

      <NewConversationDialog
        open={newConversationOpen}
        onOpenChange={setNewConversationOpen}
        onConversationStarted={onConversationStarted}
      />
    </div>
  );
}
