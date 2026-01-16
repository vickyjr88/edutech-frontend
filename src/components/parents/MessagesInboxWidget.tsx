
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { messagingService } from "@/integrations/api/services/messaging.service";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

const MessagesInboxWidget = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recentMessages, setRecentMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecentMessages = async () => {
            if (!user?.id) return;

            try {
                setIsLoading(true);
                const dmsResponse = await messagingService.getDirectMessages();

                if (dmsResponse.data) {
                    const activeDMs = dmsResponse.data
                        .filter(dm => dm.conversationId)
                        .slice(0, 3); // Just show top 3

                    const previews = await Promise.all(
                        activeDMs.map(async (dm) => {
                            let lastMsgContent = "No messages yet";
                            let time = "";
                            let timestamp = new Date().toISOString();

                            if (dm.conversationId) {
                                try {
                                    const msgsResp = await messagingService.getMessages(dm.conversationId, 1, 1);
                                    const msgs = Array.isArray(msgsResp.data) ? msgsResp.data : (msgsResp.data as any)?.messages || [];

                                    if (msgs.length > 0) {
                                        const lastMsg = msgs[0];
                                        lastMsgContent = lastMsg.content;
                                        timestamp = lastMsg.timestamp;
                                        time = formatDistanceToNow(new Date(lastMsg.timestamp), { addSuffix: true });
                                    }
                                } catch (e) {
                                    // ignore
                                }
                            }

                            return {
                                id: dm.id,
                                conversationId: dm.conversationId,
                                name: dm.name,
                                role: dm.role,
                                lastMessage: lastMsgContent,
                                time: time,
                                timestamp: timestamp,
                                unread: (dm.unreadCount || 0) > 0,
                                avatar: dm.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                            };
                        })
                    );

                    // Sort by timestamp
                    previews.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                    setRecentMessages(previews);
                }
            } catch (err) {
                console.error("Failed to fetch recent messages", err);
                setError("Failed to load messages");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecentMessages();
    }, [user?.id]);

    const handleViewAll = () => {
        navigate('/parents-messages');
    };

    const handleMessageClick = (conversationId: string) => {
        navigate('/parents-messaging', { state: { conversationId } });
    };

    return (
        <Card className="border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium flex items-center">
                    <MessageSquare className="mr-2 h-5 w-5 text-kidato-purple" />
                    Messages Inbox
                </CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={handleViewAll}
                >
                    View All
                    <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
            </CardHeader>
            <CardContent className="p-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-2">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        <span className="text-sm text-gray-500">Loading messages...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-6 text-gray-500">
                        <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">{error}</p>
                    </div>
                ) : recentMessages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <div className="h-12 w-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <MessageSquare className="h-6 w-6 text-gray-300" />
                        </div>
                        <p className="text-sm">No messages yet</p>
                        <Button
                            variant="link"
                            className="text-xs text-blue-600 mt-1"
                            onClick={() => navigate('/parents-teachers')}
                        >
                            Contact a teacher
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className="group flex items-start gap-4 p-3 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-blue-100 cursor-pointer transition-all duration-200"
                                onClick={() => handleMessageClick(msg.conversationId)}
                            >
                                <div className="relative">
                                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-base font-bold">
                                            {msg.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    {msg.unread && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-pulse shadow-sm"></span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-0.5">
                                        <h4 className="font-semibold text-sm truncate pr-2">{msg.name}</h4>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{msg.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-1 italic">
                                        {msg.lastMessage}
                                    </p>
                                    {msg.unread && (
                                        <Badge variant="outline" className="mt-1 h-4 text-[9px] py-0 bg-blue-50 text-blue-600 border-blue-200">
                                            New Message
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default MessagesInboxWidget;
