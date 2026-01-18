import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Bell, Users, Search, FileText, Hash, X, Pin, Loader2 } from "lucide-react";

interface Member {
    id: string;
    name: string;
    role: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away';
}

interface PinnedMessage {
    id: string;
    content: string;
    author: string;
    pinnedAt: string;
}

interface ChannelHeaderProps {
    title: string;
    isChannel: boolean;
    members?: Member[];
    pinnedMessages?: PinnedMessage[];
    onSearch?: (query: string) => void;
    onToggleNotifications?: () => void;
    notificationsEnabled?: boolean;
}

export default function ChannelHeader({
    title,
    isChannel,
    members = [],
    pinnedMessages = [],
    onSearch,
    onToggleNotifications,
    notificationsEnabled = true,
}: ChannelHeaderProps) {
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [pinnedOpen, setPinnedOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch && searchQuery.trim()) {
            onSearch(searchQuery);
        }
    };

    const getInitials = (name: string) => {
        return name.split(" ").map(n => n[0]).join("").toUpperCase();
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'away': return 'bg-yellow-500';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    {isChannel ? <Hash className="h-5 w-5" /> : <Users className="h-5 w-5" />}
                </div>
                <div>
                    <h2 className="font-semibold text-lg text-gray-800">{title}</h2>
                    {members.length > 0 && (
                        <p className="text-xs text-gray-500">{members.length} members</p>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-1">
                {/* Notifications Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className={`text-gray-500 hover:bg-gray-100 ${!notificationsEnabled ? 'text-gray-300' : ''}`}
                    onClick={onToggleNotifications}
                    title={notificationsEnabled ? "Mute notifications" : "Unmute notifications"}
                >
                    <Bell className={`h-5 w-5 ${!notificationsEnabled ? 'opacity-50' : ''}`} />
                </Button>

                {/* Members Sheet */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100">
                            <Users className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle>Members ({members.length})</SheetTitle>
                        </SheetHeader>
                        <ScrollArea className="h-[calc(100vh-100px)] mt-4">
                            {members.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <Users className="h-12 w-12 mb-3" />
                                    <p>No members to show</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {members.map((member) => (
                                        <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                            <div className="relative">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-indigo-100 text-indigo-600 font-medium">
                                                        {getInitials(member.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{member.name}</p>
                                                <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </SheetContent>
                </Sheet>

                {/* Search Dialog */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:bg-gray-100"
                    onClick={() => setSearchOpen(true)}
                >
                    <Search className="h-5 w-5" />
                </Button>
                <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Search in {title}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Search messages..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                <Button type="submit">Search</Button>
                            </div>
                            <p className="text-xs text-gray-500">
                                Search functionality coming soon. This will search through all messages in the conversation.
                            </p>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Pinned Messages */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:bg-gray-100"
                    onClick={() => setPinnedOpen(true)}
                >
                    <FileText className="h-5 w-5" />
                </Button>
                <Dialog open={pinnedOpen} onOpenChange={setPinnedOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Pin className="h-5 w-5" />
                                Pinned Messages
                            </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="max-h-[400px]">
                            {pinnedMessages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                                    <Pin className="h-12 w-12 mb-3 opacity-50" />
                                    <p className="font-medium">No pinned messages</p>
                                    <p className="text-sm">Important messages will appear here when pinned</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {pinnedMessages.map((msg) => (
                                        <div key={msg.id} className="p-3 bg-gray-50 rounded-lg border">
                                            <p className="text-sm text-gray-800">{msg.content}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Pinned by {msg.author} • {msg.pinnedAt}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
