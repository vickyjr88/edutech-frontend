import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Check, Trash2, Bell, Info, CreditCard, MessageSquare, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { notificationService, Notification } from "@/services/notificationService";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            // In a real app, we'd handle pagination. For MVP, fetching first page.
            const result = await notificationService.getNotifications({
                limit: 50,
                isRead: activeTab === "unread" ? false : undefined
            });
            setNotifications(result.notifications);
        } catch (error) {
            toast.error("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [activeTab]);

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead([id]);
            setNotifications(prev => prev.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            ));
            toast.success("Marked as read");
        } catch (error) {
            toast.error("Failed to mark as read");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success("All notifications marked as read");
        } catch (error) {
            toast.error("Failed to mark all as read");
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link click if wrapped
        try {
            await notificationService.deleteNotification(id);
            setNotifications(prev => prev.filter(n => n._id !== id));
            toast.success("Notification deleted");
        } catch (error) {
            toast.error("Failed to delete notification");
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'payment': return <CreditCard className="h-5 w-5 text-green-500" />;
            case 'new_message': return <MessageSquare className="h-5 w-5 text-blue-500" />;
            case 'class_reminder': return <Calendar className="h-5 w-5 text-purple-500" />;
            case 'system': return <Info className="h-5 w-5 text-gray-500" />;
            default: return <Bell className="h-5 w-5 text-kidato-purple" />;
        }
    };

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-500">Stay updated with your latest activities</p>
                </div>
                <Button variant="outline" onClick={handleMarkAllRead} className="text-sm">
                    <Check className="mr-2 h-4 w-4" /> Mark all as read
                </Button>
            </div>

            <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="unread">Unread</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12">Loading...</div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-200">
                            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
                            <p className="text-gray-500">You're all caught up!</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <Card
                                key={notification._id}
                                className={`transition-colors hover:shadow-md ${!notification.isRead ? 'bg-blue-50/50 border-blue-100' : 'bg-white'}`}
                            >
                                <CardContent className="p-4 flex gap-4">
                                    <div className="mt-1 flex-shrink-0">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${!notification.isRead ? 'bg-white shadow-sm' : 'bg-gray-100'}`}>
                                            {getIcon(notification.type)}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-sm font-semibold ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                                {notification.title}
                                            </h4>
                                            <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                                {format(new Date(notification.createdAt), "MMM d, h:mm a")}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                            {notification.content}
                                        </p>

                                        <div className="flex items-center gap-3">
                                            {notification.actionUrl && (
                                                <Link to={notification.actionUrl.replace(process.env.FRONTEND_URL || '', '') || notification.link || '#'}>
                                                    <Button size="sm" variant="default" className="h-7 text-xs">
                                                        {notification.actionText || 'View Details'}
                                                    </Button>
                                                </Link>
                                            )}

                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => handleMarkAsRead(notification._id)}
                                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                                >
                                                    Mark as read
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => handleDelete(notification._id, e)}
                                        className="text-gray-400 hover:text-red-500 transition-colors self-start"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default NotificationsPage;
